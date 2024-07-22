// Configure default settings here!
const DefaultFPS = 30;
const DefaultQualityFactor = 0.4;

/**
 * VideoRecorder is a class that records a canvas to a video file.
 * It uses the MediaRecorder API to record the canvas to a video file.
 */
export class VideoRecorder {
    canvas: HTMLCanvasElement | undefined;
    fps: number;
    saveName = 'skbk-capture';

    #qualityFactor: number;
    #useVP9: boolean;
    #recordedChunks: Blob[] = [];
    #recorder: MediaRecorder | null = null;
    #isMediaRecorderSupported: boolean;

    get isRecording() {
        return this.#recorder !== null;
    }

    constructor(fps = DefaultFPS, qualityFactor = DefaultQualityFactor) {
        this.fps = fps;
        this.#qualityFactor = qualityFactor;
        this.#isMediaRecorderSupported = this.#checkMediaRecorderSupport();
        this.#useVP9 =
            this.#isMediaRecorderSupported &&
            MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
    }

    #checkMediaRecorderSupport(): boolean {
        return typeof MediaRecorder !== 'undefined';
    }

    #calculateBitrate(): number {
        if (!this.canvas) {
            throw new Error('VideoRecorder: no canvas available');
        }
        return this.canvas.width * this.canvas.height * this.fps * this.#qualityFactor;
    }

    startVideo() {
        if (!this.#isMediaRecorderSupported) {
            console.warn('VideoRecorder: MediaRecorder is not supported in this environment');
            return;
        }

        if (!this.canvas) {
            throw new Error('VideoRecorder: no canvas available');
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

    #saveVideo() {
        if (!this.canvas) {
            throw new Error('VideoRecorder: no canvas available');
        }

        const blob = new Blob(this.#recordedChunks, {
            type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `${this.saveName}-${Date.now()}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}
