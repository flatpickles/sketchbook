// Configuration for the canvas recorder:
const BitsPerPixel = 0.4; // very high
const FramesPerSecond = 30; // very standard

/**
 * CanvasRecorder is a class that records a canvas to a video file.
 * It uses the MediaRecorder API to record the canvas to a video file.
 */
export class CanvasRecorder {
    canvas: HTMLCanvasElement | undefined;
    #useVP9: boolean;
    #recordedChunks: Blob[] = [];
    #recorder: MediaRecorder | null = null;

    get isRecording() {
        return this.#recorder !== null;
    }

    constructor() {
        this.#useVP9 = MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
    }

    #calculateBitrate(): number {
        if (!this.canvas) {
            throw new Error('CanvasRecorder: no canvas available');
        }
        return this.canvas.width * this.canvas.height * FramesPerSecond * BitsPerPixel;
    }

    start() {
        if (!this.canvas) {
            throw new Error('CanvasRecorder: no canvas available');
        }

        this.#recordedChunks = [];
        const stream = this.canvas.captureStream(FramesPerSecond);
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
        this.#recorder.start(1000 / FramesPerSecond);
    }

    stop(): Promise<void> {
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

    #saveVideo() {
        const blob = new Blob(this.#recordedChunks, {
            type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'canvas-recording.webm';
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}
