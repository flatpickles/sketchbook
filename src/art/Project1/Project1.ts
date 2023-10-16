import Project, { CanvasType, type ParamsChangedDetail } from '$lib/base/Project/Project';

export default class Project1 extends Project {
    num1 = 1; // 1 to 15
    num2 = 2; // 1 to 15
    num3 = 3; // 1 to 15

    paramsChanged(detail: ParamsChangedDetail<CanvasType>): void {
        console.log('paramsChanged', detail);
    }
}
