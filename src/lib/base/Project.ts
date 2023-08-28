/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * A base class for all projects in src/art.
 */
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
     * this.canvas.getContext(), or CanvasType.None if you don't need a canvas.
     */
    canvasType = CanvasType.Context2D;

    /**
     * init is called once when the project is first loaded, after this.canvas and this.container
       become available. Override this with any custom initialization behavior.
     */
    public init() {}

    /**
     * update is called after init, and then whenever any parameters are updated. Override this with
     * your custom drawing code.
     */
    public update() {}

    /**
     * destroy is called when the project is unloaded, i.e. when another project is selected.
     * Override this with any custom cleanup behavior.
     */
    public destroy() {
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
