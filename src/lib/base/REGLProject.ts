import REGL from 'regl';
import Project, { CanvasType } from './Project';

// todo: keep working on this

export default class REGLProject extends Project {
    public regl?: REGL.Regl;

    canvasType = CanvasType.WebGL;

    init() {
        if (!this.canvas) throw new Error('Canvas not initialized');
        this.regl = REGL(this.canvas as HTMLCanvasElement);
    }

    public destroy() {
        super.destroy();
        this.regl?.destroy();
    }
}
