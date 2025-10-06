import Node from "./Node.js";

export default class Graph {

    constructor() {
        this.nodes = [];
        this.nodesLookup = {};
        this.edges = {};
    }

    addNode(value, id) {
        const node = new Node(value, id || null);
        this.nodes.push(node);
        this.nodesLookup[node.id] = node;
        return node;
    }

    hasNode(id) {
        return this.nodesLookup.hasOwnProperty(id);
    }

    addEdge(a, b) {
        if(!this.hasNode(a)) throw Error(`[addEdge] No node for id '${a}' found in graph.`)
        if(!this.hasNode(b)) throw Error(`[addEdge] No node for id '${b}' found in graph.`)
        this._addOneWayEdge(a, b);
        this._addOneWayEdge(b, a);
    }

    _addOneWayEdge(from, to) {
        if(!this.edges.hasOwnProperty(from)) {
            this.edges[from] = [];
        }

        if(this.edges[from].includes(to)) return;
        this.edges[from].push(to);
    }

    hasEdge(a, b) {
        return this.edges.hasOwnProperty(a) && this.edges[a].includes(b);
    }

}
