import { Store } from 'overstated';
import { SandboxStore } from '.';

interface INodeInfoState {
    isOpen: boolean;
    selectedNode?: INodeUIData;
}

export class NodeInfoStore extends Store<INodeInfoState, SandboxStore> {
    public state: INodeInfoState = {
        isOpen: false,
    };

    public setSelectedNode = (node: INodeUIData) => {
        this.setState({ selectedNode: node });
    };

    public toggleOpen = (value?: boolean) => {
        this.setState({ isOpen: this.state.isOpen.toggle(value) });
    };
}
