import Project, { type UpdateDetail2D } from '$lib/base/Project/Project';

import BundledDefault from './dvd.png';

export default class ImportExample extends Project {
    // Parameters
    fileSelector = (image: HTMLImageElement, metadata: File) => {
        // "Replace Image", image
        console.log(`Loaded: ${metadata.name}`);
        this.#displayedImage = image;
    };
    imageSize = 0.3; // "Image Size", 0.1 to 0.5, slider
    imageSpeed = 10; // "Image Speed", slider, 0 to 30
    randomizeDirection = () => {
        const angle = Math.random() * Math.PI * 2;
        this.#imageDirection = [Math.cos(angle), Math.sin(angle)];
    };

    // Private Variables
    #displayedImage: HTMLImageElement;
    #imagePosition = [0, 0];
    #imageDirection = [Math.random(), Math.random()];

    // Load a bundled image as the default image
    constructor() {
        super();

        // This image will not be available until its onload event fires, but we're redrawing on
        // every frame anyway, so we don't need to explicitly wait for it to load.
        this.#displayedImage = new Image();
        this.#displayedImage.src = BundledDefault;
    }

    // Initialize with a constant speed at a random angle (starting from top left)
    init() {
        const angle = (Math.random() * Math.PI) / 2;
        this.#imageDirection = [Math.cos(angle), Math.sin(angle)];
    }

    // Draw the currently loaded image on each frame update
    update({ canvas, context }: UpdateDetail2D): void {
        // Reset canvas to black
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate image size as a percentage of the canvas size
        const imageRatio =
            Math.min(
                canvas.width / this.#displayedImage.width,
                canvas.height / this.#displayedImage.height
            ) * this.imageSize;
        const imageWidth = this.#displayedImage.width * imageRatio;
        const imageHeight = this.#displayedImage.height * imageRatio;
        context.drawImage(
            this.#displayedImage,
            this.#imagePosition[0],
            this.#imagePosition[1],
            imageWidth,
            imageHeight
        );

        // Bounce off the sides of the canvas
        if (this.#imagePosition[0] < 0) {
            // Left side
            this.#imageDirection[0] = Math.abs(this.#imageDirection[0]);
        } else if (this.#imagePosition[0] + imageWidth > canvas.width) {
            // Right side
            this.#imageDirection[0] = -Math.abs(this.#imageDirection[0]);
        }
        if (this.#imagePosition[1] < 0) {
            // Top side
            this.#imageDirection[1] = Math.abs(this.#imageDirection[1]);
        } else if (this.#imagePosition[1] + imageHeight > canvas.height) {
            // Bottom side
            this.#imageDirection[1] = -Math.abs(this.#imageDirection[1]);
        }

        // Update the image position
        this.#imagePosition[0] += this.#imageDirection[0] * this.imageSpeed;
        this.#imagePosition[1] += this.#imageDirection[1] * this.imageSpeed;
    }
}
