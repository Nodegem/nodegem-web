class CanvasThing {

    size: [number, number];
    zoomRange: [number, number];

    constructor(size: [number, number], zoomRange: [number, number]) {
        this.size = size;
        this.zoomRange = zoomRange;
    }

}

export { CanvasThing };