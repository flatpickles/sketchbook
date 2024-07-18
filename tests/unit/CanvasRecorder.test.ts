import { CanvasRecorder } from '$lib/base/Util/CanvasRecorder';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CanvasRecorder', () => {
    let canvas: HTMLCanvasElement;
    let recorder: CanvasRecorder;

    beforeEach(() => {
        // Mocking MediaRecorder and related methods
        global.MediaRecorder = vi.fn().mockImplementation(function (this: MediaRecorder) {
            this.start = vi.fn();
            this.stop = vi.fn().mockImplementation(() => {
                if (this.onstop) {
                    this.onstop(new Event('stop'));
                }
            });
            this.ondataavailable = null;
            this.onstop = null;
        }) as unknown as {
            new (stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;
            prototype: MediaRecorder;
            isTypeSupported: (type: string) => boolean;
        };
        global.MediaRecorder.isTypeSupported = vi.fn().mockReturnValue(true);

        // Mocking MediaStream
        global.MediaStream = vi.fn().mockImplementation(() => {
            return {};
        }) as unknown as {
            new (): MediaStream;
            prototype: MediaStream;
        };

        // Mocking document.createElement for canvas and anchor elements
        vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            if (tagName === 'canvas') {
                return {
                    getContext: vi.fn().mockReturnValue({
                        drawImage: vi.fn(),
                        getImageData: vi.fn().mockReturnValue({
                            data: new Uint8ClampedArray(4 * 640 * 480)
                        })
                    }),
                    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,'),
                    captureStream: vi.fn().mockReturnValue(new MediaStream()) // Mocking captureStream
                } as unknown as HTMLCanvasElement;
            } else if (tagName === 'a') {
                return {
                    style: { display: '' },
                    href: '',
                    download: '',
                    click: vi.fn()
                } as unknown as HTMLAnchorElement;
            }
            return {} as HTMLElement;
        });

        // Mocking document.body.appendChild and removeChild
        vi.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => node);
        vi.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => node);

        // Mocking URL.createObjectURL and URL.revokeObjectURL
        global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost:3000/12345');
        global.URL.revokeObjectURL = vi.fn();

        canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        recorder = new CanvasRecorder(30);
        recorder.canvas = canvas;
    });

    it('should initialize with correct properties', () => {
        expect(recorder.fps).toBe(30);
        expect(recorder.canvas).toBe(canvas);
        expect(recorder.isRecording).toBe(false);
    });

    it('should start recording', () => {
        recorder.start();
        expect(recorder.isRecording).toBe(true);
    });

    it('should stop recording', async () => {
        recorder.start();
        const stopPromise = recorder.stop();
        await stopPromise;
        expect(recorder.isRecording).toBe(false);
    });

    it('should save an image', () => {
        const createElementSpy = vi.spyOn(document, 'createElement');
        const appendChildSpy = vi.spyOn(document.body, 'appendChild');
        const removeChildSpy = vi.spyOn(document.body, 'removeChild');
        const clickSpy = vi.fn();

        createElementSpy.mockReturnValue({
            style: { display: '' },
            href: '',
            download: '',
            click: clickSpy
        } as unknown as HTMLAnchorElement);

        recorder.saveImage();

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should save a video', async () => {
        const createElementSpy = vi.spyOn(document, 'createElement');
        const appendChildSpy = vi.spyOn(document.body, 'appendChild');
        const removeChildSpy = vi.spyOn(document.body, 'removeChild');
        const clickSpy = vi.fn();

        createElementSpy.mockReturnValue({
            style: { display: '' },
            href: '',
            download: '',
            click: clickSpy
        } as unknown as HTMLAnchorElement);

        recorder.start();
        const stopPromise = recorder.stop();
        await stopPromise;

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
    });
});
