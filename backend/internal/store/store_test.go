package store

import (
	"errors"
	"os"
	"testing"

	"roadmap-backend/internal/database"
	"roadmap-backend/internal/models"
)

// newTestStore connects to a real PostgreSQL database (given via
// TEST_DATABASE_URL — point this at a throwaway local/dev database, never
// production) and wipes it before each test so tests can't see each other's
// data. Skips the whole package if the variable isn't set, since this is a
// personal project and CI/sandbox environments won't always have a Postgres
// instance handy.
func newTestStore(t *testing.T) *Store {
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

	return New(db)
}

func TestCreateUser(t *testing.T) {
	s := newTestStore(t)

	user, err := s.CreateOrGetUser("aaliyan")
	if err != nil {
		t.Fatalf("CreateOrGetUser: %v", err)
	}
	if user.ID == 0 {
		t.Error("expected a non-zero user id")
	}
	if user.Username != "aaliyan" {
		t.Errorf("username = %q, want %q", user.Username, "aaliyan")
	}
	if user.CreatedAt == "" {
		t.Error("expected created_at to be set")
	}
}

func TestCreateOrGetUser_ReturnsExistingUser(t *testing.T) {
	s := newTestStore(t)

	first, err := s.CreateOrGetUser("aaliyan")
	if err != nil {
		t.Fatalf("first CreateOrGetUser: %v", err)
	}

	second, err := s.CreateOrGetUser("aaliyan")
	if err != nil {
		t.Fatalf("second CreateOrGetUser: %v", err)
	}

	if first.ID != second.ID {
		t.Errorf("expected the same user id both times, got %d then %d", first.ID, second.ID)
	}
}

func TestSetProgress_Task(t *testing.T) {
	s := newTestStore(t)
	if _, err := s.CreateOrGetUser("aaliyan"); err != nil {
		t.Fatalf("create user: %v", err)
	}

	if err := s.SetProgress("aaliyan", models.ItemTypeTask, "how-web-works", models.StatusInProgress); err != nil {
		t.Fatalf("SetProgress: %v", err)
	}

	progress, err := s.GetProgress("aaliyan")
	if err != nil {
		t.Fatalf("GetProgress: %v", err)
	}
	if got := progress.Tasks["how-web-works"]; got != models.StatusInProgress {
		t.Errorf("task status = %q, want %q", got, models.StatusInProgress)
	}
}

func TestSetProgress_Project(t *testing.T) {
	s := newTestStore(t)
	if _, err := s.CreateOrGetUser("aaliyan"); err != nil {
		t.Fatalf("create user: %v", err)
	}

	if err := s.SetProgress("aaliyan", models.ItemTypeProject, "personal-portfolio", models.StatusCompleted); err != nil {
		t.Fatalf("SetProgress: %v", err)
	}

	progress, err := s.GetProgress("aaliyan")
	if err != nil {
		t.Fatalf("GetProgress: %v", err)
	}
	if len(progress.Projects) != 1 || progress.Projects[0] != "personal-portfolio" {
		t.Errorf("projects = %v, want [personal-portfolio]", progress.Projects)
	}
}

func TestSetProgress_UpdatesExistingRow(t *testing.T) {
	s := newTestStore(t)
	if _, err := s.CreateOrGetUser("aaliyan"); err != nil {
		t.Fatalf("create user: %v", err)
	}

	if err := s.SetProgress("aaliyan", models.ItemTypeTask, "css-fundamentals", models.StatusInProgress); err != nil {
		t.Fatalf("SetProgress (in-progress): %v", err)
	}
	if err := s.SetProgress("aaliyan", models.ItemTypeTask, "css-fundamentals", models.StatusCompleted); err != nil {
		t.Fatalf("SetProgress (completed): %v", err)
	}

	progress, err := s.GetProgress("aaliyan")
	if err != nil {
		t.Fatalf("GetProgress: %v", err)
	}
	if len(progress.Tasks) != 1 {
		t.Fatalf("expected exactly one task row (the UNIQUE constraint should upsert), got %d", len(progress.Tasks))
	}
	if got := progress.Tasks["css-fundamentals"]; got != models.StatusCompleted {
		t.Errorf("task status = %q, want %q", got, models.StatusCompleted)
	}
}

