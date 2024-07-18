import Project, { type ParamsChangedDetail, type UpdateDetail2D } from '$lib/base/Project/Project';

/***
 * Welcome to Sketchbook! This is a sample project that will help you get a feel for how Sketchbook
 * works. You can use HelloWorld as a starting point for your own projects, or you can delete it and
 * start from scratch.
 *
 * File overview:
 * - ./HelloWorld.ts (this file): This file contains a subclass of Sketchbook's `Project` class.
 *     This is the code for the project itself, exposing instance variables that will be presented
 *     as parameters, and implementing methods that Sketchbook calls as the project runs.
 * - ./config.json: This optional file contains the project's configuration, including its title,
 *     description, and parameter details. Some parameter config details can be inferred from
 *     comments in the project file, as you see below.
 * - ./presets/* (folder): This optional folder contains preset files, which are JSON files with
 *     curated parameter values that can be loaded into the project.
 * - static/og/HelloWorld.png: This file is used as the project's Open Graph image, i.e. the preview
 *     image displayed when sharing a link on social media.
 *
 * See the `Project` class annotations in `src/lib/base/Project/Project.ts` to learn more about the
 * methods and properties that are available to you, and/or see the full docs at http://skbk.cc.
 */

export default class HelloWorld extends Project {
    /* Parameters */

    text = 'Hello Sketchbook!'; // "Display Text"
    textSize = 150; // "Text Size", 20 to 300, step 1
    font = 'Arial'; // "Display Font"
    textMotion = [0.5, -0.5]; // "Text Motion", -1 to 1, compact
    backgroundColor = '#12ab70'; // "BG Color"
    darkOutline = false; // "Dark Outline"
    clearCanvas = () => {
        // "Clear Canvas"
        this.resetCanvas();
    };

    /* Project Method Implementations */

    init() {
        // Reset the canvas to draw the background color
        this.resetCanvas();
    }

    update({ context, width, height, time }: UpdateDetail2D) {
        // Draw the text with motion and parameter settings
        const textHue = (time * 100) % 360;
        const textBrightness = this.darkOutline ? 70 : 40;
        context.fillStyle = `hsl(${textHue}, 100%, ${textBrightness}%)`;
        context.strokeStyle = this.darkOutline ? 'black' : 'white';
        context.font = `bold ${this.textSize}px ${this.font}`;
        context.lineWidth = 2;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const textWidth = context.measureText(this.text).width;
        const textPosX =
            width / 2 + (this.textMotion[0] * Math.sin(time) * (width - textWidth)) / 2;
        const textPosY =
            height / 2 + (this.textMotion[1] * Math.cos(time) * (height - this.textSize)) / 2;
        context.fillText(this.text, textPosX, textPosY);
        context.strokeText(this.text, textPosX, textPosY);
    }

    paramsChanged({ keys }: ParamsChangedDetail) {
        // Reset the canvas when the background color changes
        if (keys.includes('backgroundColor')) this.resetCanvas();
    }

    resized() {
        // Reset the canvas when the size changes
        this.resetCanvas();
    }

    /* Helper Methods */

    resetCanvas() {
        if (this.canvas) {
            // Get the canvas context
            const context = this.canvas?.getContext('2d');
            if (!context) return;

            // Clear the canvas and draw the background color
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            context.fillStyle = this.backgroundColor;
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}
