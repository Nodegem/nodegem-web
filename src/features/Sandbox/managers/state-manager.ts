import { computed, observable } from 'mobx';

type NodeCache = {
    definitions: IHierarchicalNode<NodeDefinition>;
    definitionList: NodeDefinition[];
    definitionLookup: { [id: string]: NodeDefinition };
    selectFriendly: SelectFriendly<NodeDefinition>;
};

interface ISandboxState {
    loadingDefinitions: boolean;
    loadingGraph: boolean;
    linksVisible: boolean;
    savingGraph: boolean;
    isEditingSettings: boolean;
    loadingBridges: boolean;
    activeBridge?: IBridgeInfo;
    bridges: IBridgeInfo[];
    isGraphRunning: boolean;
    isActive: boolean;
    nodeCache: NodeCache;
}

interface IViewState {
    logs: boolean;
    nodeInfo: boolean;
    nodeSelect: boolean;
}

interface IModalState {
    initialPrompt: boolean;
    select: boolean;
}

type TStates = {
    modal: IModalState;
    view: IViewState;
    sandbox: ISandboxState;
};

const initialState: TStates = {
    sandbox: {
        loadingBridges: false,
        loadingGraph: false,
        linksVisible: true,
        savingGraph: false,
        isEditingSettings: false,
        loadingDefinitions: false,
        activeBridge: undefined,
        bridges: [],
        isGraphRunning: false,
        isActive: false,
        nodeCache: {} as any,
    },
    view: {
        logs: false,
        nodeInfo: false,
        nodeSelect: false,
    },
    modal: {
        initialPrompt: true,
        select: false,
    },
};

export class StateManager implements IDisposable {
    private _cachedDefinitions: {
        [graphId: string]: NodeCache;
    } = {};

    @computed
    public get nodeDefinitions(): NodeCache {
        return this.sandboxState.nodeCache;
    }

    @computed
    public get hasActiveBridge(): boolean {
        return !!this.sandboxState.activeBridge;
    }

    @computed
    public get activeBridge(): IBridgeInfo {
        return this.sandboxState.activeBridge || this.sandboxState.bridges[0];
    }

    @computed
    public get hasBridges(): boolean {
        return this.sandboxState.bridges.any();
    }

    @computed
    public get bridges(): IBridgeInfo[] {
        return this.sandboxState.bridges;
    }

    @computed
    public get sandboxState(): ISandboxState {
        return this._state.sandbox;
    }

    @computed
    public get viewState(): IViewState {
        return this._state.view;
    }

    @computed
    public get modalState(): IModalState {
        return this._state.modal;
    }

    @observable
    private _state: TStates = initialState;

    public doesBridgeExist = (bridge: IBridgeInfo): boolean => {
        return this.sandboxState.bridges.any(
            x => x.deviceIdentifier === bridge.deviceIdentifier
        );
    };

    public updateSandboxState(
        key: keyof ISandboxState,
        value: ISandboxState[keyof ISandboxState]
    ) {
        this._state = {
            ...this._state,
            sandbox: this.assoc(this._state.sandbox, key, value),
        };
    }

    public updateViewState(
        key: keyof IViewState,
        value: IViewState[keyof IViewState]
    ) {
        this._state = {
            ...this._state,
            view: this.assoc(this._state.view, key, value),
        };
    }

    public toggleViewState(key: keyof IViewState) {
        this.updateViewState(key, this.viewState[key].toggle());
    }

    public updateModalState(
        key: keyof IModalState,
        value: IModalState[keyof IModalState]
    ) {
        this._state = {
            ...this._state,
            modal: this.assoc(this._state.modal, key, value),
        };
    }

    public toggleModalState(key: keyof IModalState) {
        this.updateModalState(key, this.viewState[key].toggle());
    }

    public resetState = () => {
        this._state = initialState;
    };

    public resetViewState = () => {
        this._state = {
            ...this._state,
            view: initialState.view,
        };
    };

    public resetModalState = () => {
        this._state = {
            ...this._state,
            modal: initialState.modal,
        };
    };

    public dispose() {
        this.resetState();
        this._cachedDefinitions = {};
    }

    public cacheDefinitions(id: string, cache: NodeCache) {
        this._cachedDefinitions[id] = cache;
    }

    public hasCachedDefinition(id: string): boolean {
        return this._cachedDefinitions[id] !== undefined;
    }

    public getCachedDefinition(id: string): NodeCache {
        return this._cachedDefinitions[id];
    }

    private assoc = <Type, Key extends keyof Type>(
        obj: Type,
        key: Key,
        value: Type[Key]
    ) => {
        return { ...obj, [key]: value };
    };
}
