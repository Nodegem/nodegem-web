import { action, computed, observable, runInAction } from 'mobx';
import { UtilService } from 'src/services';

class EditorStore {

    @computed get hasGraph() { return !!this.currentGraph; }

    @observable
    currentGraph?: Graph;

    @observable loadingDefinitions: boolean = false;
    @observable
    nodeDefinitions: Array<NodeDefinition> = [];

    @observable
    activeTabKey: number = 0;

    @observable
    tabs: { [tabKey: number] : { title: string, closable: boolean }} = {
        0: { title: "Tab 1", closable: false }
    };

    @action 
    async loadDefinitions() {
        this.loadingDefinitions = true;

        if(this.nodeDefinitions && this.nodeDefinitions.length > 0) {
            this.loadingDefinitions = false;
            return;
        }

        try {
            const definitions = await UtilService.getAllNodeDefinitions();
            runInAction(() => {
                this.nodeDefinitions = definitions;
            })
        } catch(e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingDefinitions = false;
            });
        }
    }

    getDefinitionByNamespace = (namespace: string) : NodeDefinition => {
        return this.nodeDefinitions.filter(x => x.namespace === namespace).firstOrDefault()!;
    }

    getStartNodeDefinition = () : NodeDefinition => {
        return this.nodeDefinitions.filter(x => x.title.startsWith("Start")).firstOrDefault()!;
    }

    @action setGraph(graph?: Graph) {
        this.currentGraph = graph;
    }

}

export default new EditorStore();

export { EditorStore };