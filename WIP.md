# Sketchbook project planning

Ongoing notes for Sketchbook development.

---

# Current scope:

## Test coverage

-   Settings panel
-   Project detail panel (component tests)
-   Project list panel (header/footer components etc)

## Main view panels

-   Processing sketch still not updating when changing overlay setting
-   Panels: Fix outline & drop shadow visibility when hidden
-   Floating panel design - footer space? Min height (optional)?

-   Don't show detail panel when no details or params are specified
-   Visible button presentation for light/dark content
-   Implement optional panel state settings for direct project links (vs. navigation to /)
-   Mobile layout (reassess mouse behavior fallbacks)
-   Separate overlay & style settings for each panel (?)

## Johan's feedback (8/23):

-   animation mode?
-   [addressed] maybe rename update method; "update" implies it runs every frame
-   [addressed] passed to update: parameter key (from update), time (ms + frame count)
-   think about how much infrastructure to provide / leave to other frameworks. Probably as minimal as possible
-   [addressed] check Unity lifecycle for ideas
-   [addressed] dev mode vs. prod mode
-   [addressed] design: the art feels secondary with the panels floating over the top. Could be remedied with dedicated space for the canvas // no floating panels.
-   [addressed] Wouldn't often want to see project list as a first-class citizen during dev mode. That's kind of a portfolio feature. Could be remedied just by keeping the panel closed.

## Settings // app configuration

content.ts: what's on the page

config.ts: how it behaves

-   Canvas size // sizing behavior
    -   Full screen (on/off)
    -   Pixel size (vec2) - used when not full screen; max at full screen; use value effects
-   Panel visibility (projects + project details)
    -   Enable/disable
    -   Shown/hidden defaults
    -   Show/hide behavior (mouse hover / movement / double click / etc)
-   App state storage behavior (on/off)
    -   project selection, for navigation to (/)
    -   preset selection + set parameter values
    -   panels open/closed
    -   selected group
-   Disable params in mobile layout (presets only)
-   Param UI label double click options
    -   Option to reset to default/preset value
    -   Option to randomize within range
-   Auto-style parameters based on name (may require reload)
-   Project defaults:
    -   Live updates (when unspecified per-param)
    -   Show presets UI (default: shown only if presets exist)
-   customizable date formatting
-   [done] Project sorting // group sorting
-   [done] Show experimental projects

## Params

-   Number fields: validate min/max/step
-   Documentation!!!
-   Layout bug: file input is inset a little bit for some reason
-   File input persistence
    -   When switching away from a project, then back
    -   When reloading a project
-   Persistence w/ default values (values set in .ts file)
    -   Track these before updating to saved state
    -   Save these so we can see when the user updated default, to use this instead of saved state (with no preset selected)
    -   Use these with double-click to reset to default (when no preset is selected)
-   Min/max range slider? (style for 2-member numeric array, maybe)
-   Full width description text paired with a param input (useful in settings)
-   Toggle switch style for boolean input

### Value Effects

Available for number, string, boolean. For a boolean, there's no value key; it's just a map with shows/hides/enables/disables keys.

```
"valueEffects": {
    "0.5": {
        "comparator": "lte",
        "shows": [],
        "hides": ["key1", "key2"],
        "enables": [],
        "disables": ["key3", "key4"]
    }
}
```

Use cases: modes (w/ options), sections, functionality only defined with some values.

## Miscellany

-   Fix issues listed in Chrome dev tools (mostly related to form ids & labels)
-   Asset import rework: define params as instances of objects that can then provide files once imported. Enable:
    -   stateless asset-dependent implementations
    -   bundled defaults
    -   cached file values (when switching away from / to a project)
    -   different approach to styling?
-   Check to see if classes are actually Project subclasses when loading (otherwise we get confusing errors with improper subclasses in src/art)
-   Sort projects based on settings in some central location (not just in the ProjectList component) so we can use this in the root +page.server.ts (cannot use localStorage in this scenario, so might not be configurable like other settings?)
-   Limit panel description text height // enable scrolling
-   Show perf data (where?! in settings panel?)
-   Project key:
    -   Use key instead of name in saved state
    -   User-defined keys used for project URL
-   Show & hide panels in desktop layout
    -   Show/hide animation
    -   Show buttons from hidden state
-   Presets
    -   Disable preset picker & controls per-project
    -   Allow naming "Default Values" (or a default preset option?)
    -   Model work
    -   Selection UI & plumbing
    -   Options: creation, export, import, etc
    -   URL hash location set w/ preset (loads preset automatically)
-   Canvas Sketch base project subclass
-   Mobile layout & behavior
-   No Signal display
    -   Display when no projects are loaded
    -   Also include error text; catch project errors
-   Catch and display error if rendering passes a time limit (e.g. infinite loop in project)
-   Link previews // metadata
-   Theming / styling:
    -   Expose only high-level adjustments in theme.scss; move finer details elsewhere (closer to components probably)
    -   Enable SBv1 style (or something mono/sharp)
    -   Enable dark mode configuration, somehow
-   Configuration in config.json
    -   Defaults for all settings
    -   (maybe this is just user-visible stuff? see below)
