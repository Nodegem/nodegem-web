import { action, observable, runInAction } from 'mobx';
import { ignore } from 'mobx-sync';
import { GraphService } from 'src/services';

import { IDisposableStore, userStore } from './';

class GraphStore implements IDisposableStore {
    @observable
    graphs: Array<Graph> = [];

    @ignore
    @observable
    loadingGraphs: boolean = false;

    @action
    async createGraph(graph: CreateGraph) {
        this.loadingGraphs = true;

        try {
            const { id } = userStore.user!;
            const newGraph = await GraphService.create({
                ...graph,
                userId: id,
            });
            runInAction(() => {
                this.graphs.push(newGraph);
            });
        } catch (e) {
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
        let updatedGraph: Graph | undefined;
        try {
            const { id } = userStore.user!;
            updatedGraph = await GraphService.update({ ...graph, userId: id });
            runInAction(() => {
                const index = this.graphs.findIndex(x => x.id === graph.id);
                if (index >= 0) {
                    this.graphs[index] = updatedGraph!;
                }
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });

            return updatedGraph;
        }
    }

    @action
    async deleteGraph(graph: Graph) {
        this.loadingGraphs = true;

        try {
            await GraphService.delete(graph.id);
            runInAction(() => {
                this.graphs = this.graphs.filter(x => x.id !== graph.id);
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
    }

    @action
    async fetchGraphs(force: boolean = false) {
        if (!force && this.graphs && !this.graphs.empty()) {
            return;
        }

        this.loadingGraphs = true;

        try {
            const graphs = await GraphService.getAll();
            runInAction(() => {
                this.graphs = graphs as Array<Graph>;
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
    }

    getGraphById(graphId: string) {
        if (!graphId) return undefined;

        return this.graphs.find(x => x.id === graphId);
    }

    @action dispose() {
        this.graphs = [];
    }
}

export default new GraphStore();

export { GraphStore };
