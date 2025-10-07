import Point from "../../utils/Point.js";

export const makeLocationId = (x, y) => `${x}_${y}`;
export const getCoordsFromId = (id) => {
    const { 0: x, 1: y } = id.split("_").map((x) => parseInt(x));
    return new Point(x, y);
};

export const NEIGHBOUR_TOP = "top";
export const NEIGHBOUR_RIGHT = "right";
export const NEIGHBOUR_BOTTOM = "bottom";
export const NEIGHBOUR_LEFT = "left";

export const getNeighbour = (x, y, direction) => {
    const dx = [NEIGHBOUR_LEFT, NEIGHBOUR_RIGHT].includes(direction) ? (direction === NEIGHBOUR_LEFT ? -1 : 1) : 0;
    const dy = [NEIGHBOUR_TOP, NEIGHBOUR_BOTTOM].includes(direction) ? (direction === NEIGHBOUR_TOP ? -1 : 1) : 0;
    return new Point(x + dx, y + dy);
};

export default class RoomShape {

    constructor(shape, origin) {
        this.shape = shape;
        this.origin = origin;
    }

    hasNeighbours(id) {
        const { x, y } = getCoordsFromId(id);
        return {
            top: this.hasNeighbour(x, y, NEIGHBOUR_TOP),
            right: this.hasNeighbour(x, y, NEIGHBOUR_RIGHT),
            bottom: this.hasNeighbour(x, y, NEIGHBOUR_BOTTOM),
            left: this.hasNeighbour(x, y, NEIGHBOUR_LEFT),
        }
    }

    hasNeighbour(x, y, direction) {
        const dx = [NEIGHBOUR_LEFT, NEIGHBOUR_RIGHT].includes(direction) ? (direction === NEIGHBOUR_LEFT ? -1 : 1) : 0;
        const dy = [NEIGHBOUR_TOP, NEIGHBOUR_BOTTOM].includes(direction) ? (direction === NEIGHBOUR_TOP ? -1 : 1) : 0;
        if(!this.isContained(x, y)) return false;
        if(!this.isContained(x + dx, y + dy)) return false;
        return this.shape[y + dy][x + dx]; 
    }


    isContained(x, y) {
        if(y < 0 || y >= this.shape.length) return false;
        if(x < 0 || x >= this.shape[y].length) return false;
        return true;
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

    setOrigin(origin) {
        this.origin = origin;
    }
}
