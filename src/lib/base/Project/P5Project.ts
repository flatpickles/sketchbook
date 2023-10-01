/**
 * A simple base class for p5-based projects. Subclass this to create projects in Sketchbook that
 * leverage p5's built-in functionality. See the docs for more info.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import Project, { CanvasType, type Detail } from '$lib/base/Project/Project';
import P5, { type RENDERER } from 'p5';

export default class P5Project extends Project {
    /**
     * A p5 instance that this project can use to access the p5 API. This will be set automatically
     * when the project is loaded. It is only undefined if accessed in a project's constructor.
     */
    p5?: P5;

    /**
     * The renderer used by this project. This should overridden in P5Project subclasses, or set in
     * their constructors, and should not be changed during a project's lifecycle.
     */
    p5Renderer: RENDERER = 'p2d';

    /**
     * p5.js functions. Override these with your p5.js code. P5 runs in "instance mode", so all
     * library functionality must be accessed through a p5 object; you may choose to use either
     * `this.p5` or the `p5` argument passed to each function, which are equivalent.
     */

    // Lifecycle methods
    preload(p5: P5) {}
    setup(p5: P5) {}
    draw(p5: P5) {}

    // Mouse methods
    mouseMoved(p5: P5) {}
    mouseDragged(p5: P5) {}
    mousePressed(p5: P5) {}
    mouseReleased(p5: P5) {}
    mouseClicked(p5: P5) {}
    doubleClicked(p5: P5) {}
    mouseWheel(p5: P5) {}

    // Keyboard methods
    keyPressed(p5: P5) {}
    keyReleased(p5: P5) {}
    keyTyped(p5: P5) {}

    /**
     * Project superclass overrides; you shouldn't need to change these.
     */
    canvasType = CanvasType.None;
    init({ container }: Detail) {
        // Create a P5 instance that calls the P5Project methods defined above
        const processingFn = (p5: P5) => {
            p5.preload = this.preload.bind(this, p5);
            p5.setup = this.setup.bind(this, p5);
            p5.draw = this.draw.bind(this, p5);
            p5.mouseMoved = this.mouseMoved.bind(this, p5);
            p5.mouseDragged = this.mouseDragged.bind(this, p5);
            p5.mousePressed = this.mousePressed.bind(this, p5);
            p5.mouseReleased = this.mouseReleased.bind(this, p5);
            p5.mouseClicked = this.mouseClicked.bind(this, p5);
            p5.doubleClicked = this.doubleClicked.bind(this, p5);
            p5.mouseWheel = this.mouseWheel.bind(this, p5);
            p5.keyPressed = this.keyPressed.bind(this, p5);
            p5.keyReleased = this.keyReleased.bind(this, p5);
            p5.keyTyped = this.keyTyped.bind(this, p5);
        };
        this.p5 = new P5(processingFn);

        // Create a P5 canvas, filling the container div by default
        const p5Canvas = this.p5.createCanvas(
            container.clientWidth,
            container.clientHeight,
            this.p5Renderer
        );
        p5Canvas.parent(container);
        this.p5.setup(); // re-parenting the canvas seems to clear it, so call setup again
        requestAnimationFrame(this.p5.draw); // avoid a flicker before project load
    }
    resized({ containerSize }: { containerSize: [number, number] }): void {
        this.p5?.resizeCanvas(containerSize[0], containerSize[1]);
    }
    destroy(detail: Detail) {
        super.destroy(detail);
        this.p5?.remove();
    }
}
