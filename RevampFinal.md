MASTER DIRECTIVE: THE GRIMOIRE OVERHAUL
A TOTAL FANTASY-RPG RECONSTRUCTION OF THE CODING SURVIVAL ROADMAP 0. YOUR ROLE

You are simultaneously:

A senior UI/UX designer specializing in immersive game interfaces
A senior frontend architect
A Vue expert
A Tailwind CSS expert
A visual systems designer
An interaction designer
An accessibility engineer
A frontend performance engineer
A meticulous codebase refactoring engineer

You are not being asked to "make the current website prettier."

You are being asked to destroy the current visual language and reconstruct the interface as an original fantasy RPG / ancient grimoire / character-progression experience, while preserving the site's existing informational substance with absolute fidelity.

The current implementation is too generic, too SaaS-like, too card-heavy, too predictable, and too obviously generated from a modern Tailwind component vocabulary.

A competent redesign is not enough.

A slightly more ornate SaaS dashboard is not enough.

A dark-mode dashboard with parchment colors is not enough.

Changing colors, adding borders, replacing icons, or putting decorative textures behind the existing cards is not a redesign.

The resulting interface should feel as though its underlying interaction model was conceived for a fantasy RPG first and only later implemented as a web application.

The implementation should be bold, strange, deliberate, highly authored, memorable, and unmistakably different from a conventional modern dashboard.

1. THE NON-NEGOTIABLE PRIME DIRECTIVE
   PRESERVE THE PRODUCT. DESTROY THE PRESENTATION.

The existing:

written content
wording
descriptions
jokes
sarcasm
titles
roadmap material
roadmap ordering
roadmap relationships
prerequisites
project requirements
resource links
URLs
GitHub references
external references
learning resources
metadata
progression logic
scoring/progress semantics
underlying instructional meaning

must remain intact.

Do not rewrite the site's educational material.
Do not "improve" the copy.
Do not make the copy more fantasy-themed.
Do not rename roadmap stages merely because a fantasy name sounds cooler.
Do not change jokes.
Do not correct the author's personality.
Do not replace casual/sarcastic writing with medieval/wizard language.

The contrast is intentional:

Ancient, serious, ceremonial interface + modern, casual, sarcastic developer writing.

That juxtaposition is a core part of the identity.

Keep it.

2. CONTENT IMMUTABILITY PROTOCOL

Before modifying anything, identify every source of user-facing content.

This includes content stored in:

Vue templates
JavaScript/TypeScript data structures
JSON
constants
arrays
objects
component props
computed values
route metadata
configuration files
markdown
helper files
resource lists
modal content
tooltips
labels
progress text
roadmap descriptions
project descriptions
jokes
external links
GitHub-related information

Treat that content as immutable source material.

The following are explicitly forbidden unless required to repair an actual bug:
Rewording
Condensing
Expanding
Paraphrasing
Reordering instructional material
Renaming content-bearing entities
Removing resources
Changing resource URLs
Changing roadmap node labels
Changing prerequisite relationships
Changing project requirements
Changing jokes
Changing explanatory text
Changing progress terminology where it carries product meaning

You may restructure how information is presented, but not what information exists.

Critical distinction

You have complete freedom over:

DOM hierarchy
component hierarchy
layout architecture
spacing systems
CSS
responsive behavior
visual hierarchy
interaction patterns
transitions
animations
decorative elements
information grouping
navigation metaphors
node presentation
modal presentation
page composition
background treatment
graphical ornamentation
SVG artwork
borders
textures
physical metaphors
visual states
responsive layout
interaction choreography

You do not have freedom to rewrite the site's actual content.

3. MANDATORY DOCUMENTATION ARTIFACTS

You must create and maintain two repository-level Markdown documents as part of this task.

These files are not optional.

3.1 Analysis.md

Create:

Analysis.md

at the appropriate repository root.

This file is the complete record of your pre-implementation analysis.

Do not make it a vague summary.

It should document, in detail:

Repository understanding
project structure
framework
build system
important directories
major files
major components
routing architecture
state management/data flow
styling architecture
theme architecture
graph/roadmap architecture
UI audit

Document the existing UI and why it currently feels generic/vibe-coded.

Identify:

current layout model
current navigation model
current roadmap structure
current node presentation
current modal presentation
current progress visualization
repetitive component patterns
generic dashboard patterns
styling conventions that need to be discarded
architectural constraints discovered
Content inventory

Document the existing content model, including:

roadmaps
roadmap nodes
relationships
prerequisites
descriptions
projects
jokes
resources
external links
progress-related information
important content sources

