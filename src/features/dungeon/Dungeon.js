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
        canvas.width / (dungeon.getWidth() + 4),
        canvas.height / (dungeon.getHeight() + 4),
    ));
}

export default class Dungeon {
    constructor({ size = 12 } = {}) {
        this.rooms = [];
        this.size = size;
        this.occupiedSpaces = {};
        this.width = undefined;
        this.height = undefined;
        this.fringe = new RandomBag([new Point(0, 0)]);

        const entrance = new Room({
            shape: RoomShapeFactory.rotate(
                RoomShapeFactory.getSingleRoom(),
                0
            ),
        });

        this.entrance = entrance;
        this.addRoom(entrance);

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

        this.normalize()
    }

    normalize() {
        const boundingBox = this.boundingBox();
        const dx = Math.floor((boundingBox.minX + boundingBox.maxX) / 2);
        const dy = Math.floor((boundingBox.minY + boundingBox.maxY) / 2);
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
        this.rooms.forEach((room) => {
            room.shape.shape.forEach((row, y) => {
                row.forEach((isOccupied, x) => {
                    if(!isOccupied) return;
                    const id = makeLocationId(room.center.x + x, room.center.y + y);
                    this.occupiedSpaces[id] = true;
                });
            })            
        });
    }

    updateFringe() {
        const fringe = [];
        const lookup = {};

        Object.keys(this.occupiedSpaces).map(getCoordsFromId).forEach((space) => {
            const neighbours = [NEIGHBOUR_TOP, NEIGHBOUR_RIGHT, NEIGHBOUR_BOTTOM, NEIGHBOUR_LEFT].map(
                (direction) => getNeighbour(space.x, space.y, direction)
            );

            neighbours.forEach(
                (neighbour) => {
                    const id = makeLocationId(neighbour.x, neighbour.y);
                    if(this.occupiedSpaces.hasOwnProperty(id)) return;
                    if(lookup.hasOwnProperty(id)) return;
                    lookup[id] = true;
                    fringe.push(neighbour);
                }
            );
        });

        this.fringe = new RandomBag(fringe);
    }
}
