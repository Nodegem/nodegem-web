export const createTransform = (coords: XYCoords, scale: number = 1) : string => {
    const [x, y] = coords;
    return `translate(${x},${y}), scale(${scale})`;
}

export const hasChildWithClass = (element: Element, className: string, maxDepth : number = 3) => {

    let currentElement : Element | null = element;
    let currentDepth = 0;

    do {
        if(currentElement.className === className) return true;
        currentElement = currentElement.parentElement;
        currentDepth++;
    } 
    while(currentElement && currentDepth < maxDepth);

    return false;
}