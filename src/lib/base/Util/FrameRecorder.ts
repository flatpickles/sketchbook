import JSZip from 'jszip';

/**
 * A utility for recording a frame sequence from a canvas.
 */
export class FrameRecorder {
    canvas: HTMLCanvasElement | undefined;
    saveName = 'skbk-capture';

    #frameCount = 0;
    #framesToRecord = 3600;
    #zip: JSZip | undefined;

    #startCallbacks: (() => void)[] = [];
    #stopCallbacks: ((success: boolean) => void)[] = [];

    constructor(private zipCreator: () => JSZip = () => new JSZip()) {}

    get isRecording() {
        return this.#zip !== undefined;
    }

    get currentFrameCount() {
        return this.#frameCount;
    }

    onStart(callback: () => void) {
        this.#startCallbacks.push(callback);
    }

    onStop(callback: (success: boolean) => void) {
        this.#stopCallbacks.push(callback);
    }

    startRecording(numFrames: number) {
        if (this.isRecording) {
            console.error('Already recording');
            return;
        }

        if (!this.canvas) {
            console.error('No canvas to record');
            return;
        }

        this.#zip = this.zipCreator();
        this.#frameCount = 0;
        this.#framesToRecord = numFrames;
        this.#startCallbacks.forEach((callback) => callback());
    }

    recordFrame() {
        // Make sure we can record a frame
        if (!this.isRecording) {
            console.error('Not recording');
            return;
        }
        if (!this.canvas) {
            console.error('No canvas to record');
            return;
        }
        if (!this.#zip) {
            console.error('No zip file to record to');
            return;
        }

        // Actually record the frame
        const imageData = this.canvas.toDataURL('image/png').split(',')[1];
        this.#zip.file(`${this.#frameCount.toString().padStart(5, '0')}.png`, imageData, {
            base64: true
        });
        this.#frameCount++;

        // Finish if we've done the right amount of frames
        if (this.#frameCount >= this.#framesToRecord) {
            this.#stopRecording();
            return;
        }
    }

    saveSingleFrame() {
        if (!this.canvas) {
            throw new Error('FrameRecorder: no canvas available');
        }

        const url = this.canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.href = url;
        a.download = `${this.saveName}-${Date.now()}.png`;
        a.click();
        document.body.removeChild(a);
    }

    cancelRecording() {
        this.#stopRecording(true);
    }

    #stopRecording(canceled = false) {
        if (!this.isRecording) {
            console.error('Not recording');
            return;
        }

        if (!canceled) this.#createZipAndDownload();
        this.#stopCallbacks.forEach((callback) => callback(!canceled));
        this.#zip = undefined;
    }

    #createZipAndDownload() {
        if (!this.#zip) {
            throw new Error('No zip file to create content from');
        }

        this.#zip
            .generateAsync({ type: 'blob' })
            .then((content) => {
                const zipFilename = `${this.saveName}-${Date.now()}.zip`;
                const link = document.createElement('a');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.href = URL.createObjectURL(content);
                link.download = zipFilename;
                link.click();
                URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            })
            .catch((error) => console.error('Error creating zip file:', error));
    }
}
