import { Store } from 'overstated';
import { graphModalStore, macroModalStore } from 'stores';
import { SandboxStore } from '.';
interface IIntroState {
    isInStartPrompt: boolean;
    isChoosingGraphState: boolean;
}

export class IntroStore extends Store<IIntroState, SandboxStore> {
    public state: IIntroState = {
        isInStartPrompt: false,
        isChoosingGraphState: false,
    };

    public toggleStartPrompt = (value?: boolean) => {
        this.setState({
            isInStartPrompt: this.state.isInStartPrompt.toggle(value),
        });
    };

    public toggleChoosingGraphState = (value?: boolean) => {
        this.setState({
            isChoosingGraphState: this.state.isChoosingGraphState.toggle(value),
        });
    };

    public goBack = () => {
        if (!this.ctx.sandboxHeaderStore.state.modifyingGraphSettings) {
            this.suspend();
            this.toggleChoosingGraphState(false);
            this.toggleStartPrompt();
            this.unsuspend();
        } else {
            this.ctx.sandboxHeaderStore.setState({
                modifyingGraphSettings: false,
            });
        }
    };

    public onGraphSelect = () => {
        this.suspend();
        this.toggleStartPrompt(false);
        this.toggleChoosingGraphState(true);
        this.unsuspend();
    };

    public onGraphCreate = (type: GraphType) => {
        this.suspend();
        this.toggleStartPrompt(false);
        this.toggleChoosingGraphState(false);
        this.unsuspend();

        if (type === 'graph') {
            graphModalStore.openModal({ isActive: true });
        } else {
            macroModalStore.openModal();
        }
    };

    public onGraphSelected = (graph: Graph | Macro) => {
        this.suspend();
        this.toggleChoosingGraphState(false);
        this.toggleStartPrompt(false);
        this.unsuspend();
        this.ctx.tabsStore.addTab(graph);
    };
}
