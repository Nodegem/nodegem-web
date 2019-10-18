import { Store } from 'overstated';
import { SandboxStore } from '.';

interface ISandboxHeaderState {
    isSavingGraph: boolean;
    isRunning: boolean;
    bridge?: IBridgeInfo;
    bridges: IBridgeInfo[];
    loadingBridges: boolean;
    modifyingGraphSettings: boolean;
}

export class SandboxHeaderStore extends Store<
    ISandboxHeaderState,
    SandboxStore
> {
    public state: ISandboxHeaderState = {
        isSavingGraph: false,
        isRunning: false,
        bridges: [],
        loadingBridges: false,
        modifyingGraphSettings: false,
    };

    public get hasBridgeSelected(): boolean {
        return !!this.state.bridge;
    }

    public get canSave(): boolean {
        return false;
    }

    public get canEdit(): boolean {
        return false;
    }

    public get canRun(): boolean {
        return false;
    }

    public get canSelectBridge(): boolean {
        return false;
    }

    public onBridgeSelect = (bridge: IBridgeInfo) => {};

    public onEditGraph = () => {
        this.setState({ modifyingGraphSettings: true });
    };

    public refreshBridges = () => {};
}
