import { observable, action } from "mobx";
import { Node } from "src/features/Editor/rete-engine/node";

class NodeMenuStore {

    @observable
    selectedNode?: Node;

    @action setSelectedNode(node: Node) {
        this.selectedNode = node;
    }

}

export default new NodeMenuStore();