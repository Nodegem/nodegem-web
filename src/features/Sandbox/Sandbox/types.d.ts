type Transform = { x: number; y: number; scale: number };
type Vector2 = {
    x: number;
    y: number;
};

type Dimensions = {
    width: number;
    height: number;
};

type Bounds = {
    left: number;
    top: number;
} & Dimensions;

type PortEvent = 'up' | 'down';
type PortType = 'value' | 'flow';
type PortIOType = 'input' | 'output';

interface IDisposable {
    dispose(): void;
}

interface IPortUIData {
    id: string;
    name: string;
    type: PortType;
    io: PortIOType;
    connected: boolean;
}

interface INodeUIData {
    id: string;
    title: string;
    portData: {
        flowInputs: IPortUIData[];
        flowOutputs: IPortUIData[];
        valueInputs: IPortUIData[];
        valueOutputs: IPortUIData[];
    };
    position?: Vector2;
}

interface ILinkUIData {
    sourceNodeId: string;
    source: HTMLElement;
    sourceData: IPortUIData;
    destinationNodeId: string;
    destination: HTMLElement;
    destinationData: IPortUIData;
}
