import { Store } from 'overstated';
import { graphModalStore, macroModalStore } from 'stores';
import { isMacro } from 'utils';
import { SandboxStore } from '.';

interface ISandboxHeaderState {
    isSavingGraph: boolean;
    isRunning: boolean;
    bridge?: IBridgeInfo;
    bridges: IBridgeInfo[];
    loadingBridges: boolean;
    modifyingGraphSettings: boolean;
    canSave: boolean;
    canEdit: boolean;
    canSelectBridge: boolean;
    canRun: boolean;
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
        canSave: false,
        canEdit: false,
        canRun: false,
        canSelectBridge: false,
    };

    public get hasBridgeSelected(): boolean {
        return !!this.state.bridge;
    }

    public onBridgeSelect = (bridge: IBridgeInfo) => {};

    public onEditGraph = () => {
        const { graph } = this.ctx.tabsStore.activeTab;
        if (isMacro(graph)) {
            macroModalStore.openModal(graph, true);
        } else {
            graphModalStore.openModal(graph, true);
        }
        this.setState({ modifyingGraphSettings: true });
    };

    public onTabLoaded = () => {
        this.setState({
            canSave: true,
            canEdit: true,
            canSelectBridge: true,
        });
    };

    public onTabUnloaded = () => {
        this.setState({
            canSave: false,
            canEdit: false,
            canRun: false,
            canSelectBridge: false,
        });
    };

    public refreshBridges = () => {};
}
