package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"roadmap-backend/internal/database"
	"roadmap-backend/internal/models"
	"roadmap-backend/internal/store"
)

// newTestServer connects to a real PostgreSQL database (given via
// TEST_DATABASE_URL) and wipes it before each test. See
// internal/store/store_test.go for why.
func newTestServer(t *testing.T) *httptest.Server {
	t.Helper()
	url := os.Getenv("TEST_DATABASE_URL")
	if url == "" {
		t.Skip("TEST_DATABASE_URL not set — skipping tests that need a real PostgreSQL database")
	}

	db, err := database.Open(url)
	if err != nil {
		t.Fatalf("open test database: %v", err)
	}
	t.Cleanup(func() { db.Close() })

	if _, err := db.Exec(`TRUNCATE TABLE progress, users RESTART IDENTITY CASCADE`); err != nil {
		t.Fatalf("reset test database: %v", err)
	}

	h := New(store.New(db))
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/users", h.CreateUser)
	mux.HandleFunc("GET /api/users/{username}/progress", h.GetProgress)
	mux.HandleFunc("PUT /api/users/{username}/progress", h.UpdateProgress)

	return httptest.NewServer(mux)
}

func postJSON(t *testing.T, url string, body any) *http.Response {
	t.Helper()
	b, err := json.Marshal(body)
	if err != nil {
		t.Fatalf("marshal body: %v", err)
	}
	res, err := http.Post(url, "application/json", strings.NewReader(string(b)))
	if err != nil {
		t.Fatalf("POST %s: %v", url, err)
	}
	return res
}

func putJSON(t *testing.T, url string, body any) *http.Response {
	t.Helper()
	b, err := json.Marshal(body)
	if err != nil {
		t.Fatalf("marshal body: %v", err)
	}
	req, err := http.NewRequest(http.MethodPut, url, strings.NewReader(string(b)))
	if err != nil {
		t.Fatalf("build PUT request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("PUT %s: %v", url, err)
	}
	return res
}

func TestCreateUser_EmptyUsername(t *testing.T) {
	srv := newTestServer(t)
	defer srv.Close()

	res := postJSON(t, srv.URL+"/api/users", map[string]string{"username": ""})
	defer res.Body.Close()

	if res.StatusCode != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", res.StatusCode, http.StatusBadRequest)
	}
}

func TestCreateUser_ThenFetchProgress(t *testing.T) {
	srv := newTestServer(t)
	defer srv.Close()

	res := postJSON(t, srv.URL+"/api/users", map[string]string{"username": "aaliyan"})
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("create user status = %d, want %d", res.StatusCode, http.StatusOK)
	}

	progRes, err := http.Get(srv.URL + "/api/users/aaliyan/progress")
	if err != nil {
		t.Fatalf("get progress: %v", err)
	}
	defer progRes.Body.Close()
	if progRes.StatusCode != http.StatusOK {
		t.Fatalf("progress status = %d, want %d", progRes.StatusCode, http.StatusOK)
	}

	var progress models.Progress
	if err := json.NewDecoder(progRes.Body).Decode(&progress); err != nil {
		t.Fatalf("decode progress: %v", err)
	}
	if len(progress.Tasks) != 0 || len(progress.Projects) != 0 {
		t.Errorf("expected empty progress for a new user, got %+v", progress)
	}
}

func TestGetProgress_UnknownUserIs404(t *testing.T) {
	srv := newTestServer(t)
	defer srv.Close()

	res, err := http.Get(srv.URL + "/api/users/nobody/progress")
	if err != nil {
		t.Fatalf("get progress: %v", err)
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusNotFound {
		t.Errorf("status = %d, want %d", res.StatusCode, http.StatusNotFound)
	}
}

func TestUpdateProgress_InvalidItemType(t *testing.T) {
	srv := newTestServer(t)
	defer srv.Close()

	postJSON(t, srv.URL+"/api/users", map[string]string{"username": "aaliyan"}).Body.Close()

	res := putJSON(t, srv.URL+"/api/users/aaliyan/progress", map[string]any{
		"type": "banana", "item_id": "html-semantics", "completed": true,
	})
	defer res.Body.Close()
	if res.StatusCode != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", res.StatusCode, http.StatusBadRequest)
	}
}

func TestUpdateProgress_InvalidItemID(t *testing.T) {
	srv := newTestServer(t)
	defer srv.Close()

	postJSON(t, srv.URL+"/api/users", map[string]string{"username": "aaliyan"}).Body.Close()

	res := putJSON(t, srv.URL+"/api/users/aaliyan/progress", map[string]any{
		"type": "task", "item_id": "not a valid slug!!", "completed": true,
	})
	defer res.Body.Close()
	if res.StatusCode != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", res.StatusCode, http.StatusBadRequest)
	}
}

func TestUpdateProgress_FullRoundTrip(t *testing.T) {
	srv := newTestServer(t)
	defer srv.Close()

	postJSON(t, srv.URL+"/api/users", map[string]string{"username": "aaliyan"}).Body.Close()

	// Mark a task in-progress.
	res := putJSON(t, srv.URL+"/api/users/aaliyan/progress", map[string]any{
		"type": "task", "item_id": "how-web-works", "status": "in-progress",
	})
	res.Body.Close()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("mark in-progress status = %d, want %d", res.StatusCode, http.StatusOK)
	}

	// Mark a project completed.
	res = putJSON(t, srv.URL+"/api/users/aaliyan/progress", map[string]any{
		"type": "project", "item_id": "personal-portfolio", "completed": true,
	})
	res.Body.Close()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("mark project status = %d, want %d", res.StatusCode, http.StatusOK)
	}

	progRes, err := http.Get(srv.URL + "/api/users/aaliyan/progress")
	if err != nil {
		t.Fatalf("get progress: %v", err)
	}
	defer progRes.Body.Close()
	var progress models.Progress
	json.NewDecoder(progRes.Body).Decode(&progress)

	if progress.Tasks["how-web-works"] != models.StatusInProgress {
		t.Errorf("task status = %q, want in-progress", progress.Tasks["how-web-works"])
	}
	if len(progress.Projects) != 1 || progress.Projects[0] != "personal-portfolio" {
		t.Errorf("projects = %v, want [personal-portfolio]", progress.Projects)
	}

	// Now unmark the project.
	res = putJSON(t, srv.URL+"/api/users/aaliyan/progress", map[string]any{
		"type": "project", "item_id": "personal-portfolio", "completed": false,
	})
	res.Body.Close()

	progRes2, err := http.Get(srv.URL + "/api/users/aaliyan/progress")
	if err != nil {
		t.Fatalf("get progress: %v", err)
	}
	defer progRes2.Body.Close()
	var progress2 models.Progress
	json.NewDecoder(progRes2.Body).Decode(&progress2)

	if len(progress2.Projects) != 0 {
		t.Errorf("expected no projects after unmarking, got %v", progress2.Projects)
	}
}
