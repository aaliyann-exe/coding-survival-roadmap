Done. This is a much deeper pass than the first one:

Fonts actually fixed: Cinzel/EB Garamond/Fira Code are now self-hosted .woff2 files in public/fonts/ with local @font-face rules, instead of a Google Fonts @import — which was very likely the real culprit for "fonts didn't change," since that CDN fetch can fail silently under network restrictions with zero visible error. This can't fail the same way anymore.
Real layout restructuring, not a class swap: rebuilt an ornamental CSS vocabulary (corner-frame brackets, thick ink-rules, book-spine, chapter-numeral watermarks, wax-seal badges, cut-corner "tablet" nodes, a quest-chain trail) using ::before/::after and clip-path, then applied it structurally:
"Read this first" is now an actual two-page book spread — a page-leaf for the long read, a spine crease, a sticky page-leaf for the short version.
Roadmap nodes are cut-corner tablets with header/body/footer strips and a wax-seal stamp on completed/mastered, not a plain rectangle.
Connector lines are now a thick carved "road" (double-line), and the mobile/narrow fallback — which previously was just a flat vertical list, confirming that part of the complaint — now has a quest-chain spine with waypoint dots so it reads as a trail at any width.
Drawers/modals restructured with a heavy ink-rule under the header and a stamped close button; project/achievement/modal cards got the corner-frame treatment.
Verified with a real headless-browser pass (desktop + mobile widths, light + dark) — screenshots confirmed the book spread, chapter numerals, carved connector lines, and quest-chain are all rendering correctly, not just present in markup.

Pushed to fantasy-revamp, fast-forwarded into main and pushed there, switched back to fantasy-revamp.
