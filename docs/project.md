# The `Project` Class

`Project` is the superclass of all Sketchbook projects. In your implementations, you will create subclasses that override a few inherited methods, and leverage a few inherited instance properties. For each project you build, Sketchbook will instantiate your `Project` subclass when it's loaded into the viewer, will call its lifecycle methods as it runs.

In addition to the discussion here, you can see `Project` and its annotations [on GitHub](https://github.com/flatpickles/sketchbook/blob/main/src/lib/base/Project/Project.ts), or locally in your code editor.

## `Project` Properties

The `Project` class defines several instance properties, which you will use in your project implementations.

-   **`canvas`:** `HTMLCanvasElement | undefined`
    -   `canvas` is the currently visible HTML canvas, where your project should draw its visual content. It is assigned immediately after your project class is instantiated.
    -   Unless otherwise configured, the canvas will be sized to fit the container, and its internal drawing size will also be set (using the default device pixel ratio).
    -   In Sketchbook, the canvas is shared between projects: when a new project is loaded, it will use the same canvas that other projects have been using, instead of creating a new element in the DOM.
    -   The canvas will be cleared by default when switching projects (see `destroy` below).
    -   You can expect `canvas` to be defined in each lifecycle method invocation, but it will be undefined in your project's constructor. If using `CanvasType.None` (see below), `canvas` will remain undefined.
-   **`container`:** `HTMLDivElement | undefined`
    -   `container` is the the div element containing the canvas, and fills all of the space available to it. It is assigned immediately after your project class is instantiated.
    -   You may not need to use this, but it's available in case you need to manipulate the DOM directly (e.g. creating additional canvases).
    -   If you add any new children to the container, they will be removed when loading a new project.
-   **`canvasType`:** `CanvasType`
    -   `canvasType` defines what sort of drawing context you expect to use in your project. It is intended to be overridden in `Project` subclasses as needed, and _not_ set directly during runtime.
    -   You can assign this to a member of the `CanvasType` enum, either `Context2D`, `WebGL`, or `None`. It's default is `CanvasType.Context2D`.
    -   Because a WebGL canvas cannot be reused with a 2D context (and vice versa), Sketchbook maintains two shared canvases, and will assign the correct one to your project based on its `canvasType`. The canvas's `context` type will vary accordingly.

## `Project` Methods

The `Project` class defines several lifecycle methods, which Sketchbook will call as your project runs. In your project implementations, you will override one or more of these methods to achieve your desired behavior. Each lifecycle method is invoked with a `detail` object, containing properties you may wish to use in your your subclass overrides.

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

## Implementing Parameters
