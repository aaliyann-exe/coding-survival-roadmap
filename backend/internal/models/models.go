// Package models holds the plain data types shared between the store and
// the HTTP handlers, plus the validation rules for anything that came from
// outside the process.
package models

import (
	"errors"
	"regexp"
)

type User struct {
	ID        int64  `json:"id"`
	Username  string `json:"username"`
	CreatedAt string `json:"created_at"`
}

// ItemType is which kind of roadmap item a progress row is for.
type ItemType string

const (
	ItemTypeTask    ItemType = "task"
	ItemTypeProject ItemType = "project"
)

// TaskStatus mirrors the three states the frontend already tracks for a
// topic (see src/composables/useProgress.ts — TopicState). "available" and
// "locked" are never stored; the frontend derives those from prerequisites.
type TaskStatus string

const (
	StatusInProgress TaskStatus = "in-progress"
	StatusCompleted  TaskStatus = "completed"
	StatusMastered   TaskStatus = "mastered"
)

// Progress is what GET /api/users/{username}/progress returns. Tasks map to
// their status; projects are a flat list because a project only has one
// meaningful state once you've built it.
type Progress struct {
	Tasks    map[string]TaskStatus `json:"tasks"`
	Projects []string              `json:"projects"`
}

var (
	usernamePattern = regexp.MustCompile(`^[a-zA-Z0-9 _-]{1,32}$`)
	itemIDPattern   = regexp.MustCompile(`^[a-zA-Z0-9_-]{1,100}$`)
)

var (
	ErrInvalidUsername = errors.New("username must be 1-32 characters (letters, numbers, spaces, - or _)")
	ErrInvalidItemType = errors.New(`item type must be "task" or "project"`)
	ErrInvalidItemID   = errors.New("item_id is required and must look like a roadmap slug")
	ErrInvalidStatus   = errors.New(`status must be "in-progress", "completed", or "mastered"`)
)

func ValidateUsername(username string) error {
	if !usernamePattern.MatchString(username) {
		return ErrInvalidUsername
	}
	return nil
}

func ValidateItemType(itemType string) (ItemType, error) {
	switch ItemType(itemType) {
	case ItemTypeTask, ItemTypeProject:
		return ItemType(itemType), nil
	default:
		return "", ErrInvalidItemType
	}
}

func ValidateItemID(itemID string) error {
	if !itemIDPattern.MatchString(itemID) {
		return ErrInvalidItemID
	}
	return nil
}

func ValidateTaskStatus(status string) (TaskStatus, error) {
	switch TaskStatus(status) {
	case StatusInProgress, StatusCompleted, StatusMastered:
		return TaskStatus(status), nil
	default:
		return "", ErrInvalidStatus
	}
}
