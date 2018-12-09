import { requests } from "../agent";

const Utils = {
    getAllNodeDefinitions: () : Promise<Array<NodeDefinition>> =>
        requests.get("/utils/nodes/all")
}

export { Utils };