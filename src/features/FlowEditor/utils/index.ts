import { XYCoords } from './../../Editor/utils/types.d';

export const convertCoords = (parentElement: SVGSVGElement, element: SVGSVGElement | SVGGElement, coords: XYCoords) : XYCoords => {
    const pt = parentElement.createSVGPoint();
    pt.x = coords[0];
    pt.y = coords[1];
    const newCoords = pt.matrixTransform(element.getScreenCTM()!.inverse());
    return [newCoords.x, newCoords.y];
}