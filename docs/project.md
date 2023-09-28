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

-   **`init`**`({ container, canvas, context })`
    -   `init` is called when a project is loaded, immediately after instantiation. Override this with any custom initialization behavior.
-   **`update`**`({ frame, time, container, canvas, context })`
    -   `update` is called continuously in a frame update loop. Override this with your custom drawing code.
    -   `update` invocations receive a `detail` object containing the current `frame`, and the `time` offset in milliseconds, each starting from 0 when the project is loaded.
    -   You do not need to call `requestAnimationFrame` directly for animated content; Sketchbook will call `update` repeatedly on each animation frame.
-   **`paramChanged`**`({ key, container, canvas, context })`
    -   `paramChanged` is called when a parameter value is changed via the Sketchbook app UI. Override this to implement any custom behavior that should be invoked when a parameter changes.
    -   `paramChanged` invocations receive a `detail` object containing the `key` of the parameter that was just changed.
    -   See the [Parameters](params-presets.md) page for more info on using parameters in your projects.
-   **`resized`**`({ containerSize, canvasSize, container, canvas, context })`
    -   `resized` is called when the `canvas` and/or `container` sizes change, e.g. when the user resizes their browser window.
    -   `resized` invocations receive a `detail` object containing the current `containerSize` and `canvasSize` in pixels. The latter will be undefined when using `CanvasType.None`.
    -   Note that the `canvasSize` is the size of the canvas _element_; use `canvas.width` and `canvas.height` to access the actual canvas drawing size.
    -   Unless otherwise configured, you can rely on Sketchbook to manage the sizes of the container element and the canvas. You generally won't be setting these sizes directly in your projects, but you can override `resized` to respond to any size changes as you see fit.
-   **`destroy`**`({ container, canvas, context })`
    -   `destroy` is called when the project is unloaded, i.e. when another project is about to be loaded. Override this with any custom cleanup behavior.
    -   This is the only `Project` method with a default implementation: by default, the canvas is cleared before loading the next project. You can override this if you wish.

Each lifecycle method invocation discussed above also has `container`, `canvas`, and `context` props passed within its `detail` object. These provide the same references available via `this.container`, `this.canvas`, and `this.canvas.getContext()`, with a more convenient interface. This is particularly helpful if you're using TypeScript: each prop will be defined and properly typed according to the project's `canvasType`.

See the `Project` [class file](https://github.com/flatpickles/sketchbook/blob/main/src/lib/base/Project/Project.ts) to find the utility types used for these detail objects. A TypeScript project implementation that destructures and uses a detail object might look like this:

```ts
import Project, { type UpdateDetail2D } from '$lib/base/Project/Project';

export default class ProjectExample extends Project {
    update({ time, canvas, context }: UpdateDetail2D) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const rectSize = Math.sin(time / 1000) / 2 + 0.5;
        context.fillRect(0, 0, rectSize * canvas.width, rectSize * canvas.height);
    }
}
```

## Intermediate Subclasses

`Project` is designed to be subclassed, both for direct project implementations (as discussed above), and for intermediate project types. The [`P5Project`](https://github.com/flatpickles/sketchbook/blob/main/src/lib/base/Project/P5Project.ts) class included with Sketchbook is an example of a `Project` subclass that is not a project implementation unto itself, but rather provides a generalized utility superclass for project implementations – Sketchbook projects that leverage P5, in this case.

As you use Sketchbook, you may benefit from creating your own intermediate `Project` subclasses that implement behavior you'd like to share between multiple projects. Some examples of when you might want to create intermediate subclasses include:

-   Abstracting boilerplate code (setup, teardown, etc) that is particular to the way you like to work.
-   Integrating frameworks that you want to be able to use easily in the Sketchbook context.
-   Creating "templates" with common [parameters](params-presets.md) for your custom project type.

See [Project Subtypes](project-subtypes.md) for further discussion of the `Project` subclasses included with Sketchbook. If you build any of your own that would be useful for other Sketchbook users, consider [contributing](contributing.md) them back to the main repo!
