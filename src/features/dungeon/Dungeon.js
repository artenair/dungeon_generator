import Room from "./Room.js";
import Point from "../../utils/Point.js";
import RandomBag from "../../utils/RandomBag.js";
import RoomShapeFactory from "./RoomShapeFactory.js";
import { makeLocationId, getCoordsFromId } from "./RoomShape.js";
import { getNeighbour, NEIGHBOUR_TOP, NEIGHBOUR_RIGHT, NEIGHBOUR_BOTTOM, NEIGHBOUR_LEFT } from "./RoomShape.js";

export const calculateGridSize = (dungeon, canvas) => {
    const width = canvas.width; 
    const height = canvas.height;

    return Math.floor(Math.min(
        canvas.width / (dungeon.getWidth() + 2),
        canvas.height / (dungeon.getHeight() + 2),
    ));
}

export default class Dungeon {
    constructor({ size = 12 } = {}) {
        this.rooms = [];
        this.size = size;
        this.occupiedSpaces = {};
        this.locationToRoomLookup = {};
        this.allRoomPassages = {};
        this.width = undefined;
        this.height = undefined;
        this.fringe = new RandomBag([new Point(0, 0)]);

        const shapes = [];
        for(let i = 0; i < 4; i++) {
            for(let shape of RoomShapeFactory.getAllRooms()) {
                const clone = shape.map((row) => row.map((value) =>  value));
                const rotatedShape = RoomShapeFactory.rotate(clone, i);
                shapes.push(rotatedShape);
            }
        }
        const shapeBag = new RandomBag(shapes);

        while(this.rooms.length < this.size) {
            const shape = shapeBag.pull();
            const added = this.addRoom(new Room({ shape }));
            if(!added) continue;
            shapeBag.reset();
        }

        this.normalize();
        this.updateOccupiedSpaces();
        this.makeLocationToRoomMap();
        this.makeRoomPassageCandidates();
    }

    getPassages() {
        const arcs = {};
        for(let passages of Object.values(this.allRoomPassages)) {
            passages.forEach(({from, to}) => {
                arcs[`${makeLocationId(from.x, from.y)}_${makeLocationId(to.x, to.y)}`] = true;
            });
        }
        return arcs;
    }

    makeRoomPassageCandidates() {
        Object.keys(this.locationToRoomLookup)
            .map((id) => ({id, position: getCoordsFromId(id)}))
            .filter(({ id }) => this.locationToRoomLookup.hasOwnProperty(id))
            .forEach(({id, position }) => {
                const currentRoom = this.locationToRoomLookup[id];
                this.getNeighboursFor(position)
                    .filter(({ id }) => this.locationToRoomLookup.hasOwnProperty(id))
                    .forEach(({ id: neighbourId, neighbour }) => {
                        const neighbourRoom = this.locationToRoomLookup[neighbourId];
                        this.addPassage(currentRoom, neighbourRoom, position, neighbour )
                    })
            })
    }

    addPassage(currentRoom, neighbourRoom, currentPosition, neighbourPosition) {
        if(currentRoom.id === neighbourRoom.id) return;

        if(!this.allRoomPassages.hasOwnProperty(currentRoom.id)) {
            this.allRoomPassages[currentRoom.id] = [];
        }

        this.allRoomPassages[currentRoom.id].push({
            from: currentPosition,
            to: neighbourPosition,
            destination: neighbourRoom
        });
    }

    makeLocationToRoomMap() {
        this.rooms.forEach((room) => {
            room.shape.shape.forEach((row, y) => {
                row.forEach((isOccupied, x) => {
                    if(!isOccupied) return;
                    const id = makeLocationId(room.center.x + x, room.center.y + y);
                    this.locationToRoomLookup[id] = room;
                })
            })
        });
    }

    normalize() {
        const boundingBox = this.boundingBox();
        const dx = Math.min(boundingBox.minX, 0) + Math.floor(this.getWidth() / 2);
        const dy = Math.min(boundingBox.minY, 0) + Math.floor(this.getHeight() / 2);
        this.rooms.forEach((room) => {
            room.center.x -= dx;
            room.center.y -= dy;
        })
    }