-   In config interfaces, maybe use optional members?
-   Preserve project state through a session (ie don't reinstantiate project and keep loaded files)

# Miscellaneous / notes:

-   Double-check padding vs. margin in header (and elsewhere?)
-   SSR: currently projects are initialized, but init() and update() aren't called.
    -   Either projects shouldn't be initialized (so we don't have to do `browser` checks within projects, e.g. to load bundled images), or init() and update() should be called once each, to draw canvas contents.
    -   Check if canvas drawing is possible with SSR; only benefit there really would be link previews, and these could just be static images if needed.
-   Parameter sorting: use config order maybe? At least document
-   FileLoading vs FileParamLoader naming is confusing
-   Increase hit area for sliders
-   Update function: take an optional "previousValues" parameter, containing previous values of exposed params before the latest update (so we can see what specifically changed). { changedKey: key, previousValues: {} }
-   Clicking a group or project list item should scroll it fully into view.
-   Better error messaging for config file parsing throughout
-   "animated" mode for sketches: call update with animation frame request
-   Show a project's groups on right panel?
-   Make old style possible via theme config (or something like it)
-   What happens if someone sets a parameterized property from within the project?
    -   Ideally this change is represented in params UI; e.g. load a text file into a multi-line text param
    -   Maybe they sync on project update?
-   Can we enable DOM-based projects, e.g. vanilla Svelte prototypes that aren't entirely on a canvas?
-   Should ConfigTypes.ts exist?
-   Does glslify in ShaderProject work?

# Ongoing:

-   Parse miscellany above into actual action items
-   Read through design doc
-   Accessibility
    -   Param label associations (name // id // etc)
    -   Semantic markup
-   Style & theme cleanup
-   Cross-browser testing
    -   Firefox text baselines are too high? Probably the baked helvetica isn't normalized
    -   Firefox & Safari outline some fields - awkward
    -   Custom checkmark positioning seems to differ
    -   IE / Edge testing?

# Eventual work for launch:

-   Update design doc, and/or adapt into other documentation:
    -   Getting started
    -   Full docs, etc
-   Theme examples
-   Project examples
-   Example deployment with a few demo projects (not just Longitude Studio)
-   Port SBv1 into projects.longitude.studio
-   Pick an OSS license and document accordingly
-   Record demo videos and create other marketing assets - TBD
-   Figure out CI, e.g. auto-run tests with pushes
-   Contributor workflow
-   Move this doc into GitHub project planning tool

# MVP stretch goals:

-   Webcam & microphone inputs
-   MIDI inputs
-   API:
    -   Project list (names, dates, metadata)
    -   Link preview images
-   Easy "export snapshot" (photo) option
    -   Also save JSON with current parameter values (i.e. preset file)
-   Key commands
    -   Hide/show panels
    -   Project switching
-   Undo/redo for parameter changes (w/ key command)
-   Lightweight project switcher option (more like a file system menu)
-   E2E testing:
    -   Canvas/container sizing

# Long-term goals:

-   Midi control:
    -   Included in global configuration
    -   Enable project switching (fast switching)
-   Variants:
    -   Duplicate a folder within art and create another "variant" of an existing piece.
    -   Variants are displayed under the same title in the project list, but once you click in you can see that there are several versions.
    -   Maybe it's like tapping into a section in an iOS list view.
-   Canvas zooming & panning
-   Cloud preset storage
    -   Share presets with _just_ a link
-   LFOs and/or other sorts of param sidechaining
-   Render queue (preempt & cancel long-running renders)
-   Fast switching:
    -   Optional (global config)
    -   Multiple canvases already instantiated
    -   Optional transition effects:
        -   Simple crossfade
        -   Alpha overlay for custom cutouts, wipes, etc
        -   Maybe a base Sketch class function called when transition begins?
-   Password protected projects

# Philosophy:

-   Prototype & publish in the same place:
    -   Start a project as quickly as possible: idea to pixels without losing a train of thought. Creative workflow optimized from the moment of first concept.
    -   Create something that's inviting for others to play with. Comprehensive and intuitive presentation out of the box, with options to enable even more functionality.
-   Light-weight ergonomics // heavy-duty functionality.
    -   Opt-in customizablility. Sketchbook presents options for deep flexibility, but you can start any project without even creating a config file, and add complexity as you need it.
    -   Create portable work. Easily carry your projects into another context (client work, etc) with minimal transportation cost (redesigning, rebuilding).

# Utils:

-   Separate repo with things that I use in my art projects
-   Sometimes just copy, credit, and consolidate other open source work
-   Shader tools:
    -   Polar transforms
    -   Color transforms
    -   Maybe don't include because of glslify?
-   Canvas tools:
    -   approximate circle
    -   maybe extend D3 paths or something like that?

# Documentation:

-   Project subclasses:
    -   Using constructor:
        -   this.canvas will not be defined
    -   SSR notes: browser features may not be available
        -   Example: Image()
        -   init() and update() not called (currently as of 8/13)
    -   Importing bundled images: show example

./readme.md todo:

-   Basic pitch improvements (who's it for? what's it do? what's the workflow)
-   Include an example
-   Discuss parameters
-   Sketchbook features overview
-   Sketchbook workflow overview
-   OSS license notes
