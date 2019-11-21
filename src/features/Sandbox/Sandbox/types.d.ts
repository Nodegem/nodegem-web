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

type GraphState = Graph | Macro;

interface IDisposable {
    dispose(): void;
}

interface IPortUIData {
    id: string;
    name: string;
    type: PortType;
    io: PortIOType;
    connected?: boolean;
    connecting?: boolean;
    value?: any;
    valueType?: ValueType;
    defaultValue?: any;
    indefinite?: boolean;
}

interface INodeUIData {
    id: string;
    title: string;
    fullName: string;
    description: string;
    portData: {
        flowInputs: IPortUIData[];
        flowOutputs: IPortUIData[];
        valueInputs: IPortUIData[];
        valueOutputs: IPortUIData[];
    };
    position?: Vector2;
    permanent?: boolean;
    macroFieldId?: string;
    macroId?: string;
}

interface ILinkUIData {
    sourceNodeId: string;
    source: HTMLElement;
    sourceData: IPortUIData;
    destinationNodeId: string;
    destination: HTMLElement;
    destinationData: IPortUIData;
}

interface ILinkInitializeData {
    sourceNodeId: string;
    sourceData: IPortUIData;
    destinationNodeId: string;
    destinationData: IPortUIData;
}