import { observable } from "mobx";

class GraphStore {

    @observable
    graphs: Array<Graph> = [];

}

export default new GraphStore();