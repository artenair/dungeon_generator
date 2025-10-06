import Room from "./Room.js";
import Point from "../../utils/Point.js";
import RoomShapeFactory from "./RoomShapeFactory.js";
import { makeLocationId, getCoordsFromId } from "./RoomShape.js";
import { getNeighbour, NEIGHBOUR_TOP, NEIGHBOUR_RIGHT, NEIGHBOUR_BOTTOM, NEIGHBOUR_LEFT } from "./RoomShape.js";

export default class Dungeon {
    constructor({ size = 2 } = {}) {
        this.rooms = [];
        this.fringe = [new Point(0, 0)];
        this.size = size;
        this.occupiedSpaces = {};

        const entrance = new Room({
            shape: RoomShapeFactory.rotate(
                RoomShapeFactory.getRandomShape(),
                0
            ),
        });

        this.entrance = entrance;
        this.addRoom(entrance);

        while(this.rooms.length < this.size) {
            this.addRoom(new Room({
                shape: RoomShapeFactory.rotate(
                    RoomShapeFactory.getLRoom(),
                    2
                )
            }));
        }
    }

    addRoom(room) {
        const center = this.getFromFringe();
        room.setCenter(center);

        const isShapePlaceable = (shape) => {
            let isAllowed = true;
            shape.forEach((row, y) => {
                row.forEach((isOccupied, x) => {
                    if(!isOccupied) return;
                    const id = makeLocationId(x, y);
                    isAllowed = isAllowed && this.occupiedSpaces.hasOwnProperty(id);
                })
            });
            return isAllowed || this.rooms.length === 0;
        };

        const isShapeNeighbouring = (shape) => {
            let isNeighbouring = false;
            shape.forEach((row, y) => {
                row.forEach((isOccupied, x) => {
                    if(!isOccupied) return;
                    const neighbours = [NEIGHBOUR_TOP, NEIGHBOUR_RIGHT, NEIGHBOUR_BOTTOM, NEIGHBOUR_LEFT].map(
                        (direction) => getNeighbour(x, y, direction)
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
            return isNeighbouring || this.rooms.length === 0;
        };

        let isPlaceable = true;
        let iterations = 0;
        while(!isPlaceable && iterations++ < 4) {
            if(iterations > 0) {
                room.shape.shape = RoomShapeFactory.rotate(room.shape.shape, 1);
            }
            isPlaceable = isShapePlaceable(room.shape.shape) && isShapeNeighbouring(room.shape.shape);
        }

        if(!isPlaceable) {
            console.log("I am not placeable!");
            this.fringe.push(center);
            return false;
        }

        this.rooms.push(room);
        this.updateOccupiedSpaces();
        this.updateFringe();
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
        this.fringe = [new Point(0, 1)];
        return;
        Object.keys(this.occupiedSpaces).map(getCoordsFromId).forEach((space) => {
            const neighbours = [NEIGHBOUR_TOP, NEIGHBOUR_RIGHT, NEIGHBOUR_BOTTOM, NEIGHBOUR_LEFT].map(
                (direction) => getNeighbour(space.x, space.y, direction)
            );

            neighbours.forEach(
                (neighbour) => {
                    const id = makeLocationId(neighbour.x, neighbour.y);
                    if(this.occupiedSpaces.hasOwnProperty(id)) return;
                    this.fringe.push(neighbour);
                }
            );
        });
    }

    getFromFringe() {
        const randomFringeIndex = Math.floor(Math.random() * this.fringe.length);
        const removed = this.fringe.splice(randomFringeIndex);
        return removed[0];
    }
}
