/* eslint-disable @typescript-eslint/no-explicit-any */

import { FrameRecorder } from '$lib/base/Util/FrameRecorder';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FrameRecorder', () => {
    let canvas: HTMLCanvasElement;
    let recorder: FrameRecorder;
    let mockZipFile: any;
    let mockZipGenerateAsync: any;

    beforeEach(() => {
        // Create mock functions for JSZip
        mockZipFile = vi.fn();
        mockZipGenerateAsync = vi.fn().mockResolvedValue(new Blob());

        // Create a mock JSZip creator function
        const mockZipCreator = () => ({
            file: mockZipFile,
            generateAsync: mockZipGenerateAsync
        });

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
                    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,')
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

        canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = 640;
        canvas.height = 480;

        recorder = new FrameRecorder(mockZipCreator as any);
        recorder.canvas = canvas;
    });

    it('should initialize with correct properties', () => {
        expect(recorder.saveName).toBe('skbk-capture');
        expect(recorder.isRecording).toBe(false);
        expect(recorder.currentFrameCount).toBe(0);
    });

    it('should start recording', () => {
        const startCallback = vi.fn();
        recorder.onStart(startCallback);
        recorder.startRecording(10);
        expect(recorder.isRecording).toBe(true);
        expect(startCallback).toHaveBeenCalled();
    });

    it('should record frames', () => {
        recorder.startRecording(3);
        recorder.recordFrame();
        recorder.recordFrame();
        expect(recorder.isRecording).toBe(true);
        expect(recorder.currentFrameCount).toBe(2);
        expect(mockZipFile).toHaveBeenCalledTimes(2);
        recorder.recordFrame();
        expect(recorder.isRecording).toBe(false);
        expect(recorder.currentFrameCount).toBe(3);
        expect(mockZipFile).toHaveBeenCalledTimes(3);
    });

    it('should stop recording after specified frames and save', async () => {
        const appendChildSpy = vi.spyOn(document.body, 'appendChild');
        const removeChildSpy = vi.spyOn(document.body, 'removeChild');
        const clickSpy = vi.fn();

        vi.spyOn(document, 'createElement').mockReturnValue({
            style: { display: '' },
            href: '',
            download: '',
            click: clickSpy
        } as unknown as HTMLAnchorElement);

        const stopCallback = vi.fn();
        recorder.onStop(stopCallback);
        recorder.startRecording(1);
        recorder.recordFrame();
        expect(recorder.isRecording).toBe(false);
        expect(stopCallback).toHaveBeenCalledWith(true);

        await new Promise((r) => setTimeout(r, 100));
        expect(appendChildSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should save a single frame', () => {
        const appendChildSpy = vi.spyOn(document.body, 'appendChild');
        const removeChildSpy = vi.spyOn(document.body, 'removeChild');
        const clickSpy = vi.fn();

        vi.spyOn(document, 'createElement').mockReturnValue({
            style: { display: '' },
            href: '',
            download: '',
            click: clickSpy
        } as unknown as HTMLAnchorElement);

        recorder.saveSingleFrame();

        expect(appendChildSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should cancel recording', () => {
        const stopCallback = vi.fn();
        recorder.onStop(stopCallback);
        recorder.startRecording(10);
        recorder.cancelRecording();
        expect(recorder.isRecording).toBe(false);
        expect(stopCallback).toHaveBeenCalledWith(false);
    });

    it('should create zip content', async () => {
        recorder.startRecording(1);
        recorder.recordFrame();
        expect(mockZipGenerateAsync).toHaveBeenCalledWith({ type: 'blob' });
    });
});
