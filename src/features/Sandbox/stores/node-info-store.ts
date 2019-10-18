import { Store } from 'overstated';
import { SandboxStore } from '.';
import NodeController from '../Node/node-controller';

interface INodeInfoState {
    isOpen: boolean;
    selectedNode?: NodeController;
}

export class NodeInfoStore extends Store<INodeInfoState, SandboxStore> {
    public state: INodeInfoState = {
        isOpen: false,
    };

    public setSelectedNode = (node: NodeController) => {
        this.setState({ selectedNode: node });
    };

    public toggleOpen = (value?: boolean) => {
        this.setState({ isOpen: this.state.isOpen.toggle(value) });
    };
}
