package handlers

import (
	"log"
	"net/http"
	"time"
)

// CORS allows the Vite dev server (or wherever the frontend is actually
// served from — set ALLOW_ORIGIN) to call this API from the browser.
// Everything else is refused: no wildcard origin, since the whole point of
// a username is to keep one browser's requests distinguishable as one user.
func CORS(allowOrigin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Logging prints one line per request. Nothing fancy — this is a personal
// project with a handful of users, not a service that needs structured logs
// shipped somewhere.
func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s (%s)", r.Method, r.URL.Path, time.Since(start))
	})
}
