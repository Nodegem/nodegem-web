import { Store } from 'overstated';
import { SandboxStore } from '../stores';

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

    public updatePortData = async (
        node: INodeUIData,
        ports: IPortUIData[],
        type: 'input' | 'output'
    ) => {
        await this.ctx.canvasStore.updateNode(node.id, oldNode =>
            this.ctx.canvasStore.updateNodePortList(
                oldNode,
                'value',
                type,
                _ => ports
            )
        );
    };
}
