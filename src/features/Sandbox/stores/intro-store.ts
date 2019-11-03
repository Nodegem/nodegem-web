import { Store } from 'overstated';
import { SandboxStore } from '.';
interface IIntroState {
    isInStartPrompt: boolean;
    isChoosingGraphState: boolean;
    isGraphModalOpen: boolean;
    isMacroModalOpen: boolean;
    isMacroRunModalOpened: boolean;
    graphToEdit?: Graph | Macro;
}

export class IntroStore extends Store<IIntroState, SandboxStore> {
    public state: IIntroState = {
        isInStartPrompt: false,
        isChoosingGraphState: false,
        isGraphModalOpen: false,
        isMacroModalOpen: false,
        isMacroRunModalOpened: false,
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

    public toggleMacroRunModal = (value?: boolean) => {
        this.setState({
            isMacroRunModalOpened: this.state.isMacroRunModalOpened.toggle(
                value
            ),
        });
    };

    public goBack = () => {
        if (!this.state.graphToEdit) {
            this.suspend();
            this.toggleChoosingGraphState(false);
            this.toggleStartPrompt();
            this.unsuspend();
        }

        this.setState({
            isGraphModalOpen: false,
            isMacroModalOpen: false,
        });
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
            this.setState({ isGraphModalOpen: true });
        } else {
            this.setState({ isMacroModalOpen: true });
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
