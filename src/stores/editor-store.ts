import { observable, action, computed } from "mobx";
import { UtilService } from "src/services";

class EditorStore {

    @computed get hasGraph() { return !!this.currentGraph; }

    @observable
    currentGraph?: Graph;

    @observable
    nodeDefinitions: Array<NodeDefinition> = [];

    @observable
    activeTabKey: number = 0;

    @observable
    tabs: { [tabKey: number] : { title: string, closable: boolean }} = {
        0: { title: "Tab 1", closable: false }
    };

    constructor() {
        this.loadDefinitions();
    }

    @action 
    async loadDefinitions() {
        this.nodeDefinitions = await UtilService.getAllNodeDefinitions();
    }

    @action setGraph(graph?: Graph) {
        this.currentGraph = graph;
    }

}

export default new EditorStore();

export { EditorStore };