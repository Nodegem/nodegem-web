import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';

export type TSandboxCanvasStore = ReturnType<typeof createSandboxCanvasStore>;
export function createSandboxCanvasStore() {
    return {
        sandboxManager: (null as unknown) as SandboxManager,
        setManager(value: SandboxManager) {
            this.sandboxManager = value;
        },
        get nodes() {
            return this.sandboxManager.nodes;
        },
        loadNodes(nodes: any[]) {
            this.sandboxManager.load(nodes);
        },
    };
}
