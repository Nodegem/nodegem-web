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
    nodeId: string;
    name: string;
    type: PortType;
    io: PortIOType;
    connected: boolean;
    indefinite: boolean;
    value?: any;
    valueType?: ValueType;
    defaultValue?: any;
    isEditable?: boolean;
    allowConnection?: boolean;
    valueOptions?: any[];
}

interface INodeUIData {
    id: string;
    title: string;
    definitionId: string;
    fullName: string;
    description: string;
    selected: boolean;
    flowInputs: IPortUIData[];
    flowOutputs: IPortUIData[];
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
    isFaded?: boolean;
    position: Vector2;
    permanent?: boolean;
    macroFieldId?: string;
    macroId?: string;
    constantId?: string;
}

interface ILinkUIData {
    id: string;
    sourceNodeId: string;
    source: HTMLElement;
    sourceData: IPortUIData;
    destinationNodeId: string;
    destination: HTMLElement;
    destinationData: IPortUIData;
    type: PortType;
    element: SVGPathElement;
    sourceIconElement: HTMLElement;
    destinationIconElement: HTMLElement;
}

interface ILinkInitializeData {
    sourceNodeId: string;
    sourceData: IPortUIData;
    destinationNodeId: string;
    destinationData: IPortUIData;
}
