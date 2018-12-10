import { observable, action, computed } from "mobx";

class EditorStore {

    @computed get hasGraph() { return !!this.currentGraph; }

    @observable
    currentGraph?: Graph;

    @observable
    activeTabKey: number = 0;

    @observable
    tabs: { [tabKey: number] : { title: string, closable: boolean }} = {
        0: { title: "Tab 1", closable: false }
    };

    @action setGraph(graph?: Graph) {
        this.currentGraph = graph;
    }

}

export default new EditorStore();

export { EditorStore };