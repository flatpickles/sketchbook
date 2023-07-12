/* eslint-disable @typescript-eslint/no-empty-function */

/**
 * A simple base class for all projects in src/art.
 */
export default class Project {
    /**
     * The canvas element that this project will draw to, set automatically when
     * the project is selected.
     */
    canvas: HTMLCanvasElement | undefined;

    /**
     * init is called once when the project is first loaded, after this.canvas
       becomes available. Override this with any custom initialization behavior.
     */
    public init() {}

    /**
     * update is called after init, and then whenever any parameters are updated.
     * Override this with your custom drawing code.
     */
    public update() {}

    /**
     * destroy is called when the project is unloaded, i.e. when another project
     * is selected. Override this with any custom cleanup behavior.
     */
    public destroy() {
        // By default, clear the canvas when the project is unloaded.
        const context = this.canvas?.getContext('2d');
        if (context && this.canvas) {
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}
