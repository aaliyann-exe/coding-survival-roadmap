# Small, boring multi-stage build. The pgx driver is pure Go (no CGO), so
# the final image is a static binary on a minimal base — no libc, no SQLite
# shared library, nothing extra to go wrong.
FROM golang:1.26-alpine AS build
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/roadmap-backend .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
COPY --from=build /out/roadmap-backend /usr/local/bin/roadmap-backend

# The hosting platform sets PORT; DATABASE_URL and ALLOW_ORIGIN must be
# provided as environment variables at deploy time.
EXPOSE 8080
ENTRYPOINT ["roadmap-backend"]
