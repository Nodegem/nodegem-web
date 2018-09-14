import { BaseService } from "../../../services/base-service";
import { NodeDefinition } from "../utils/data-transform/node-definition";

class GraphService extends BaseService {

    public getNodeDefinitions = async () : Promise<Array<NodeDefinition>> => {
        const response = await this.get<Array<NodeDefinition>>("nodes");
        return response.data;
    }

}

export const graphService = new GraphService();