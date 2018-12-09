interface Graph {
    id: string,
    name: string,
    description: string,
    createdOn: Date,
    lastUpdated: Date
}

interface CreateGraph {
    name: string,
    description: string
}