// Package database opens the PostgreSQL connection and makes sure the
// schema exists. There's no migration framework here on purpose — two
// tables, created with IF NOT EXISTS, is the entire "migration system" this
// project needs.
package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

const schema = `
CREATE TABLE IF NOT EXISTS users (
	id         BIGSERIAL PRIMARY KEY,
	username   TEXT NOT NULL UNIQUE,
	created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
	id         BIGSERIAL PRIMARY KEY,
	user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	item_type  TEXT NOT NULL CHECK (item_type IN ('task', 'project')),
	item_id    TEXT NOT NULL,
	status     TEXT NOT NULL,
	updated_at TEXT NOT NULL,
	UNIQUE (user_id, item_type, item_id)
);
`

// Open connects to the PostgreSQL database at the given connection string
// (e.g. "postgresql://user:pass@host:5432/dbname"), verifies the connection
// is actually reachable, and applies the schema. The pool is kept small —
// this is a personal project with a handful of users, and free-tier hosted
// Postgres instances (Neon, Supabase, etc.) tend to cap the number of
// simultaneous connections they'll allow.
func Open(connString string) (*sql.DB, error) {
	if connString == "" {
		return nil, fmt.Errorf("empty database connection string")
	}

	db, err := sql.Open("pgx", connString)
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}
	db.SetMaxOpenConns(5)
	db.SetMaxIdleConns(2)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("connect to database: %w", err)
	}

	if _, err := db.ExecContext(ctx, schema); err != nil {
		db.Close()
		return nil, fmt.Errorf("apply schema: %w", err)
	}

	return db, nil
}

// Ping reports whether the database is currently reachable, for the /health
// endpoint.
func Ping(db *sql.DB) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	return db.PingContext(ctx)
}