Do not rewrite the source content in this document merely for convenience. Reference it accurately.

Technical analysis

Document:

relevant component dependencies
important props
data binding
state transitions
event flows
responsive behavior
graph rendering mechanics
modal behavior
theme implementation
potential regression risks
likely architectural changes
Redesign strategy

Explain the intended new architecture at a technical/design level:

global composition
navigation
grimoire/book structure
roadmap architecture
node system
graph connection system
modal system
progress/ledger system
responsive strategy
theme strategy
typography strategy
animation philosophy
accessibility strategy
performance considerations
Preservation requirements

Explicitly record what is considered immutable and what is safe to change.

Verification strategy

Document how you intend to verify:

functionality
content preservation
visual quality
responsiveness
accessibility
build health
console health
Git state
Important

Analysis.md must be created before the major redesign work begins and should be updated only when necessary to correct or refine the analysis.

It should represent the actual codebase investigation, not an invented retrospective.

3.2 FantasyChange.md

After the redesign is fully implemented and verified, create:

FantasyChange.md

This file is the complete implementation changelog and technical record of everything you did.

It must be comprehensive.

Do not write:

"Redesigned the site to look like a fantasy RPG."

That is far too vague.

Document everything meaningful that changed.

At minimum include:

Overview
what was rebuilt
original problem
final design direction
major architectural philosophy
Files changed

For every modified file, explain:

file path
what changed
why it changed
major implementation decisions
Files added

Document:

new components
new utility files
new styles
new assets
Analysis.md
FantasyChange.md
any other files created
Files removed

Document any deleted legacy files/components and why they were safe to remove.

Global UI

Document:

new application shell
book/spread composition
page framing
spine
navigation system
chapter/tab system
responsive transformations
Typography

Document:

fonts
font assignments
typography hierarchy
where each font is used
Theme system

Document:

light theme
dark theme
colors
material treatment
state styling
any theme variable/token changes
Roadmap

Document:

old structural approach
new structural approach
node implementation
connector implementation
branching logic
positioning logic
states
interactions
responsive behavior
performance considerations
Modals

Document:

old modal behavior
new modal structure
new visual metaphor
transitions
focus behavior
responsive behavior
Progress

Document:

contribution graph redesign
ledger concept
data preservation
styling changes
responsive behavior
Accessibility

Document:

keyboard support
focus handling
semantic improvements
contrast considerations
reduced-motion handling
non-color state indicators
Performance

Document:

optimizations made
expensive operations avoided
graph calculation improvements
asset/texture considerations
reactive/rendering optimizations
Content integrity

Explicitly document:

what was preserved
how content preservation was checked
confirmation that roadmap information remained unchanged
Verification

Document:

commands run
browser checks
routes checked
themes checked
responsive widths checked
interactions checked
console/build results
issues found
fixes made
Git history

Document:

branch used
commit(s) created
commit messages
pushes performed
merge/integration performed
final branch state
Important

FantasyChange.md should be written after the implementation is finished, while the details are still available.

It should serve as a future maintainer's complete historical record of the overhaul.

4. PHASE 0 — ESTABLISH A BASELINE

Before changing anything:

Run the application.
Inspect the current UI in the browser.
Inspect the repository structure.
Identify the framework and build tooling.
Identify all routes.
Identify the application's main state/data flow.
Identify every major page/view.
Identify the components responsible for roadmap rendering.
Identify the components responsible for node details/modals.
Identify progress tracking.
Identify theme handling.
Identify responsive breakpoints.
Identify reusable components.
Identify the CSS architecture.
Identify all content sources.
Identify all external resource links.
Identify all GitHub-related functionality.
Determine whether the roadmap graph currently depends on fixed dimensions, SVG, CSS positioning, or a graph library.
Determine whether changes can be made without breaking application logic.

At this stage, do not redesign yet.

Understand the existing product first.

Then write your findings into:

Analysis.md

before proceeding to the main implementation.

5. REQUIRED FILE / COMPONENT INVESTIGATION

At minimum, inspect:

src/App.vue
router configuration
global stylesheet(s)
Tailwind configuration
index.html
RoadmapGraph.vue
NodeModal.vue
all Progress-related components/views
all major layout wrappers
all content/data files
all reusable UI components involved in navigation and roadmap rendering

Also inspect anything else discovered during repository analysis that controls:

routing
state
roadmap data
progress state
modal behavior
theme state
resource links
graph rendering
responsive behavior

Do not assume the files named above contain everything.

Trace the actual data flow.

6. CONTENT INVENTORY BEFORE REFACTORING

Before destructive UI work begins, create an internal inventory of the site's content model.

