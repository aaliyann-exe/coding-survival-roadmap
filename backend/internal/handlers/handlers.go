// Package handlers wires HTTP requests to the store. Every handler follows
// the same shape: decode, validate, call the store, encode.
package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"roadmap-backend/internal/models"
	"roadmap-backend/internal/store"
)

type Handlers struct {
	store *store.Store
}

func New(s *store.Store) *Handlers {
	return &Handlers{store: s}
}

type apiError struct {
	Error string `json:"error"`
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if body != nil {
		if err := json.NewEncoder(w).Encode(body); err != nil {
			log.Printf("write response: %v", err)
		}
	}
}

func writeError(w http.ResponseWriter, status int, err error) {
	writeJSON(w, status, apiError{Error: err.Error()})
}

// ---------------------------------------------------------------- users

type createUserRequest struct {
	Username string `json:"username"`
}

// CreateUser handles POST /api/users. It returns the existing user if the
// username is already taken — that's the entire "log in" flow.
func (h *Handlers) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req createUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, errors.New("malformed request body"))
		return
	}

	username := strings.TrimSpace(req.Username)
	if err := models.ValidateUsername(username); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	user, err := h.store.CreateOrGetUser(username)
	if err != nil {
		log.Printf("create user: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("could not create user"))
		return
	}

	writeJSON(w, http.StatusOK, user)
}

// -------------------------------------------------------------- progress

// GetProgress handles GET /api/users/{username}/progress.
func (h *Handlers) GetProgress(w http.ResponseWriter, r *http.Request) {
	username := strings.TrimSpace(r.PathValue("username"))
	if err := models.ValidateUsername(username); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	progress, err := h.store.GetProgress(username)
	if errors.Is(err, store.ErrUserNotFound) {
		writeError(w, http.StatusNotFound, errors.New("no such user"))
		return
	}
	if err != nil {
		log.Printf("get progress: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("could not load progress"))
		return
	}

	writeJSON(w, http.StatusOK, progress)
}

type updateProgressRequest struct {
	Type      string  `json:"type"`
	ItemID    string  `json:"item_id"`
	Status    *string `json:"status,omitempty"`
	Completed *bool   `json:"completed,omitempty"`
}

// UpdateProgress handles PUT /api/users/{username}/progress. It accepts
// either an explicit "status" (for the three-state topics the frontend
// tracks: in-progress / completed / mastered) or a plain "completed"
// boolean (simpler, and all a project needs). Setting completed:false, or
// omitting status entirely with no completed flag, clears the item back to
// "no record" — the same as resetting a topic or unmarking a project.
func (h *Handlers) UpdateProgress(w http.ResponseWriter, r *http.Request) {
	username := strings.TrimSpace(r.PathValue("username"))
	if err := models.ValidateUsername(username); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	var req updateProgressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, errors.New("malformed request body"))
		return
	}

	itemType, err := models.ValidateItemType(req.Type)
	if err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}
	if err := models.ValidateItemID(req.ItemID); err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	// Work out what should happen: clear the row, or upsert with a status.
	clear := false
	var status models.TaskStatus

	switch {
	case req.Status != nil:
		status, err = models.ValidateTaskStatus(*req.Status)
		if err != nil {
			writeError(w, http.StatusBadRequest, err)
			return
		}
		if itemType == models.ItemTypeProject && status != models.StatusCompleted {
			writeError(w, http.StatusBadRequest, errors.New("projects only support status \"completed\" — use completed:false to unmark one"))
			return
		}
	case req.Completed != nil:
		if *req.Completed {
			status = models.StatusCompleted
		} else {
			clear = true
		}
	default:
		writeError(w, http.StatusBadRequest, errors.New("request must include \"status\" or \"completed\""))
		return
	}

	if clear {
		err = h.store.ClearProgress(username, itemType, req.ItemID)
	} else {
		err = h.store.SetProgress(username, itemType, req.ItemID, status)
	}

	if errors.Is(err, store.ErrUserNotFound) {
		writeError(w, http.StatusNotFound, errors.New("no such user"))
		return
	}
	if err != nil {
		log.Printf("update progress: %v", err)
		writeError(w, http.StatusInternalServerError, errors.New("could not save progress"))
		return
	}

	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

// Health handles GET /api/health — just enough for the frontend (or a
// deployment platform's health check, or a human with curl) to tell the
// server is up and can actually reach its database, not just that the
// process is running.
func (h *Handlers) Health(w http.ResponseWriter, r *http.Request) {
	if err := h.store.Ping(); err != nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]any{"ok": false, "database": "unreachable"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "database": "ok"})
}