func TestClearProgress_TrueToFalse(t *testing.T) {
	s := newTestStore(t)
	if _, err := s.CreateOrGetUser("aaliyan"); err != nil {
		t.Fatalf("create user: %v", err)
	}
	if err := s.SetProgress("aaliyan", models.ItemTypeProject, "calculator", models.StatusCompleted); err != nil {
		t.Fatalf("SetProgress: %v", err)
	}

	if err := s.ClearProgress("aaliyan", models.ItemTypeProject, "calculator"); err != nil {
		t.Fatalf("ClearProgress: %v", err)
	}

	progress, err := s.GetProgress("aaliyan")
	if err != nil {
		t.Fatalf("GetProgress: %v", err)
	}
	if len(progress.Projects) != 0 {
		t.Errorf("expected no projects after clearing, got %v", progress.Projects)
	}
}

func TestGetProgress_UnknownUser(t *testing.T) {
	s := newTestStore(t)

	_, err := s.GetProgress("nobody")
	if !errors.Is(err, ErrUserNotFound) {
		t.Errorf("GetProgress for unknown user: got %v, want ErrUserNotFound", err)
	}
}

func TestGetProgress_EmptyForNewUser(t *testing.T) {
	s := newTestStore(t)
	if _, err := s.CreateOrGetUser("freshuser"); err != nil {
		t.Fatalf("create user: %v", err)
	}

	progress, err := s.GetProgress("freshuser")
	if err != nil {
		t.Fatalf("GetProgress: %v", err)
	}
	if len(progress.Tasks) != 0 || len(progress.Projects) != 0 {
		t.Errorf("expected empty progress for a brand new user, got %+v", progress)
	}
}

func TestTwoUsersHaveIndependentProgress(t *testing.T) {
	s := newTestStore(t)
	if _, err := s.CreateOrGetUser("alice"); err != nil {
		t.Fatalf("create alice: %v", err)
	}
	if _, err := s.CreateOrGetUser("bob"); err != nil {
		t.Fatalf("create bob: %v", err)
	}

	if err := s.SetProgress("alice", models.ItemTypeTask, "html-semantics", models.StatusCompleted); err != nil {
		t.Fatalf("SetProgress for alice: %v", err)
	}

	bobProgress, err := s.GetProgress("bob")
	if err != nil {
		t.Fatalf("GetProgress for bob: %v", err)
	}
	if len(bobProgress.Tasks) != 0 {
		t.Errorf("bob should not see alice's progress, got %+v", bobProgress.Tasks)
	}
}

func TestSetProgress_UnknownUser(t *testing.T) {
	s := newTestStore(t)

	err := s.SetProgress("nobody", models.ItemTypeTask, "html-semantics", models.StatusCompleted)
	if !errors.Is(err, ErrUserNotFound) {
		t.Errorf("SetProgress for unknown user: got %v, want ErrUserNotFound", err)
	}
}

// Sanity check on the schema itself: two rows can't exist for the same
// user/type/item, even if something bypassed the store's upsert logic.
func TestUniqueConstraint(t *testing.T) {
	s := newTestStore(t)
	user, err := s.CreateOrGetUser("aaliyan")
	if err != nil {
		t.Fatalf("create user: %v", err)
	}

	insert := `INSERT INTO progress (user_id, item_type, item_id, status, updated_at) VALUES ($1, 'task', 'html-semantics', 'completed', '2024-01-01')`
	if _, err := s.db.Exec(insert, user.ID); err != nil {
		t.Fatalf("first insert: %v", err)
	}

	_, err = s.db.Exec(insert, user.ID)
	if err == nil {
		t.Fatal("expected a UNIQUE constraint violation on the second insert, got nil error")
	}
}