For every roadmap and major view, understand:

title
description
node identity
prerequisites
dependencies
state
resources
project requirements
explanatory text
links
jokes
progress information
completion semantics

Your redesign must consume this existing model rather than duplicating the content into new ad-hoc UI structures.

Architectural preference

Separate:

CONTENT / DATA

from

PRESENTATION / RENDERING

as much as the existing architecture reasonably allows.

Do not create duplicate copies of roadmap information merely to make a visual component easier to build.

One source of truth.

7. DESIGN MANDATE: STOP THINKING "DASHBOARD"

The current design vocabulary must be mentally discarded.

Do not reproduce:

SaaS dashboards
startup landing pages
analytics dashboards
productivity apps
generic learning platforms
Notion-like layouts
ordinary admin interfaces
generic "glassmorphism"
standard rounded cards
floating gradient blobs
generic hero sections
cookie-cutter sidebar dashboards
identical three-column feature layouts
conventional card grids
generic pill badges
modern soft-shadow UI

This is not a dashboard with fantasy decoration.

It is a fantasy progression system that happens to be a web application.

8. CORE VISUAL CONCEPT

The experience should feel like a strange artifact assembled from several fantasy-world objects:

an ancient codex
a spellbook
a character progression screen
a dungeon map
a guild registry
a quest ledger
a skill tree
a field manual
an illuminated manuscript
a campaign journal
an adventurer's archive
an old map
a guild insignia
a technical grimoire

Do not literally combine every metaphor into one giant mess.

Instead, establish a coherent visual world in which the different views feel like different rooms/pages/artifacts from the same universe.

9. THE CENTRAL EXPERIENCE

The user is not merely "browsing a roadmap."

The user should feel as though they are:

opening an old technical grimoire and progressing through a dangerous apprenticeship.

The coding roadmap becomes the character-progression system.

Learning becomes progression.

Prerequisites become gates.

Completed concepts become mastered abilities.

Projects become trials.

Resources become references in the archive.

Progress becomes advancement in the guild.

The GitHub activity view becomes evidence of practice.

However:

NEVER modify the actual educational wording to force this metaphor.

The interface carries the fantasy.

The content remains itself.

10. VISUAL LANGUAGE

The visual language should be tactile and physical rather than sterile and digital.

Think:

paper
parchment
leather
engraving
brass
iron
wax
ink
woodcut illustrations
manuscript annotations
stamped seals
hand-drawn cartography
etched diagrams
marginalia
registration marks
physical page edges
chapter dividers
scribal marks
old maps
guild insignia
quest notices
mechanical hinges
metal clasps
stitched bindings

Use these ideas as design principles, not excuses for random decoration.

Every major visual element should feel as though it belongs to the same physical artifact.

11. TYPOGRAPHY

Do not use default modern dashboard typography.

Inject this exact line into index.html <head>:

<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Fira+Code&display=swap" rel="stylesheet">

Configure Tailwind appropriately.

Use:

Cinzel

For:

major site titles
chapter titles
roadmap headings
stage names
modal headings
ceremonial labels
navigation chapter names
major decorative typography
EB Garamond

For:

descriptions
paragraphs
explanatory content
resource descriptions
standard UI copy
secondary labels
long-form information
Fira Code

For:

code
technical identifiers
technical metadata
GitHub-related information
file/path-like elements
"mechanical" or stamped technical labels
deliberately technical visual accents

Typography should create a hierarchy that feels closer to a printed field manual than a web dashboard.

Do not overuse decorative typography merely because it exists.

Readability still matters.

12. LIGHT THEME — THE ANCIENT TOME

The light theme should feel like a physical manuscript illuminated under warm natural light.

Primary visual ideas:

parchment
aged paper
faded ink
brass
old leather
subtle paper grain
engraved marks
archival borders

Use approximately:

Parchment backgrounds: #F4EFE6, #EAE0C8
Deep ink text: #2C241B
Aged gold/brass borders: #C6A664

Do not make everything flat beige.

Establish layered material depth through:

paper variation
inset borders
linework
subtle texture
paper edges
restrained noise
engraved marks
physical dividers
hard shadows
offset shadows
paper/page layering 13. DARK THEME — THE CURSED GRIMOIRE

The dark theme must not merely invert the light theme.

It should feel like the same artifact after being exposed to fire, ash, age, and forbidden knowledge.

Use approximately:

Charred leather: #1A1514
Faded silver/parchment text: #D4C9B9
Tarnished dark gold borders: #8A6B32

Think:

scorched leather
faded ink
tarnished metal
damaged parchment
charcoal
embers
old silver
barely visible engraving