    getWidth() {
        if(!this.width) {
            const boundingBox = this.boundingBox();
            this.width = boundingBox.maxX - boundingBox.minX + 1;
        }
        return this.width;
    }

    getHeight() {
        if(!this.height) {
            const boundingBox = this.boundingBox();
            this.height = boundingBox.maxY - boundingBox.minY + 1;
        }
        return this.height;
    }

    boundingBox() {
        const boundingBox = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
        };

        this.rooms.forEach((room) => {
            const roomBoundingBox = room.boundingBox();
            boundingBox.minX = Math.min(boundingBox.minX, roomBoundingBox.minX);
            boundingBox.minY = Math.min(boundingBox.minY, roomBoundingBox.minY);
            boundingBox.maxX = Math.max(boundingBox.maxX, roomBoundingBox.maxX);
            boundingBox.maxY = Math.max(boundingBox.maxY, roomBoundingBox.maxY);
        });

        return boundingBox;
    }

    addRoom(room) {
        const center = this.fringe.pull();
        if(!center) {
            this.updateFringe();
            return false;
        }
        room.setCenter(center);

        const isShapePlaceable = (shape) => {
            if(this.rooms.length === 0) return true;
            let isAllowed = true;
            shape.forEach((row, y) => {
                row.forEach((isOccupied, x) => {
                    if(!isOccupied) return;
                    const id = makeLocationId(center.x + x, center.y + y);
                    isAllowed = isAllowed && !this.occupiedSpaces.hasOwnProperty(id);
                })
            });
            return isAllowed;
        };

        const isShapeNeighbouring = (shape) => {
            if(this.rooms.length === 0) return true;
            let isNeighbouring = false;
            shape.forEach((row, y) => {
                row.forEach((isOccupied, x) => {
                    if(!isOccupied) return;
                    if(isNeighbouring) return;

                    const neighbours = [NEIGHBOUR_TOP, NEIGHBOUR_RIGHT, NEIGHBOUR_BOTTOM, NEIGHBOUR_LEFT].map(
                        (direction) => getNeighbour(center.x + x, center.y + y, direction)
                    );

                    isNeighbouring = isNeighbouring || neighbours.reduce(
                        (isNeighbouring, neighbour) => {
                            const id = makeLocationId(neighbour.x, neighbour.y);
                            return isNeighbouring || this.occupiedSpaces.hasOwnProperty(id)
                        },
                        false
                    );
                })
            });
            return isNeighbouring;
        };

        let isPlaceable = isShapePlaceable(room.shape.shape) && isShapeNeighbouring(room.shape.shape);
        if(!isPlaceable) return false;

        this.rooms.push(room);
        this.updateOccupiedSpaces();
        this.updateFringe();
        return true;
    }

    updateOccupiedSpaces() {
        this.occupiedSpaces = this.rooms.reduce((occupiedSpaces, room) => {
            room.shape.shape.forEach((row, y) => {
                row.forEach((isOccupied, x) => {
                    if(!isOccupied) return occupiedSpaces;
                    const id = makeLocationId(room.center.x + x, room.center.y + y);
                    occupiedSpaces[id] = true;
                });
            });
            return occupiedSpaces;
        }, {});
    }

    updateFringe() {
        const fringe = [];
        const lookup = {};

        Object.keys(this.occupiedSpaces).map(getCoordsFromId).forEach((position) => {
            this.getNeighboursFor(position)
                .filter(({neighbour, id}) => !this.occupiedSpaces.hasOwnProperty(id) && !lookup.hasOwnProperty(id))
                .forEach(({neighbour, id}) => {
                    lookup[id] = true;
                    fringe.push(neighbour);
                });
        });

        this.fringe = new RandomBag(fringe);
    }

    getNeighboursFor(position) {
        return [NEIGHBOUR_TOP, NEIGHBOUR_RIGHT, NEIGHBOUR_BOTTOM, NEIGHBOUR_LEFT].map(
            (direction) => {
                const neighbour = getNeighbour(position.x, position.y, direction)
                const id = makeLocationId(neighbour.x, neighbour.y)
                return { id, neighbour };
            }
        );
    }
}
