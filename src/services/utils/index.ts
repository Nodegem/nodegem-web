import { requests } from "../agent";

const UtilService = {
    getAllNodeDefinitions: () : Promise<Array<NodeDefinition>> =>
        requests.get("/utils/nodes/all")
}

export { UtilService };