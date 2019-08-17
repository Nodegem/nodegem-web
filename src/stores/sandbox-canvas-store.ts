import SandboxManager from 'features/Sandbox/Sandbox/sandbox-manager';

export type TSandboxCanvasStore = ReturnType<typeof createSandboxCanvasStore>;
export function createSandboxCanvasStore() {
    return {
        sandboxManager: (null as unknown) as SandboxManager<string>,
        nodes() {
            return this.sandboxManager.nodes;
        },
        get isDrawingLink() {
            return this.sandboxManager.isDrawingLink;
        },
    };
}
