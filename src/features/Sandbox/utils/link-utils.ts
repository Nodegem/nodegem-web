export const isValidConnection = (
    p1: PortDataSlim,
    p2: PortDataSlim
): boolean => {
    if (p1.io === p2.io) {
        return false;
    }

    if (p1.type !== p2.type) {
        return false;
    }

    if (p1.nodeId === p2.nodeId) {
        return false;
    }

    const source = p1.io === 'output' ? p1 : p2;
    const destination = p1.io === 'output' ? p2 : p1;

    if (source.type === 'flow' && source.connected) {
        return false;
    }

    return true;
};

export const flowPath = (source: Vector2, destination: Vector2) => {
    const s = source.y < destination.y ? source : destination;
    const d = source.y < destination.y ? destination : source;
    const hy1 = s.y + Math.abs(d.y - s.y) * 0.5;
    const hy2 = d.y - Math.abs(d.y - s.y) * 0.5;
    return `M ${s.x} ${s.y} C ${s.x} ${hy1} ${d.x} ${hy2} ${d.x} ${d.y}`;
};

export const valuePath = (source: Vector2, destination: Vector2) => {
    const s = source.x < destination.x ? source : destination;
    const d = source.x < destination.x ? destination : source;
    const hx1 = s.x + Math.abs(d.x - s.x) * 0.5;
    const hx2 = d.x - Math.abs(d.x - s.x) * 0.5;
    return `M ${s.x} ${s.y} C ${hx1} ${s.y} ${hx2} ${d.y} ${d.x} ${d.y}`;
};

export const updateLinkPath = (
    link: ILinkUIData,
    coordConverter: (element: HTMLElement) => Vector2
) => {
    const source = coordConverter(link.source);
    const destination = coordConverter(link.destination);
    const path =
        link.type === 'flow'
            ? flowPath(source, destination)
            : valuePath(source, destination);

    link.getLinkElement().setAttribute('d', path);
};

export const getLinkId = (link: ILinkUIData) =>
    `${link.sourceNodeId}|${link.sourceData.id}|${link.destinationNodeId}|${link.destinationData.id}`;

export const generateLinkId = (
    sourceNodeId: string,
    sourcePort: IPortUIData,
    destinationNodeId: string,
    destinationPort: IPortUIData
) =>
    `${sourceNodeId}|${sourcePort.id}|${destinationNodeId}|${destinationPort.id}`;

// export const getSourceData = (link: ILinkUIData) => {
//     return link.destination === this.sourceElement
//         ? this._linkData.sourceData
//         : this._linkData.destinationData;
// };

// export const getSourceNodeId = (element: HTMLElement) => {
//     return element === this.sourceElement
//         ? this.sourceNodeId
//         : this.destinationNodeId;
// };

// export const getOppositePortElement = (element: HTMLElement) => {
//     return element === this.sourceElement
//         ? this.destinationElement
//         : this.sourceElement;
// };

// export const getOppositeData = (element: HTMLElement) => {
//     return element === this.sourceElement
//         ? this._linkData.destinationData
//         : this._linkData.sourceData;
// };

// export const getOppositeNodeId = (element: HTMLElement) => {
//     return element === this.sourceElement
//         ? this.destinationNodeId
//         : this.sourceNodeId;
// };

export const getOppositeNodeIdFromId = (link: ILinkUIData, nodeId: string) => {
    return nodeId === link.sourceNodeId
        ? link.destinationNodeId
        : link.sourceNodeId;
};

// export const toggleSourcePort = (element: HTMLElement) => {
//     if (element === this.sourceElement) {
//         this._linkData.sourceData.connected = !this._linkData
//             .destinationData.connected;
//     } else {
//         this._linkData.destinationData.connected = !this._linkData
//             .sourceData.connected;
//     }
// };

// export const toggleConnectedOppositePort = (element: HTMLElement) => {
//     if (element === this.sourceElement) {
//         this._linkData.destinationData.connected = !this._linkData
//             .destinationData.connected;
//     } else {
//         this._linkData.sourceData.connected = !this._linkData.sourceData
//             .connected;
//     }
// };
