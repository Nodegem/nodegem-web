import { Store } from 'overstated';

interface IPanelState {
    nodeInfoOpen: boolean;
    nodeSelectOpen: boolean;
    consoleOpen: boolean;
}

export class PanelStore extends Store<IPanelState> {
    public state: IPanelState = {
        nodeInfoOpen: false,
        nodeSelectOpen: false,
        consoleOpen: false,
    };

    public toggleNodeInfo = (value?: boolean) => {
        this.setState({
            nodeInfoOpen: this.state.nodeInfoOpen.toggle(value),
        });
    };

    public toggleNodeSelect = (value?: boolean) => {
        this.setState({
            nodeSelectOpen: this.state.nodeSelectOpen.toggle(value),
        });
    };

    public toggleConsole = (value?: boolean) => {
        this.setState({
            consoleOpen: this.state.consoleOpen.toggle(value),
        });
    };
}
