/**
 * CanvasRecorder is a class that records a canvas to a video file.
 * It uses the MediaRecorder API to record the canvas to a video file.
 */
export class CanvasRecorder {
    canvas: HTMLCanvasElement | undefined;
    fps: number;
    saveName = 'skbk-capture';

    #bitsPerPixel: number;
    #useVP9: boolean;
    #recordedChunks: Blob[] = [];
    #recorder: MediaRecorder | null = null;

    get isRecording() {
        return this.#recorder !== null;
    }

    constructor(fps: number, bitsPerPixel = 0.4) {
        this.fps = fps;
        this.#bitsPerPixel = bitsPerPixel;
        this.#useVP9 = MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
    }

    #calculateBitrate(): number {
        if (!this.canvas) {
            throw new Error('CanvasRecorder: no canvas available');
        }
        return this.canvas.width * this.canvas.height * this.fps * this.#bitsPerPixel;
    }

    startVideo() {
        if (!this.canvas) {
            throw new Error('CanvasRecorder: no canvas available');
        }

        this.#recordedChunks = [];
        const stream = this.canvas.captureStream(this.fps);
        const mimeType = this.#useVP9 ? 'video/webm;codecs=vp9' : 'video/webm;codecs=vp8';
        const videoBitsPerSecond = this.#calculateBitrate();

        this.#recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond
        });
        this.#recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.#recordedChunks.push(event.data);
            }
        };
        this.#recorder.start(1000 / this.fps);
    }

    stopVideo(): Promise<void> {
        if (!this.#recorder) return Promise.resolve();
        return new Promise<void>((resolve) => {
            if (this.#recorder) {
                this.#recorder.onstop = () => {
                    this.#saveVideo();
                    this.#recorder = null;
                    resolve();
                };
                this.#recorder.stop();
            } else {
                resolve();
            }
        });
    }

    saveImage() {
        if (!this.canvas) {
            throw new Error('CanvasRecorder: no canvas available');
        }

        const url = this.canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.href = url;
        a.download = `${this.saveName}.png`;
        a.click();
        document.body.removeChild(a);
    }

    #saveVideo() {
        if (!this.canvas) {
            throw new Error('CanvasRecorder: no canvas available');
        }

        const blob = new Blob(this.#recordedChunks, {
            type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `${this.saveName}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}
