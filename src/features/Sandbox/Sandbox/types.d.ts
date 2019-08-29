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

interface IDisposable {
    dispose(): void;
}

interface IPortData {
    id: string;
    name: string;
    type: PortType;
    connected: boolean;
}

interface INodeData {
    id: string;
    title: string;
    portData: {
        flowInputs: IPortData[];
        flowOutputs: IPortData[];
        valueInputs: IPortData[];
        valueOutputs: IPortData[];
    };
    position?: Vector2;
}
