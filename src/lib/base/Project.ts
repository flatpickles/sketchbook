/**
 * A simple base class for all projects in src/art.
 */
export default class Project {
    canvas: HTMLCanvasElement | undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public constructor(canvas?: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update() {}
}
