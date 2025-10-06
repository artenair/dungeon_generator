import { v4 as uuidv4 } from "uuid";
import Graph from "../../utils/Graph.js";
import Point from "../../utils/Point.js";

export const makeLocationId = (x, y) => `${x}_${y}`;
export const getCoordsFromId = (id) => {
    const { 0: x, 1: y } = id.split("_").map((x) => parseInt(x));
    return new Point(x, y);
};

export default class RoomShape {

    constructor(shape, origin, id) {
        this.id = id || uuidv4();
        this.shape = shape;
        this.origin = origin;
        this.graph = this.makeRoomGraph();
    }

    makeRoomGraph() {
        const graph = new Graph;

        let minY = Infinity, minX = Infinity;
        for(let y = 0; y < this.shape.length; y++ ){
            for(let x = 0; x < this.shape[y].length; x++ ) {
                if(this.shape[y][x] === 0) continue;
                minY = Math.min(minY, y);
                minX = Math.min(minX, x);
            }
        }

        for(let y = 0; y < this.shape.length; y++) {
            for(let x = 0; x < this.shape[y].length; x++) {
                if(!this.shape[y][x]) continue;

                const currentNode = makeLocationId(x - minX, y - minY);
                graph.addNode(
                    { 
                        roomId: this.id, 
                        position: new Point(
                            this.origin.x + x - minX,
                            this.origin.y + y - minY,
                        )
                    }, 
                    currentNode
                );

                const leftNode = makeLocationId(x - minX - 1, y - minY);
                if(graph.hasNode(leftNode)) {
                    graph.addEdge(currentNode, leftNode);
                }

                const upNode = makeLocationId(x - minX, y - minY - 1);
                if(graph.hasNode(upNode)) {
                    graph.addEdge(currentNode, upNode);
                }
            }
        }

        return graph;
    }

    hasNeighbours(id) {
        const { x, y } = getCoordsFromId(id);
        return {
            top: this.graph.hasEdge(id, makeLocationId(x, y - 1)),
            right: this.graph.hasEdge(id, makeLocationId(x + 1, y)),
            bottom: this.graph.hasEdge(id, makeLocationId(x, y + 1)),
            left: this.graph.hasEdge(id, makeLocationId(x - 1, y)),
        }
    }

    width() {
        let minX = Infinity;
        let maxX = 0;
        for(let y = 0; y < this.shape.length; y++) {
            for(let x = 0; x < this.shape[y].length; x++) {
                if(this.shape[y][x] === 0) continue;
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            } 
        } 

        return maxX - minX + 1;
    }

    height() {
        let minY = Infinity;
        let maxY = 0;
        for(let y = 0; y < this.shape.length; y++) {
            const hasElements = this.shape[y].reduce(
                (hasElements, element) => hasElements || element !== 0,
                false
            )
            if(!hasElements) continue;
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        } 

        return maxY - minY + 1;
    }
}
