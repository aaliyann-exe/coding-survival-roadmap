// Package store is the only place that touches SQL. Handlers call these
// functions and never see a *sql.DB directly.
package store

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
	"roadmap-backend/internal/models"
)

const pgUniqueViolation = "23505"

var ErrUserNotFound = errors.New("user not found")

type Store struct {
	db *sql.DB
}

func New(db *sql.DB) *Store {
	return &Store{db: db}
}

func now() string {
	return time.Now().UTC().Format(time.RFC3339)
}

// Ping reports whether the database is currently reachable.
func (s *Store) Ping() error {
	return s.db.Ping()
}

// CreateOrGetUser returns the existing user with this username, or creates
// one if it doesn't exist yet. That's the entire "login" flow.
func (s *Store) CreateOrGetUser(username string) (models.User, error) {
	if existing, err := s.getUserByUsername(username); err == nil {
		return existing, nil
	} else if !errors.Is(err, ErrUserNotFound) {
		return models.User{}, err
	}

	createdAt := now()
	var id int64
	err := s.db.QueryRow(
		`INSERT INTO users (username, created_at) VALUES ($1, $2) RETURNING id`,
		username, createdAt,
	).Scan(&id)
	if err != nil {
		// Two requests racing to create the same brand-new username both
		// pass the getUserByUsername check above, then only one insert
		// wins — the loser just falls back to reading what the winner
		// created instead of erroring.
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == pgUniqueViolation {
			return s.getUserByUsername(username)
		}
		return models.User{}, fmt.Errorf("insert user: %w", err)
	}

	return models.User{ID: id, Username: username, CreatedAt: createdAt}, nil
}

func (s *Store) getUserByUsername(username string) (models.User, error) {
	var u models.User
	err := s.db.QueryRow(
		`SELECT id, username, created_at FROM users WHERE username = $1`,
		username,
	).Scan(&u.ID, &u.Username, &u.CreatedAt)

	if errors.Is(err, sql.ErrNoRows) {
		return models.User{}, ErrUserNotFound
	}
	if err != nil {
		return models.User{}, fmt.Errorf("query user: %w", err)
	}
	return u, nil
}

// GetProgress returns every task/project this user has touched.
func (s *Store) GetProgress(username string) (models.Progress, error) {
	user, err := s.getUserByUsername(username)
	if err != nil {
		return models.Progress{}, err
	}

	rows, err := s.db.Query(
		`SELECT item_type, item_id, status FROM progress WHERE user_id = $1`,
		user.ID,
	)
	if err != nil {
		return models.Progress{}, fmt.Errorf("query progress: %w", err)
	}
	defer rows.Close()

	progress := models.Progress{
		Tasks:    map[string]models.TaskStatus{},
		Projects: []string{},
	}
	for rows.Next() {
		var itemType, itemID, status string
		if err := rows.Scan(&itemType, &itemID, &status); err != nil {
			return models.Progress{}, fmt.Errorf("scan progress row: %w", err)
		}
		switch models.ItemType(itemType) {
		case models.ItemTypeTask:
			progress.Tasks[itemID] = models.TaskStatus(status)
		case models.ItemTypeProject:
			progress.Projects = append(progress.Projects, itemID)
		}
	}
	if err := rows.Err(); err != nil {
		return models.Progress{}, fmt.Errorf("read progress rows: %w", err)
	}

	return progress, nil
}

// SetProgress upserts a task/project's status for this user. Status is
// always a concrete value here ("in-progress", "completed", "mastered", or
// — for projects — just "completed"); use ClearProgress to remove a row
// entirely (the equivalent of resetting a topic or unmarking a project).
func (s *Store) SetProgress(username string, itemType models.ItemType, itemID string, status models.TaskStatus) error {
	user, err := s.getUserByUsername(username)
	if err != nil {
		return err
	}

	_, err = s.db.Exec(
		`INSERT INTO progress (user_id, item_type, item_id, status, updated_at)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (user_id, item_type, item_id)
		 DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at`,
		user.ID, itemType, itemID, status, now(),
	)
	if err != nil {
		return fmt.Errorf("upsert progress: %w", err)
	}
	return nil
}

// ClearProgress removes a task/project's row, which is what "reset this
// topic" or "unmark this project" means: the item goes back to whatever
// state the frontend derives for an item with no explicit record.
func (s *Store) ClearProgress(username string, itemType models.ItemType, itemID string) error {
	user, err := s.getUserByUsername(username)
	if err != nil {
		return err
	}

	_, err = s.db.Exec(
		`DELETE FROM progress WHERE user_id = $1 AND item_type = $2 AND item_id = $3`,
		user.ID, itemType, itemID,
	)
	if err != nil {
		return fmt.Errorf("delete progress: %w", err)
	}
	return nil
}
