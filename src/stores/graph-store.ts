<<<<<<< HEAD
import { observable, action, runInAction } from 'mobx';
import { ignore } from 'mobx-sync';
import { userStore, IDisposableStore } from '.';
import { GraphService } from 'src/services';
=======
import { observable, action, runInAction } from "mobx";
import { ignore } from "mobx-sync";
import { userStore, IDisposableStore } from ".";
import { GraphService } from "src/services";

class GraphStore implements IDisposableStore {
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d

class GraphStore implements IDisposableStore {
    @observable
    graphs: Array<Graph> = [];

    @ignore
    @observable
    loadingGraphs: boolean = false;

<<<<<<< HEAD
    @action
    async createGraph(graph: CreateGraph) {
=======
    @action 
    async createNewGraph(graph: CreateGraph) {
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
        this.loadingGraphs = true;

        try {
            const { id } = userStore.user!;
<<<<<<< HEAD
            const newGraph = await GraphService.create({
                ...graph,
                userId: id,
            });
            runInAction(() => {
                this.graphs.push(newGraph);
            });
        } catch (e) {
=======
            const newGraph = await GraphService.create({ ...graph, userId: id });
            runInAction(() => {
                this.graphs.push(newGraph);
            })

        } catch(e) {
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
    }

    @action
<<<<<<< HEAD
    async updateGraph(graph: Graph) {
        this.loadingGraphs = true;
=======
    async updateGraph(graph: Graph) : Promise<Graph | undefined> {
        this.loadingGraphs = true
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
        let updatedGraph: Graph | undefined;
        try {
            const { id } = userStore.user!;
            updatedGraph = await GraphService.update({ ...graph, userId: id });
            runInAction(() => {
                const index = this.graphs.findIndex(x => x.id === graph.id);
<<<<<<< HEAD
                if (index >= 0) {
                    this.graphs[index] = updatedGraph!;
                }
            });
        } catch (e) {
=======
                if(index >= 0) {
                    this.graphs[index] = updatedGraph!;
                }
            })
        } catch(e) {
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
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
<<<<<<< HEAD
=======

>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
        this.loadingGraphs = true;

        try {
            await GraphService.delete(graph.id);
            runInAction(() => {
                this.graphs = this.graphs.filter(x => x.id !== graph.id);
<<<<<<< HEAD
            });
        } catch (e) {
=======
            })
        } catch(e) {
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
<<<<<<< HEAD
            });
        }
    }

    @action
    async fetchGraphs(force: boolean = false) {
        if (!force && this.graphs && !this.graphs.empty()) {
            return;
        }

        this.loadingGraphs = true;

=======
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

>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
        try {
            const { id } = userStore.user!;
            const graphs = await GraphService.getAll(id);
            runInAction(() => {
                this.graphs = graphs as Array<Graph>;
            });
<<<<<<< HEAD
        } catch (e) {
=======
        } catch(e) {
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
<<<<<<< HEAD
            });
=======
            })
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
        }
    }

    getGraphById(graphId: string) {
<<<<<<< HEAD
        if (!graphId) return undefined;

=======
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
        return this.graphs.find(x => x.id === graphId);
    }

    @action dispose() {
        this.graphs = [];
    }
<<<<<<< HEAD
=======
    
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
}

export default new GraphStore();

<<<<<<< HEAD
export { GraphStore };
=======
export { GraphStore }
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
