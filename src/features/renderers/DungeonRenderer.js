import { makeLocationId, getCoordsFromId } from "../dungeon/RoomShape.js";
import Point from "../../utils/Point.js";

export default class DungeonRenderer {

    constructor({ dungeon, gridSize, padding, shift }) {
        this.dungeon = dungeon;
        this.gridSize = gridSize;
        this.padding = padding || 0.1;
        this.shift = new Point(
            dungeon.entrance.width() / 2,
            dungeon.entrance.height() / 2
        );
    }

    run(canvas, focus, dt) {
        this.dungeon.rooms.forEach(room => {
            const graph = room.shape.graph;
            graph.nodes.forEach(node => {
                const { id, element: roomData } = node;
                const { top, right, bottom, left } = room.shape.hasNeighbours(id);

                const topLocation = makeLocationId(roomData.position.x, roomData.position.y - 1);
                const rightLocation = makeLocationId(roomData.position.x + 1, roomData.position.y);
                const bottomLocation = makeLocationId(roomData.position.x, roomData.position.y + 1);
                const leftLocation = makeLocationId(roomData.position.x - 1, roomData.position.y);

                if(!top) {
                    canvas.drawHLine(
                        this.gridSize * ( roomData.position.x + this.padding - this.shift.x),
                        this.gridSize * ( roomData.position.x + 1 - this.padding - this.shift.x),
                        this.gridSize * ( roomData.position.y + this.padding - this.shift.y)
                    );
                } else {
                    if(!graph.hasNode(leftLocation)) {
                        canvas.drawVLine(
                            this.gridSize * ( roomData.position.x + this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y - this.padding - this.shift.y),
                            this.gridSize * ( roomData.position.y + this.padding - this.shift.y),
                        );
                    }

                    if(!graph.hasNode(rightLocation)) {
                        canvas.drawVLine(
                            this.gridSize * ( roomData.position.x + 1 - this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y - this.padding - this.shift.y),
                            this.gridSize * ( roomData.position.y + this.padding - this.shift.y),
                        );
                    }
                }

                if(!right) {
                    canvas.drawVLine(
                        this.gridSize * ( roomData.position.x + 1 - this.padding - this.shift.x),
                        this.gridSize * ( roomData.position.y + this.padding - this.shift.y),
                        this.gridSize * ( roomData.position.y + 1 - this.padding - this.shift.y)
                    );
                } else {
                    if(!graph.hasNode(topLocation)) {
                        canvas.drawHLine(
                            this.gridSize * ( roomData.position.x + 1 - this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.x + 1 + this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y + this.padding - this.shift.y),
                        );
                    }

                    if(!graph.hasNode(bottomLocation)) {
                        canvas.drawHLine(
                            this.gridSize * ( roomData.position.x + 1 - this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.x + 1 + this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y + 1 - this.padding - this.shift.y),
                        );
                    }
                }

                if(!bottom) {
                    canvas.drawHLine(
                        this.gridSize * ( roomData.position.x + this.padding - this.shift.x),
                        this.gridSize * ( roomData.position.x + 1 - this.padding - this.shift.x),
                        this.gridSize * ( roomData.position.y + 1 - this.padding - this.shift.y)
                    );
                } else {
                    if(!graph.hasNode(leftLocation)) {
                        canvas.drawVLine(
                            this.gridSize * ( roomData.position.x + this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y + 1 - this.padding - this.shift.y),
                            this.gridSize * ( roomData.position.y + 1 + this.padding - this.shift.y),
                        );
                    }

                    if(!graph.hasNode(rightLocation)) {
                        canvas.drawVLine(
                            this.gridSize * ( roomData.position.x + 1 - this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y + 1 - this.padding - this.shift.y),
                            this.gridSize * ( roomData.position.y + 1 + this.padding - this.shift.y),
                        );
                    }
                }

                if(!left) {
                    canvas.drawVLine(
                        this.gridSize * ( roomData.position.x + this.padding - this.shift.x),
                        this.gridSize * ( roomData.position.y + this.padding - this.shift.y),
                        this.gridSize * ( roomData.position.y + 1 - this.padding - this.shift.y)
                    );
                } else {
                    if(!graph.hasNode(topLocation)) {
                        canvas.drawHLine(
                            this.gridSize * ( roomData.position.x - this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.x + this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y + this.padding - this.shift.y),
                        );
                    }

                    if(!graph.hasNode(bottomLocation)) {
                        canvas.drawHLine(
                            this.gridSize * ( roomData.position.x - this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.x + this.padding - this.shift.x),
                            this.gridSize * ( roomData.position.y + 1 - this.padding - this.shift.y),
                        );
                    }
                }
            });
        });
    }
}
