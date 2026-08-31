/**
 * One page-scroll lock, shared by every overlay.
 *
 * Each dialog used to set and clear `document.body.style.overflow` itself,
 * which is fine until two of them overlap — and three of them can:
 *
 *   - the command palette opens over a topic brief (Ctrl+K works everywhere),
 *   - a project brief opens over the topic brief that linked to it,
 *   - the login sheet opens on a first visit while anything else is up.
 *
 * Whichever one closed first cleared the lock, and the page behind the
 * still-open dialog started scrolling again. Counting the holders instead
 * means the lock lifts only when the last one lets go.
 */
let holders = 0;

export function useScrollLock() {
  function lock() {
    holders += 1;
    if (holders === 1) document.body.style.overflow = "hidden";
  }

  /** Safe to call when this caller never locked — releasing below zero is
   * treated as a no-op rather than corrupting the count for everyone else. */
  function unlock() {
    if (holders === 0) return;
    holders -= 1;
    if (holders === 0) document.body.style.overflow = "";
  }

  return { lock, unlock };
}
