/**
 * A base class for all projects in src/art. You can subclass this directly to create Sketchbook
 * projects that use the HTML canvas element directly, or you can subclass one of the specialized
 * project types in this directory. See the docs for more info.
 */

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default class Project {
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
     * init is called once when the project is first loaded, after this.canvas and this.container
     * become available. Override this with any custom initialization behavior.
     */
    init(detail: Detail<typeof this.canvasType>) {}

    /**
     * update is called continuously in a requestAnimationFrame loop. Override this with your custom
     * drawing code.
     */
    update(detail: UpdateDetail<typeof this.canvasType>) {}

    /**
     * paramChanged is called when a parameter is changed in the UI.
     */
    paramChanged(detail: ParamChangedDetail<typeof this.canvasType>) {}

    /**
     * resized is called when the container div and/or active canvas is resized.
     */
    resized(detail: ResizedDetail<typeof this.canvasType>) {}

    /**
     * destroy is called when the project is unloaded, i.e. when another project is selected.
     * Override this with any custom cleanup behavior.
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
 * The type of canvas context that will be used by a project.
 */
export enum CanvasType {
    Context2D = '2d',
    WebGL = 'webgl',
    None = 'none'
}

/**
 * Detail object type for the parameters to each Project method. More specific types exist below,
 * as intersections with this type. Each detail type is typed with a generic reference to the
 * project's CanvasType, and generic-free versions for each 2D & WebGL are provided for ease of use.
 * Detail contains the following:
 * - container: the container div element.
 * - canvas: the canvas element that the project will draw to, if using a canvas.
 * - context: the canvas context that the project will draw to, if using a canvas.
 */
export type Detail<T extends CanvasType> = {
    container: HTMLDivElement;
    canvas: T extends CanvasType.None ? undefined : HTMLCanvasElement;
    context: T extends CanvasType.None
        ? undefined
        : T extends CanvasType.Context2D
        ? CanvasRenderingContext2D
        : T extends CanvasType.WebGL
        ? WebGLRenderingContext
        : never;
};
export type Detail2D = UpdateDetail<CanvasType.Context2D>;
export type DetailWebGL = UpdateDetail<CanvasType.WebGL>;

/**
 * Detail object type used with the project's Update method. Contains the following:
 * - frame: the current frame number (0 at project load, incremented by 1 for each update call).
 * - time: milliseconds passed since project load (i.e. since init was called).
 */
export type UpdateDetail<T extends CanvasType> = Detail<T> & {
    frame: number;
    time: number;
};
export type UpdateDetail2D = UpdateDetail<CanvasType.Context2D>;
export type UpdateDetailWebGL = UpdateDetail<CanvasType.WebGL>;

/**
 * Detail object type used with the project's paramChanged method. Contains the following:
 * - key: the key of the parameter that was changed.
 */
export type ParamChangedDetail<T extends CanvasType> = Detail<T> & {
    key: string;
};
export type ParamChangedDetail2D = UpdateDetail<CanvasType.Context2D>;
export type ParamChangedDetailWebGL = UpdateDetail<CanvasType.WebGL>;

/**
 * Detail object type used with the project's resized method. Contains the following:
 * - containerSize: the new size of the container div element, in pixels.
 * - canvasSize: the new size of the canvas element, in pixels (if using a canvas).
 * Note that canvasSize is not likely to correspond to [this.canvas.width, this.canvas.height], as
 * the canvas drawing size is scaled by the current pixel ratio.
 */
export type ResizedDetail<T extends CanvasType> = Detail<T> & {
    containerSize: [number, number];
    canvasSize?: [number, number];
};
export type ResizedDetail2D = UpdateDetail<CanvasType.Context2D>;
export type ResizedDetailWebGL = UpdateDetail<CanvasType.WebGL>;
