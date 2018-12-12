interface Graph {
    id: string,
    name: string,
    isActive: boolean,
    description: string,
    createdOn: Date,
    lastUpdated: Date
}

interface CreateGraph {
    name: string,
    description: string
}