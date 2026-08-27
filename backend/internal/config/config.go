// Package config loads the handful of settings this server needs. No viper,
// no flags framework — just env vars with sane defaults, optionally seeded
// from a ".env" file so `go run .` works without exporting anything by hand.
package config

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type Config struct {
	Port        string
	DatabaseURL string
	AllowOrigin string
}

// Load reads configuration from the environment (optionally seeded from a
// local ".env" file). DATABASE_URL has no default — unlike a local SQLite
// path, there's no sensible default remote database to fall back to, so a
// missing value is a startup error rather than a silent surprise.
func Load() (Config, error) {
	loadDotEnv(".env")

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required (a PostgreSQL connection string)")
	}

	return Config{
		Port:        getenv("PORT", "8080"),
		DatabaseURL: databaseURL,
		AllowOrigin: getenv("ALLOW_ORIGIN", "http://localhost:5173"),
	}, nil
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// loadDotEnv sets process env vars from a simple KEY=VALUE file, one per
// line. It never overrides a variable that's already set in the real
// environment, and it's fine for the file to not exist at all.
func loadDotEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		value = strings.Trim(value, `"'`)
		if _, exists := os.LookupEnv(key); !exists {
			os.Setenv(key, value)
		}
	}
}
