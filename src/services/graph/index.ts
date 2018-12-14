import { requests } from "../agent";

const GraphService = {
    getAll: (userId: string) : Promise<Array<Graph>> => 
        requests.get(`/graph/all/${userId}`),
    delete: (id: string) : Promise<void> => 
        requests.del(`/graph/${id}`),
    get: (id: string) : Promise<Graph> => 
        requests.get(`/graph/${id}`),
    create: (graphData: CreateGraph) : Promise<Graph> =>
        requests.post('/graph/create', graphData),
    update: (graph: Graph) : Promise<Graph> =>
        requests.put(`/graph/update/${graph.id}`, graph)

}

export { GraphService }