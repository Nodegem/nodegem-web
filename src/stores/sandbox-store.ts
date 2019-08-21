import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';
import { action, computed, observable } from 'mobx';
import { NodeService } from 'services';

export class SandboxStore {
    @observable
    public sandboxes: Map<
        string,
        { manager: SandboxManager; graph: Graph | Macro }
    > = new Map();

    @computed
    public get tabs(): { graph: Graph | Macro; manager: SandboxManager }[] {
        return Array.from(this.sandboxes).map(x => x[1]);
    }

    @observable
    public nodeSelectClosed: boolean = false;

    @observable
    public nodeInfoClosed: boolean = true;

    @action
    public toggleNodeInfo() {
        this.nodeInfoClosed = !this.nodeInfoClosed;
    }

    @action
    public toggleNodeSelect() {
        this.nodeSelectClosed = !this.nodeSelectClosed;
    }

    @action
    public loadDefinitions(graphId: string, type: GraphType) {
        return NodeService.getAllNodeDefinitions(graphId, type);
    }

    @action
    public addTab(graph: Graph | Macro) {
        if (this.sandboxes.has(graph.id)) {
            return;
        }

        this.sandboxes.set(graph.id, { manager: new SandboxManager(), graph });
    }

    @action
    public deleteTab(graphId: string) {
        this.sandboxes.delete(graphId);
    }
}
