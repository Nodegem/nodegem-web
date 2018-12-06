import { observable, computed, action } from "mobx";
import { graphService } from "src/services/graph/graph-service";

type ModalOptionsKey = "graph" | "macro";

class DashboardStore {

    @observable
    graphs: Array<Graph> = [];

    @observable
    macros: Array<Macro> = [];

    @observable
    modalOptions: { 
        [key in ModalOptionsKey]: {
            visible: boolean,
            value?: object
        } 
    } = {
        "graph": {
            visible: false
        },
        "macro": {
            visible: false
        }
    };

    @action
    public async loadGraphs() {
        this.graphs = await graphService.getAllGraphs();
        this.macros = [];
    }

    @action
    public addGraph(graph: Graph) {
        this.graphs.push(graph);
    }

    @action
    public removeGraph(graph: Graph) {
        this.graphs = this.graphs.filter(x => x !== graph);
    }

}

export const dashboardStore = new DashboardStore();