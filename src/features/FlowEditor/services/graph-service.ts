import { BaseService } from "../../../services/base-service";
import { NodeDefinition } from "../utils/data-transform/node-definition";

class GraphService extends BaseService {

    constructor() {
        super("node")
    }

    public getNodeDefinitions = () => {
        return this.get<Array<NodeDefinition>>("");
    }

}

export { GraphService };