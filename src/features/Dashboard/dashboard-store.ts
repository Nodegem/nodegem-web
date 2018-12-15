import { action, observable, runInAction, toJS } from 'mobx';
import { ModalFormType } from 'src/features/Dashboard/dashboard-store';
import { GraphService } from 'src/services';
import { userStore } from 'src/stores';
import { getHeapStatistics } from 'v8';

export type ModalFormType = "graph" | "macro";

interface ModalDataOptions {
    open: boolean,
    data: object,
    editMode: boolean
}

type ModalOption = { [key in ModalFormType] : ModalDataOptions };

class DashboardStore {

    @observable loadingGraphs: boolean = false;
    @observable graphs : Array<Graph> = [];

    @observable loadingMacros: boolean = false;
    @observable macros : Array<Macro> = [];

    @observable modalOptions: ModalOption = { 
        "graph": { editMode: false, open: false, data: {} },
        "macro": { editMode: false, open: false, data: {} }
    };

    @action openModal(type: ModalFormType, editMode: boolean = false, modelData = {}) {
        Object.keys(this.modalOptions).forEach(x => {
            let data = this.modalOptions[x] as ModalDataOptions;
            if(x === type) {
                data.editMode = editMode;
                data.open = true;
                data.data = modelData;
            } else {
                data.open = false;
                data.editMode = false;
            }
        })
    }

    @action closeModal(type: ModalFormType) {
        this.modalOptions[type].open = false;
        this.modalOptions[type].data = {};
    }

    @action 
    async createNewGraph(graph: CreateGraph) {
        this.loadingGraphs = true;

        try {
            const { id } = userStore.user!;
            const newGraph = await GraphService.create({ ...graph, userId: id });
            runInAction(() => {
                this.graphs.push(newGraph);
            })

        } catch(e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
    }

    @action
    async updateGraph(graph: Graph) {
        this.loadingGraphs = true;
        try {
            const { id } = userStore.user!;
            const updatedGraph = await GraphService.update({ ...graph, userId: id });
            runInAction(() => {
                const index = this.graphs.findIndex(x => x.id === graph.id);
                if(index >= 0) {
                    this.graphs[index] = updatedGraph;
                }
            })
        } catch(e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
    }

    @action
    async deleteGraph(graph: Graph) {

        this.loadingGraphs = true;

        try {
            await GraphService.delete(graph.id);
            runInAction(() => {
                this.graphs = this.graphs.filter(x => x.id !== graph.id);
            })
        } catch(e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            })
        }
    }

    @action 
    async fetchGraphs() {
        this.loadingGraphs = true;

        if(this.graphs && !this.graphs.empty()) {
            this.loadingGraphs = false;
            return;
        }

        try {
            const { id } = userStore.user!;
            const graphs = await GraphService.getAll(id);
            runInAction(() => {
                this.graphs = graphs as Array<Graph>;
            });
        } catch(e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            })
        }

    }

    @action 
    async fetchMacros() {
        this.loadingMacros = true;
        try {
            const macros = [];
            runInAction(() => {
                this.macros = macros
            })
        } catch(e) {

        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            })
        }
    }

}

export default new DashboardStore();

export { DashboardStore }