import { NodeService } from 'services';

export type TSandboxStore = ReturnType<typeof createSandboxStore>;

export function createSandboxStore() {
    return {
        nodeSelectClosed: false,
        toggleNodeSelect() {
            this.nodeSelectClosed = !this.nodeSelectClosed;
        },
        nodeInfoClosed: true,
        toggleNodeInfo() {
            this.nodeInfoClosed = !this.nodeInfoClosed;
        },
        loadDefinitions(graphId: string, type: GraphType) {
            return NodeService.getAllNodeDefinitions(graphId, type);
        },
    };
}
