import { Store } from 'overstated';
import { SandboxStore } from '.';

interface INodeSelectState {
    isOpen: boolean;
    isLoadingDefinitions: boolean;
    nodeOptions: NodeCache;
}

export class NodeSelectStore extends Store<INodeSelectState, SandboxStore> {
    public state = {
        isOpen: false,
        isLoadingDefinitions: false,
        nodeOptions: {} as any,
    };

    public toggleOpen = (value?: boolean) => {
        this.setState({ isOpen: this.state.isOpen.toggle(value) });
    };

    public addNode = (definition: NodeDefinition) => {
        this.ctx.canvasStore.createNodeFromDefinition(definition, true);
    };

    public setNodeOptions = (cache: NodeCache) => {
        this.setState({ nodeOptions: cache });
    };
}
