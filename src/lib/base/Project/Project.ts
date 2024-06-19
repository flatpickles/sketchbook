/**
 * A base class for all projects in src/art. You can subclass this directly to create Sketchbook
 * projects that use the HTML canvas element directly, or you can subclass one of the specialized
 * project types in this directory. See the docs for more info.
 */

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default abstract class Project {
    /**
     * A canvas element that this project can draw to. This will be set automatically before init
     * is called, and the size will be set to fill to the container div (its parent). It will be
     * undefined if accessed in a project's constructor, or when using CanvasType.None (below).
     */
    canvas?: HTMLCanvasElement;

    /**
     * A div element that this project will use as a container. This will be set automatically
     * before init is called, and the container div will fill as much space as possible (dependant
     * on your layout configuration). It is only undefined if accessed in a project's constructor.
     */
    container?: HTMLDivElement;

    /**
     * The canvasType used by this project; similarly typed canvases will be reused as new projects
     * are loaded. The canvasType selected should match the type of context you expect to use with
     * this.canvas.getContext(), or CanvasType.None if you don't need a canvas. This should be set
     * in the project's constructor, and should not be changed during the project's lifecycle.
     */
    canvasType: CanvasType = CanvasType.Context2D;

    /**
     * An array of instance variable names that should be ignored when loading parameters. Beyond
     * the default set of ignored keys, you can add any other keys that you don't want to be
     * considered parameters. This should be set in the project's constructor, and should not be
     * changed during the project's lifecycle.
     */
    ignoreKeys: string[] = [];

    /**
     * `init` is called once when the project is first loaded, after this.canvas and this.container
     * become available. Override this with any custom initialization behavior.
     *
     * @param detail - An object containing references to the `canvas` object, canvas `context`, and
     * the `container` div.
     */
    init(detail: Detail<typeof this.canvasType>) {}

    /**
     * `update` is called continuously in a `requestAnimationFrame` loop. Override this with your
     * custom drawing code.
     *
     * @param detail - An object containing references to the `canvas` object, canvas `context`, and
     * the `container` div, as well as canvas `width` and `height`, `frame` count and `time` in
     * seconds since the project was loaded, and an array of `paramsChanged` (keys) since the last
     * `update` call.
     */
    update(detail: UpdateDetail<typeof this.canvasType>) {}

    /**
     * `paramsChanged` is called when one or more parameters are changed in the UI.
     *
     * @param detail - An object containing references to the `canvas` object, canvas `context`, and
     * the `container` div, as well as an array of `keys` of the parameters that were changed.
     */
    paramsChanged(detail: ParamsChangedDetail<typeof this.canvasType>) {}

    /**
     * `resized` is called when the container div and/or active canvas is resized.
     *
     * @param detail - An object containing references to the `canvas` object, canvas `context`, and
     * the `container` div, as well as the new `containerSize` and `canvasSize` (if using a canvas).
     * Note that `canvasSize` is the DOM element size, and _not_ the canvas drawing size, which is
     * scaled by the current pixel ratio.
     */
    resized(detail: ResizedDetail<typeof this.canvasType>) {}

    /**
     * `destroy` is called when the project is unloaded, i.e. when another project is selected.
     * Override this with any custom cleanup behavior.
     *
     * @param detail - An object containing references to the `canvas` object, canvas `context`, and
     * the `container` div.
     */
    destroy(detail: Detail<typeof this.canvasType>) {
        // By default, clear the shared canvas when the project is unloaded.
        const context = this.canvas?.getContext('2d');
        if (context && this.canvas) {
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

/**
 * The type of canvas context that will be used by a project. Literal values are expected to
 * correspond with the string input to canvas.getContext(), i.e. '2d', 'webgl', or 'webgl2',
 * although 'none' is also supported. 'unknown' is used internally to indicate that the canvasType
 * has not yet been determined.
 */
export enum CanvasType {
    Context2D = '2d',
    WebGL = 'webgl',
    WebGL2 = 'webgl2',
    None = 'none',
    Unknown = 'unknown'
}

/**
 * Detail object type for the parameters to each `Project` method. More specific types exist for
 * particular methods, as intersections with this type. Each detail type is typed with a generic
 * reference to the project's `CanvasType`, and generic-free versions for 2D, WebGL, and WebGL2 are
 * provided for ease of use. `Detail` contains the following:
 * - `container`: the container div element.
 * - `canvas`: the canvas element that the project will draw to, if using a canvas.
 * - `context`: the canvas context that the project will draw to, if using a canvas.
 */
export type Detail<T extends CanvasType = CanvasType.Unknown> = {
    container: HTMLDivElement;
    canvas: T extends CanvasType.None
        ? undefined
        : T extends CanvasType.Unknown
        ? HTMLCanvasElement | undefined
        : HTMLCanvasElement;
    context: T extends CanvasType.None
        ? undefined
        : T extends CanvasType.Context2D
        ? CanvasRenderingContext2D
        : T extends CanvasType.WebGL
        ? WebGLRenderingContext
        : T extends CanvasType.WebGL2
        ? WebGL2RenderingContext
        : T extends CanvasType.Unknown
        ? RenderingContext | null | undefined
        : never;
};
export type Detail2D = Detail<CanvasType.Context2D>;
export type DetailWebGL = Detail<CanvasType.WebGL>;
export type DetailWebGL2 = Detail<CanvasType.WebGL2>;

/**
 * Detail object type used with the project's `update` method. In addition to `Detail` fields,
 * `UpdateDetail` contains the following:
 * - `frame`: the current frame number (0 at project load, incremented by 1 for each update call).
 * - `time`: seconds passed since project load (i.e. since init was called).
 * - `paramsChanged`: an array of parameter keys that have changed since the last update call.
 * - `width`: the width of the canvas, if using a canvas.
 * - `height`: the height of the canvas, if using a canvas.
 */
export type UpdateDetail<T extends CanvasType = CanvasType.Unknown> = Detail<T> & {
    frame: number;
    time: number;
    paramsChanged: string[];
    width: T extends CanvasType.None
        ? undefined
        : T extends CanvasType.Unknown
        ? number | undefined
        : number;
    height: T extends CanvasType.None
        ? undefined
        : T extends CanvasType.Unknown
        ? number | undefined
        : number;
};
export type UpdateDetail2D = UpdateDetail<CanvasType.Context2D>;
export type UpdateDetailWebGL = UpdateDetail<CanvasType.WebGL>;
export type UpdateDetailWebGL2 = UpdateDetail<CanvasType.WebGL2>;

/**
 * Detail object type used with the project's `paramsChanged` method. In addition to `Detail`
 * fields, `ParamsChangedDetail` contains the following:
 * - `keys`: the keys of any parameters that were changed
 */
export type ParamsChangedDetail<T extends CanvasType = CanvasType.Unknown> = Detail<T> & {
    keys: string;
};
export type ParamsChangedDetail2D = ParamsChangedDetail<CanvasType.Context2D>;
export type ParamsChangedDetailWebGL = ParamsChangedDetail<CanvasType.WebGL>;
export type ParamsChangedDetailWebGL2 = ParamsChangedDetail<CanvasType.WebGL2>;

/**
 * Detail object type used with the project's resized method. In addition to `Detail` fields,
 * `ResizedDetail` contains the following:
 * - `containerSize`: the new size of the container div element, in pixels.
 * - `canvasSize`: the new size of the canvas element, in pixels (if using a canvas).
 *
 * Note that `canvasSize` is unlikely to correspond to `[this.canvas.width, this.canvas.height]`, as
 * the canvas drawing size is scaled by the current pixel ratio.
 */
export type ResizedDetail<T extends CanvasType = CanvasType.Unknown> = Detail<T> & {
    containerSize: [number, number];
    canvasSize?: [number, number];
};
export type ResizedDetail2D = ResizedDetail<CanvasType.Context2D>;
export type ResizedDetailWebGL = ResizedDetail<CanvasType.WebGL>;
export type ResizedDetailWebGL2 = ResizedDetail<CanvasType.WebGL2>;
