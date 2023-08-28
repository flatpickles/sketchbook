/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * A base class for all projects in src/art.
 */
export default class Project {
    /**
     * A canvas element that this project can draw to. This will be set automatically before init
     * is called, and the size will be set to fill to the container div (its parent). It will be
     * undefined if accessed in a project's constructor, or if useSharedCanvas (below) is `false`.
     */
    canvas?: HTMLCanvasElement;

    /**
     * A div element that this project will use as a container. This will be set automatically
     * before init is called, and the container div will fill as much space as possible (dependant
     * on your layout configuration). It is only undefined if accessed in a project's constructor.
     */
    container?: HTMLDivElement;

    /**
     * Whether this project will use the shared canvas element (above), or create its own. You may
     * wish to override this to `false` if you're using a library that creates its own canvas (e.g.
     * P5), or if you're working on a project that isn't canvas-based.
     */
    useSharedCanvas = true;

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
        // By default, clear the canvas when the project is unloaded.
        const context = this.canvas?.getContext('2d');
        if (context && this.canvas) {
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}