The dark mode should have its own emotional identity.

14. ABSOLUTE ANTI-VIBE-CODING RULES

Do not fall back to familiar component-library patterns.

Avoid or eliminate the visual habits associated with generic generated Tailwind interfaces:

excessive rounded-xl
excessive rounded-2xl
giant soft cards
backdrop-blur
translucent glass panels
pastel gradients
generic gradient text
soft floating blobs
excessive shadow-lg
excessive shadow-xl
soft "elevation everywhere"
oversized whitespace used to imitate SaaS polish
identical cards repeated across every section
generic icon circles
pill-shaped status controls everywhere
generic centered hero sections
modern dashboard sidebars
"glass card over gradient background"
excessive radial gradients
arbitrary purple/blue AI aesthetic
neon UI clichés
excessive glow effects

Use:

hard borders
double borders
inset borders
offset shadows
square or almost-square geometry
engraved linework
corner marks
tabs
seals
plaques
framed panels
page edges
ruled lines
physical-looking dividers
layered paper
metal-like framing
asymmetry
deliberate irregularity

Sharp is good.

Physical is good.

Tactile is good.

Overly polished SaaS is bad.

15. GLOBAL LAYOUT — THE OPEN GRIMOIRE

The main application should feel like an open book / manuscript spread, not a normal webpage.

On large screens:

Treat the central application area as an open two-page spread.
Establish a strong visual spine between the two halves.
Create convincing page margins.
Use internal framing.
Make the page boundaries visually meaningful.
Establish a clear "artifact" silhouette around the application.
Avoid the feeling that content simply sits inside a browser viewport.

The center spine may be represented through:

layered borders
a physical seam
inset shadows
a narrow decorative channel
a subtle material transition
manuscript binding details

Do not turn the spine into a distracting gimmick.

16. NAVIGATION — BOOKMARKS, TABS, CHAPTER DIVIDERS

Navigation should not resemble:

logo → sidebar → menu items → settings

Instead, explore:

leather bookmark tabs
manuscript chapter tabs
vertical page markers
metal-clipped chapter labels
stamped navigation plates
marginal navigation
top-mounted page tabs
physical index tabs

Navigation must remain:

easy to understand
keyboard accessible
responsive
obvious
fast

The fantasy metaphor must never compromise usability.

On smaller screens, intelligently collapse or transform the physical metaphor rather than forcing desktop geometry onto mobile.

17. RESPONSIVE DESIGN IS PART OF THE ART DIRECTION

Do not create a desktop fantasy interface and then slap flex-col onto it.

Design the mobile experience intentionally.

On mobile:

preserve the manuscript identity
retain hierarchy
maintain readable typography
avoid microscopic content
transform the open-book metaphor intelligently
reorganize roadmap nodes into a usable progression
preserve connection semantics
ensure modals remain usable
ensure controls remain tappable
prevent horizontal overflow
prevent graph content from becoming unusable

Responsive design should feel like:

the same artifact becoming a compact field manual

rather than:

desktop UI awkwardly squeezed into a phone.

18. THE THREE RPG CLASSES

The three roadmaps:

Front-end
Back-end
AI/ML

should feel like three character classes / disciplines / schools of mastery.

The user should feel as though they are selecting a path.

Each class should have an identifiable visual presence.

However:

Do not rename the classes.
Do not rewrite their content.

Instead, create differentiation through:

framing
insignia
composition
progression visualization
iconography
node structure
visual motifs
interaction

The three paths should feel related but distinct.

19. ROADMAP GRAPH — TOTAL RECONSTRUCTION

This is one of the most important parts of the redesign.

Destroy the standard vertical list of cards.

Do not simply restyle each existing node.

Rebuild the roadmap as a true skill/progression tree.

The visual language should evoke systems such as:

RPG skill trees
character progression screens
branching talent maps
dungeon progression maps
strategic campaign maps

Do not copy a specific game's UI.

Create an original interpretation.

20. ROADMAP STRUCTURE

The roadmap should visually communicate:

what comes first
what unlocks next
what depends on what
which branches exist
where the user is currently located
what is locked
what is available
what has been mastered
where major milestones occur

A user should be able to understand progression before reading every piece of text.

This means the graph structure itself must carry information.

21. NODE DESIGN

Roadmap nodes should no longer be ordinary rectangular cards.

Explore forms such as:

engraved plaques
wax seals
runestones
brass plates
manuscript stamps
medallions
carved tiles
labeled relic fragments
archival tags

Different node states must be visually obvious.

LOCKED

Should communicate:

inaccessible
dormant
faded
not yet earned

Use ideas such as:

faded engraving
muted ink
desaturated treatment
chained/blocked visual language
reduced contrast

Do not make locked content disappear completely.

The user should understand that it exists.

AVAILABLE

Should communicate:

actionable
discoverable
currently reachable

Use:

stronger borders
crisp engraving
clearer contrast
subtle visual emphasis
intentional cursor interaction
IN PROGRESS

Should communicate:

active
partially explored
unfinished

Use restrained aged-gold emphasis.

Avoid generic neon "glow."

The emphasis should feel like:

an enchanted inscription catching light

rather than:

a SaaS component receiving ring-yellow-400.

MASTERED

Should communicate:

completed
proven
earned

Use a convincing visual stamp / seal / mark.

The requested mastery accent is Druid Green.

Do not simply make the entire card green.

Make it feel like the node has been officially recorded as mastered.

22. CONNECTIONS BETWEEN NODES

Connections are not decoration.

They are part of the information architecture.

Render actual visual connections using appropriate technology such as:

SVG paths
SVG linework
CSS connectors
dynamically calculated paths
another suitable graph technique

depending on what best fits the existing application.

Connections should communicate hierarchy and progression.

Consider visually distinguishing:

locked paths
reachable paths
active paths
mastered paths

Avoid connecting elements with arbitrary CSS borders when that makes the graph fragile or misleading.

23. ROADMAP SHOULD FEEL LIKE A MAP, NOT A LIST

Explore a composition with:

staggered node positions
branching paths
asymmetrical regions
chapter-like sections
milestones
visual landmarks
progression corridors
occasional large nodes for major milestones

Do not make the graph randomly messy.

It should feel authored.

The user's eye should naturally follow:

origin → progression → branches → mastery

24. INTERACTION WITH ROADMAP NODES

Node interaction should feel deliberate.

Potential interaction behaviors:

hover reveals subtle engraved emphasis
available nodes respond physically
active nodes receive restrained illumination
mastered nodes reveal their completion mark
clicking a node opens its detailed information artifact
the selected node becomes visually anchored
prerequisite relationships remain understandable

Avoid:

exaggerated scaling
cartoonish bouncing
generic hover:scale-105
excessive spring animations
generic dropdown behavior

Interaction should feel like interacting with an object.

25. NODE MODAL — NOT A SAAS DIALOG

The existing modal must also be completely reimagined.

Do not build:

dark overlay + centered rounded white card + close button + content

That is forbidden.

Instead, make the selected node feel like the user is examining:

a torn page
a quest notice
an archival record
an illuminated manuscript page
a field report
a technical scroll
a map inset
a guild dossier

The modal should feel like a physical document appearing over the grimoire.

Use:

strong top/bottom framing
paper edges
heavy borders
decorative corners
chapter marks
physical page hierarchy
tactile depth
clear content grouping

The content remains exactly the same.

Only the presentation changes.

26. MODAL BEHAVIOR

The modal must remain excellent UX.

It should:

have proper focus management
close predictably
support keyboard interaction
have an obvious close affordance
work on mobile
avoid accidental overflow
preserve readable line lengths
preserve external-link usability
respect reduced-motion preferences

Animations should feel like:

page opening
parchment unfolding
document being placed on a desk

rather than:

generic fade + scale
generic slide-in drawer
generic modal spring animation 27. PROGRESS VIEW — TURN DATA INTO A GUILD LEDGER

The Progress view should not look like an analytics dashboard.

The GitHub contribution graph should be reinterpreted as something resembling:

an attendance ledger
a scribe's practice record
a guild training calendar
an archival matrix
hand-recorded ink squares
a campaign log

The underlying contribution data must remain unchanged.

The visualization changes.

Each square should feel like an entry in a historical record.

Do not turn it into a generic heatmap with rounded squares and soft shadows.

28. PROGRESS VISUAL HIERARCHY

Progress should feel meaningful.

The user should be able to distinguish:

days practiced
intensity
streaks
milestones
completion/progression

without losing the visual metaphor.

Keep the design legible.

Do not allow fantasy decoration to overwhelm actual progress information.

29. MICRO-INTERACTIONS

Every interaction should reinforce the physical/fantasy metaphor.

Examples:

subtle page movement
restrained ink emphasis
stamped completion marks
brass-like hover emphasis
parchment transitions
manuscript highlighting
chapter selection
node activation
subtle engraving reveal

Avoid generic frontend animation defaults such as:

everything fading in
everything sliding upward
everything scaling
everything bouncing
constant pulsing
excessive glow

Animation should have meaning.

30. MOTION PRINCIPLES

Motion should communicate physicality.

