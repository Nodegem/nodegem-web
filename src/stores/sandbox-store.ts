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
    };
}
