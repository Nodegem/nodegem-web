import { BaseService } from "../../../services/base-service";
import { NodeDefinition } from "./data-transform/node-definition";
import { GraphData } from "./data-transform/data-transform";

class GraphService extends BaseService {

    public getNodeDefinitions = async () : Promise<Array<NodeDefinition>> => {
        const response = await this.get<Array<NodeDefinition>>("node");
        return response.data;
    }

    public runGraph = async (data: GraphData) : Promise<any> => {
        const response = await this.post("node", data);
        return response.data;
    }

}

export const graphService = new GraphService();