Use principles like:

Weight

Important objects should feel heavier.

Friction

Panels should not behave like floating glass.

Mechanical movement

Tabs, plates, and pages can have subtle physical transitions.

Restraint

Not every element needs animation.

Hierarchy

Major transitions receive more motion than minor ones.

Accessibility

Honor:

prefers-reduced-motion

Do not make functionality dependent on animation.

31. MATERIAL DEPTH

The interface should have depth without becoming visually noisy.

Layer materials intentionally:

Background material
Page surface
Border/frame
Content surface
Engraved lines
Shadow/inset depth
Decorative markings

Avoid stacking dozens of effects merely because CSS permits it.

The desired result is:

tactile and believable

not:

CSS effects showcase.

32. TEXTURE

Texture can be used carefully for:

parchment
leather
paper
engraved surfaces
maps
archival pages

Do not use huge distracting background images.

Do not sacrifice text legibility.

Prefer subtle procedural/CSS texture where practical over enormous assets.

Performance matters.

33. DECORATIVE SYSTEM

Create a coherent decorative language.

Possible recurring motifs:

corner flourishes
chapter numbers
compass marks
wax seals
page registration marks
ornamental rules
heraldic geometry
small manuscript glyphs
archive stamps
technical marginalia

These motifs should recur deliberately so the interface feels designed as one system.

Do not randomly sprinkle ornaments everywhere.

34. COMPONENT ARCHITECTURE

You have permission to substantially refactor component structure.

Create reusable components where they improve the visual system.

Potential concepts include:

GrimoireFrame
BookSpread
ChapterTab
SkillTree
SkillNode
SkillConnector
Rune/Seal
QuestPanel
ManuscriptModal
LedgerGrid
ArchiveSection
ProgressStamp

These are examples, not mandatory names.

Do not create unnecessary abstraction purely for abstraction's sake.

Components should make the system easier to maintain.

35. CSS ARCHITECTURE

Do not patch the old CSS indefinitely.

Where the existing CSS architecture is fighting the new visual system, replace it.

Establish:

design tokens
typography tokens
material tokens
border systems
spacing rules
shadow rules
state styles
light/dark theme variables
shared ornamentation
responsive behavior

Prefer a coherent system over hundreds of one-off utility overrides.

36. TAILWIND

Tailwind may still be used extensively.

However, do not allow Tailwind's defaults to dictate the visual language.

Define appropriate custom values where needed.

The configuration should reflect the new world.

The goal is not:

"use more Tailwind."

The goal is:

"use Tailwind as an implementation tool for a deliberately authored visual system."

37. SHAPES AND CORNERS

The geometry should generally be:

sharp
rectangular
engraved
plaque-like
architectural
archival

Use:

rounded-none
very restrained rounded-sm where physically plausible
border-double
inset borders
offset frames

Do not turn every interface object into a rounded card.

38. SHADOW LANGUAGE

Replace soft SaaS elevation with physical depth.

Prefer:

hard offset shadows
inset shadows
layered border shadows
page-edge shadows
mechanical-looking depth

Use soft shadows only where physically appropriate.

Avoid shadow-lg as the default answer to "make this stand out."

39. ACCESSIBILITY IS NOT OPTIONAL

Despite the fantasy aesthetic, the application must remain a professional web application.

Maintain:

sufficient contrast
semantic HTML
keyboard navigation
focus visibility
screen-reader compatibility
accessible interactive elements
meaningful labels
usable modal behavior
reduced-motion support
touch-friendly controls
logical tab order

Do not hide important information behind hover-only interactions.

Do not rely on color alone to communicate roadmap state.

Use shape, labels, symbols, typography, borders, and marks as secondary state indicators where appropriate.

40. PERFORMANCE

Do not sacrifice application performance for decoration.

Be careful with:

huge background images
expensive blur filters
enormous SVGs
excessive box-shadow layers
unnecessary reactive calculations
large DOM trees
hundreds of animated elements
expensive graph recalculation on every render

Especially for the roadmap:

calculate graph geometry efficiently
avoid unnecessary watchers
avoid layout thrashing
ensure resizing is handled intelligently
ensure the graph remains usable on smaller devices 41. DO NOT BREAK THE EXISTING PRODUCT

The redesign must preserve existing functionality.

After the redesign:

routing still works
roadmap navigation still works
node selection still works
modal behavior still works
progress behavior still works
external links still work
GitHub-related behavior still works
theme switching still works
responsive behavior works
application state remains coherent

The visual overhaul must not become a functional regression.

42. DO NOT FAKE FUNCTIONALITY

Do not replace working logic with:

