# REVAMP.md — The "Ancient Tome / RPG Skill Tree" UI Overhaul

## 0. CRITICAL DIRECTIVE: DO NOT TOUCH THE TEXT

This is the single most important rule of this revamp: **You must absolutely NOT change the existing text, copy, tone, or personality.**

- My text is sarcastic, funny, and casually modern (e.g., "Variables are basically labeled boxes...").
- The UI is becoming an ancient fantasy RPG tome.
- The contrast between the ancient, epic visual aesthetic and the modern, sarcastic developer text is intentional and hilarious.
- DO NOT rewrite my text to sound like a wizard, an adventurer, or a medieval knight. No "thy," "thou," "arcane arts," or "potions." Keep my exact words.

## 1. THE OBJECTIVE: KILL THE "VIBE-CODE"

The current site looks like a generic SaaS/AI-generated template (glassmorphism, soft drop shadows, glowing neon gradients, rounded pills, Inter/Roboto fonts). I want to completely strip that away.

The new aesthetic is **Fantasy RPG Book / Adventurer's Skill Tree**.
Imagine an ancient leather-bound grimoire, a dusty adventurer's guild ledger, or a sprawling tabletop RPG campaign map.

## 2. THE VISUAL IDENTITY & TAILWIND CONFIGURATION

You must completely overhaul `tailwind.config.js` and `src/style.css`.

### Typography

Import these from Google Fonts in `index.html` or `style.css` and configure them in Tailwind:

- **Headers/Titles (The Epic Look):** `Cinzel` or `Playfair Display`. Use this for roadmap stage titles, the site logo/brand, and modal headers.
- **Body (The Book Text):** `EB Garamond` or `Crimson Text`. This is for all paragraphs, descriptions, and UI text.
- **Monospace/Code:** `Fira Code` or `JetBrains Mono`, but styled with a sepia/dark-brown background so it looks like stamped mechanical text on parchment.

### Color Palette (The "Tome" Theme)

Replace the modern gray/blue slate colors with this specific palette:

- **Base Background (Parchment):** `#F4EFE6` (main background) and `#EAE0C8` (slightly darker for contrast panels/cards).
- **Text (Ink):** `#2C241B` (deep dark brown/charcoal, not pure black).
- **Borders (Brass/Gold & Heavy Ink):** `#C6A664` (aged gold) and `#4A3B2C` (heavy dark brown).
- **Success/Mastered (Emerald/Druid Green):** `#215E39`.
- **Alert/Action (Crimson Wax/Blood):** `#8B0000`.

### Dark Mode (The "Black Grimoire" Theme)

Instead of modern dark mode, make it look like a cursed or nighttime tome.

- **Base Background:** `#1A1514` (very dark leather/charcoal).
- **Text:** `#D4C9B9` (faded silver/parchment).
- **Borders:** `#8A6B32` (dark, tarnished gold).

## 3. COMPONENT REVAMP GUIDELINES

Strip away all `rounded-xl`, `backdrop-blur`, `shadow-lg`, and generic gradients.

**A. The Roadmap Graph (`RoadmapGraph.vue`)**

- **Nodes:** Instead of modern pill shapes, style them as stamped ink blocks, wax seals, or etched brass plates. Use sharp corners (`rounded-none` or `rounded-sm`) with double borders or thick dark borders (e.g., `border-2 border-[#4A3B2C]`).
- **Connections:** The lines connecting nodes should be solid, heavy, dark brown lines (like ink strokes on a map). Remove any glowing SVG animations and replace them with a "drawn" look.
- **Node States:**
  - _Locked:_ Faded, sepia-toned, greyed-out ink.
  - _Available:_ Clear dark ink, crisp borders.
  - _In Progress:_ Highlighted with aged gold.
  - _Mastered:_ Stamped with the Emerald/Druid green.

**B. Modals & Drawers (`NodeModal.vue`)**

- Make modals look like opening a specific page in a ledger or a quest board flyer.
- Use a solid parchment background, thick borders, and an inner border line to simulate a page edge.
- Drop shadows should be harsh and dark (like a piece of paper sitting on a desk), not soft and blurry.

**C. Buttons & Inputs**

- No floating pastel buttons.
- Buttons should look like heavy inked stamps, brass plaques, or leather tabs.
- Hover effects should invert the colors (e.g., solid dark brown background with parchment text) or add an aged gold underline, rather than making the button "glow."

**D. Progress & Activity Graph**

- The GitHub-style contribution graph should look like an attendance ledger.
- Use shades of sepia/brown for empty days, and shades of Crimson or Emerald for active days.
- Shape them as crisp squares (`rounded-none`) with visible borders, like a hand-drawn grid.

## 4. EXECUTION PLAN FOR CLAUDE

1.  **Analyze & Backup:** Check `src/style.css` and `tailwind.config.js`. Note all the variables that need replacing.
2.  **Typography & Colors:** Inject the new Google Fonts into `index.html`. Overwrite the Tailwind config with the Tome/Grimoire color palette.
3.  **Global CSS Overhaul:** Rip out the `canvas → surface → raised → sunken` modern variables in `style.css` and replace them with parchment/ink equivalents. Ensure native scrollbars match the new aesthetic.
4.  **Component Refactor:** Go through the major components (`RoadmapGraph.vue`, `AppFooter.vue`, `ProgressView.vue`, `NodeModal.vue`) and replace vibe-coded Tailwind classes (glassmorphism, massive border radii) with the RPG UI classes (harsh borders, serif fonts, parchment backgrounds).
5.  **Review Text Constraint:** Do a final sanity check to ensure you didn't accidentally rewrite the easter eggs, 404 page text, or roadmap descriptions to sound like a wizard.

Make it look like I am managing my developer career from a desk in a medieval fantasy tavern, but reading modern, sarcastic tech advice. Build it.

At the end, add the changes, commit the changes, push the changes to fantasy-revamp, and then merge main to fantasy-revamp branch, push to main, then switch back to fantasy-revamp, and your task will be finished.
