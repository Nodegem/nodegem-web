import { Store } from 'overstated';

interface IPanelState {
    nodeInfoOpen: boolean;
    nodeSelectOpen: boolean;
}

export class PanelStore extends Store<IPanelState> {
    public state: IPanelState = {
        nodeInfoOpen: false,
        nodeSelectOpen: false,
    };

    public toggleNodeInfo(value?: boolean) {
        this.setState({
            nodeInfoOpen: this.state.nodeInfoOpen.toggle(value),
        });
    }

    public toggleNodeSelect(value?: boolean) {
        this.setState({
            nodeSelectOpen: this.state.nodeSelectOpen.toggle(value),
        });
    }
}
