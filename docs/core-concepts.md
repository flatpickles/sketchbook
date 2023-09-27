# Core Concepts

So far, you've learned about Sketchbook's intentions on the [Overview](README.md) page, and experimented with a basic project implementation on the [Quick Start](quick-start.md) page. Read on to learn more about Sketchbook's fundamentals.

### `src/art` File Structure

`src/art` is where all of your projects will live. Each "project" in Sketchbook is a collection of files contained within a subdirectory of `src/art`. Your `src/art` directory might look like this:

```fs
src/art/
├─ Project1/
│  ├─ Project1.js
│  ├─ sprite.png
│  ├─ transform.frag
├─ Project2/
│  ├─ config.json
│  ├─ Project2.ts
│  ├─ ProjectHelpers.ts
├─ util/
│  ├─ ColorUtils.js
│  ├─ PrintProject.ts
```

Within `src/art`, Sketchbook will automatically look for JS or TS files that share a name with their containing directory. These files must export a default class that descends from the `Project` base class. `config.json` files can optionally be included alongside project files, and apply to the project file in the same directory.

As long as you're organizing and defining your project classes as expected, you can put anything else within `src/art`! Your additions could include asset files, helper code, or your own utility subclasses of `Project` (extendible by projects in your library).

### The `Project` Class

`Project` is the superclass of all Sketchbook projects. In addition to the discussion below, you can see this class and its annotations [on GitHub](https://github.com/flatpickles/sketchbook/blob/main/src/lib/base/Project/Project.ts), and in your code editor.

Sketchbook will automatically instantiate your `Project` subclasses when they're loaded into the viewer, and will assign the following **properties**:

-   `canvas` is the currently visible HTML canvas.
    -   This canvas will be sized to fit the container, and its internal drawing size will also be set accordingly, using the default device pixel ratio.
    -   The canvas is shared between projects; when a new project is loaded, it will use the shared canvas corresponding to its `canvasType` (either '2d' or 'webgl'). The canvas will be cleared by default when switching projects (see `destroy` below).
-   `container` is the div element containing the canvas.
    -   The container will also fill all of the space available to it.
    -   You may not need to use this, but it's available in case you need to manipulate the DOM directly (e.g. creating additional canvases).
    -   If you add any new children to the container, they will be removed when loading a new project.

In subclassing `Project`, you will implement your project's behavior by overriding one or more of the following **methods**:

-   `init` is called when a project is loaded.
    -   Override this with any custom initialization behavior.
    -   Prior to `init` (i.e. in the project constructor), `canvas` and `container` have yet to be defined. Within `init`, and elsewhere in the projects lifecycle, you can safely use these properties.
-   `update` is called continuously a frame update loop.
    -   Override this with your custom drawing code. You do not need to call `requestAnimationFrame` directly for animated content; Sketchbook will call `update` repeatedly on each animation frame.
    -   `update` invocations receive a `detail` object containing the current `frame`, and the `time` offset in milliseconds, both starting from 0 when the project is loaded.
    -   If `update` isn't implemented in your project (e.g. for static content that is only drawn when parameters update), the frame loop will not be active.
-   `paramChanged` is called whenever a parameter input is changed by the user.
    -   [todo]
-   `resized` is called when the `canvas` and/or `container` sizes change.
    -   [todo]
-   `destroy` is called when the project is unloaded, i.e. when another project is about to be loaded.
    -   This is the only `Project` method with a default implementation: by default, the canvas is cleared before loading the next project. You can override this if you wish.
    -   [todo?]

### Project Parameters

### Presets

Presets are [on the roadmap](https://github.com/flatpickles/sketchbook/issues/21) for Sketchbook 1.0, and will eventually be documented here, if not in their own page. Stay tuned!
