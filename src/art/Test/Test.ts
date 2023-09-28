import Project, { type UpdateDetail2D } from '$lib/base/Project/Project';

export default class ProjectExample extends Project {
    update({ canvas, context, time }: UpdateDetail2D) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const rectSize = Math.sin(time / 1000) / 2 + 0.5;
        context.fillRect(0, 0, rectSize * canvas.width, rectSize * canvas.height);
    }
}
