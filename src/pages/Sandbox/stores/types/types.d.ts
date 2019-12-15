interface ICanvasState {
    nodes: INodeUIData[];
    links: ILinkUIData[];
    nodeGroupings: IUINodeGroupingState[];
    linksVisible: boolean;
    openContext?: { id: string; canDelete: boolean };
    hasLoadedGraph: boolean;
}

interface ICanvasChildren {
    drawLinkStore: DrawLinkStore;
    searchStore: CanvasSearchStore;
}

interface IUINodeGroupingState {
    id: string;
    title: string;
}

interface INodeMetaData {
    id: string;
    position: Vector2;
    element: () => HTMLDivElement;
    _element?: HTMLDivElement;
    links: string[];
}

interface MonitoredCanvasState {
    nodes: MonitoredNodeState[];
    links: MonitoredLinkState[];
    nodeGroupings: IUINodeGroupingState[];
}

type MonitoredLinkState = Omit<
    ILinkUIData,
    | 'source'
    | 'destination'
    | 'element'
    | 'sourceIconElement'
    | 'destinationIconElement'
>;

type MonitoredNodestate = Omit<INodeUIData, 'isFaded' | 'selected'>;