static mockups
hardcoded placeholder nodes
fake progress
decorative links
nonfunctional buttons
fake modal content
duplicated fake roadmap data

The final result must be a real implementation using the existing application's data and functionality.

43. VISUAL DIFFERENTIATION TEST

After implementing the redesign, ask:

"Would someone looking only at screenshots think this is a generic Tailwind SaaS dashboard?"

If the answer is even slightly yes:

KEEP REWORKING IT.

The difference must be obvious.

Another test:

"Could the same visual system be mistaken for a generic productivity app if all the text were removed?"

If yes:

KEEP REWORKING IT.

Another:

"Does the interface look like someone intentionally designed a fictional artifact, rather than assembling component-library primitives?"

If no:

KEEP REWORKING IT.

44. ANTI-CHEATING RULE

Do not satisfy the brief by doing any of the following:

recoloring existing cards
changing fonts while leaving the structure intact
replacing icons
adding parchment background images
adding border textures
adding a fantasy title
changing border radius
adding decorative SVGs around an unchanged dashboard
keeping the existing sidebar and simply styling it like leather
keeping the existing vertical roadmap and making cards look like plaques

Those are surface-level adaptations.

The HTML structure, layout logic, information grouping, and major interaction patterns must materially change.

45. WHAT "TOTAL REBUILD" MEANS

A successful rebuild should involve meaningful changes to:

page composition
navigation architecture
roadmap composition
node composition
modal composition
progress presentation
component hierarchy
CSS architecture
responsive strategy
visual state system

The exact implementation is your decision.

But the result must clearly demonstrate that the old UI architecture was not simply decorated.

46. BROWSER-BASED VISUAL VERIFICATION

After implementation:

Start the dev server.
Open the application in a browser.
Inspect every primary route.
Inspect the light theme.
Inspect the dark theme.
Inspect the roadmap.
Test roadmap node interactions.
Test modal behavior.
Test progress views.
Test navigation.
Test mobile-width layouts.
Test desktop-width layouts.
Inspect the browser console.
Fix visual regressions.
Fix runtime errors.
Fix layout overflow.
Fix broken interactions.
Repeat until the implementation is stable.

Do not consider the task finished simply because the code compiles.

The browser result is the real deliverable.

47. VISUAL QUALITY BAR

Before declaring completion, compare the implementation mentally against:

Generic SaaS implementation

Header
Sidebar
Rounded card
Card grid
Gradient
Shadow
Modal
Done

versus:

Required implementation

A coherent fantasy artifact with physical material, progression logic, deliberate hierarchy, authored visual language, tactile interaction, and a skill-tree experience that feels like a game system.

The second is required.

48. CONTENT VERIFICATION

After refactoring, verify that content has not unintentionally changed.

Compare the post-refactor content model against the original.

Verify:

all roadmap nodes exist
all roadmap relationships remain intact
all descriptions remain intact
all resource links remain intact
all jokes remain intact
all project requirements remain intact
all progress semantics remain intact
all important labels remain intact

Presentation can change radically.

Content must not.

Record the verification process and results in:

FantasyChange.md 49. CODE QUALITY

The final code should be:

maintainable
understandable
componentized where useful
free of unnecessary duplication
free of dead styling
free of abandoned experimental components
consistent
responsive
accessible
performant

Remove obsolete UI code once the replacement is confirmed functional.

Do not leave the old design architecture lurking underneath the new one unless it is genuinely required by application logic.

50. FINAL REFACTORING PRINCIPLE

Do not preserve bad architecture merely because it existed before.

The current implementation is a starting point, not a sacred structure.

Preserve:

data + behavior + functionality + content

Reinvent:

presentation + composition + visual language + interaction design + component structure

51. GIT / BRANCH WORKFLOW

Once the redesign is complete and verified:

Step 1

Check the current Git state.

Step 2

Ensure all intended changes are present.

Step 3

Review:

Analysis.md
FantasyChange.md
source changes
generated/deleted files
Git diff
Step 4

Commit the complete fantasy redesign with a clear commit message.

Example:

git add .
git commit -m "Rebuild roadmap UI as fantasy grimoire RPG"
Step 5

Push the completed redesign to:

fantasy-revamp
Step 6

Update fantasy-revamp with the latest state of main before final integration, resolving conflicts carefully rather than blindly overwriting changes.

Step 7

Ensure the integration is clean and verified.

Step 8

Push the final integrated state to:

main
Step 9

Switch back to:

fantasy-revamp
Step 10

Verify the final branch state.

Important Git rule

Do not accidentally:

