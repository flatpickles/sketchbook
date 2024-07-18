import JSZip from 'jszip';

/**
 * Todo:
 * - rip out old video recording & fps stuff
 * - stop when changing projects
 * - naming
 * - tests
 */

export class FrameRecorder {
    canvas: HTMLCanvasElement | undefined;

    #frameCount = 0;
    #framesToRecord = 3600;
    #zip: JSZip | undefined;

    #startCallbacks: (() => void)[] = [];
    #stopCallbacks: ((success: boolean) => void)[] = [];

    get isRecording() {
        return this.#zip !== undefined;
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

        this.#zip = new JSZip();
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
        this.#zip.file(`frame-${this.#frameCount.toString().padStart(5, '0')}.png`, imageData, {
            base64: true
        });
        this.#frameCount++;

        // Finish if we've done the right amount of frames
        if (this.#frameCount >= this.#framesToRecord) {
            this.#stopRecording();
            return;
        }
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
            console.error('No zip file to download');
            return;
        }

        this.#zip
            .generateAsync({ type: 'blob' })
            .then((content) => {
                const zipFilename = `canvas_frames_${new Date().toISOString()}.zip`;
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = zipFilename;
                link.click();
                URL.revokeObjectURL(link.href);
            })
            .catch((error) => console.error('Error creating zip file:', error));
    }
}
