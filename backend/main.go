// Command roadmap-backend is a very small REST API that persists which
// roadmap tasks/projects a user has completed. See backend/README.md for
// how to run it and what it does.
package main

import (
	"log"
	"net/http"

	"roadmap-backend/internal/config"
	"roadmap-backend/internal/database"
	"roadmap-backend/internal/handlers"
	"roadmap-backend/internal/store"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	db, err := database.Open(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer db.Close()

	h := handlers.New(store.New(db))

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", h.Health)
	mux.HandleFunc("POST /api/users", h.CreateUser)
	mux.HandleFunc("GET /api/users/{username}/progress", h.GetProgress)
	mux.HandleFunc("PUT /api/users/{username}/progress", h.UpdateProgress)

	var app http.Handler = mux
	app = handlers.CORS(cfg.AllowOrigin, app)
	app = handlers.Logging(app)

	log.Printf("roadmap-backend listening on :%s (allowing origin: %s)", cfg.Port, cfg.AllowOrigin)
	if err := http.ListenAndServe(":"+cfg.Port, app); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}