force-push
overwrite unrelated work
delete branches
reset away legitimate changes
commit generated junk
commit secrets
modify unrelated project files without reason

If the repository's existing branch structure requires a slightly different command sequence to safely accomplish the same intended result, adapt the mechanics while preserving the requested final state:

redesigned code exists on fantasy-revamp
the appropriate integration with main has occurred
the final integrated state is pushed to main
you finish checked out on fantasy-revamp

Document the actual Git operations performed in FantasyChange.md.

52. FINAL ACCEPTANCE CRITERIA

The task is complete only when all of the following are true:

Documentation
Analysis.md exists.
Analysis.md contains the actual repository/UI/architecture analysis performed before the overhaul.
FantasyChange.md exists.
FantasyChange.md accurately records the implementation and verification work performed.
Content
No user-facing source content was rewritten.
No roadmap information was removed.
No required resource was removed or replaced.
Existing instructional meaning remains unchanged.
Architecture
The old dashboard-oriented visual structure has been materially replaced.
Major components support the new visual system.
The design is not merely a skin over the old UI.
Visual identity
The site unmistakably reads as a fantasy RPG / ancient grimoire experience.
The light theme reads as an Ancient Tome.
The dark theme reads as a Cursed Grimoire.
Typography is intentional.
Materials feel coherent.
Visual states are distinctive.
The three roadmap disciplines feel like progression paths.
Roadmap
The roadmap behaves like a branching skill tree.
Dependencies are visually apparent.
Connections are real and meaningful.
Locked / available / in-progress / mastered states are clearly differentiated.
The graph is usable on desktop and mobile.
Modals
Node details feel like physical documents/artifacts.
The modal does not resemble a generic SaaS dialog.
Progress
The GitHub contribution graph feels like a ledger / practice record.
Data remains accurate.
UX
Keyboard interaction works.
Focus states work.
Modal accessibility works.
Responsive behavior works.
Reduced motion is respected.
No critical overflow exists.
Technical
The app builds.
The app runs.
No critical console errors remain.
No obvious runtime regressions remain.
No placeholder implementation remains where real functionality existed.
No unnecessary dead UI architecture remains.
Git
Changes are committed.
fantasy-revamp contains the finished redesign.
The intended integration with main is complete.
main is pushed with the integrated result.
You finish on fantasy-revamp.
FantasyChange.md documents the final Git state. 53. EXECUTION ORDER

Follow this sequence exactly.

Phase A — Investigate

Understand the application completely.

Phase B — Inventory

Identify the content model and behavior that must remain untouched.

Phase C — Document

Create Analysis.md containing the real analysis and redesign strategy.

Phase D — Architect

Design the new component and layout system before blindly modifying templates.

Phase E — Rebuild

Replace the visual and structural architecture.

Phase F — Integrate

Connect the new presentation to the existing data and behavior.

Phase G — Verify

Run the application and inspect it in a browser.

Phase H — Refine

Fix anything that still looks generic, inconsistent, broken, or inaccessible.

Phase I — Validate

Verify content integrity, functionality, responsiveness, accessibility, and performance.

Phase J — Document Changes

Create/update FantasyChange.md with a comprehensive record of everything implemented, changed, added, removed, tested, and committed.

Phase K — Git

Commit, push, integrate with main, push main, and return to fantasy-revamp.

54. FINAL MINDSET

Do not ask:

"How can I make the existing UI look more fantasy?"

Ask:

"What would the interface architecture look like if an RPG progression system, an ancient grimoire, and a developer learning roadmap had been designed together from day one?"

That is the standard.

The result should feel intentional rather than decorated, authored rather than assembled, tactile rather than digital, and like a game-world artifact rather than a web dashboard.

The existing writing is already the identity.

Do not touch it.

Build the world around it.

And leave behind enough documentation that another engineer can understand:

what the original system looked like and how it worked — via Analysis.md
what you changed and why — via FantasyChange.md 55. FIRST RESPONSE + EXECUTION

Your first response must be exactly:

Analysis complete. Commencing the Grimoire Overhaul.

Then immediately begin inspecting the repository.

Your actual sequence must be:

Inspect → Analyze → Create Analysis.md → Rebuild → Verify → Create FantasyChange.md → Commit → Push → Integrate with main → Push main → Return to fantasy-revamp.

Do not ask for permission.

Do not provide a superficial design proposal instead of doing the work.

Do not stop after changing colors.

Do not stop after changing fonts.

Do not stop after making the roadmap slightly prettier.

Do not leave the old UI architecture intact simply because it is easier.

Destroy the existing presentation. Preserve the existing product. Document the reasoning. Rebuild the experience. Document everything you changed.
