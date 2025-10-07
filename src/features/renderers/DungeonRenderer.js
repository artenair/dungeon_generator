import Point from "../../utils/Point.js";
import { calculateGridSize } from "../dungeon/Dungeon.js";
import { makeLocationId, getCoordsFromId } from "../dungeon/RoomShape.js";

export default class DungeonRenderer {

    constructor({ dungeon, padding }) {
        this.dungeon = dungeon;
        this.padding = padding || 0.1;
        this.shift = new Point( 0, 0 );
    }

    run(canvas, focus, dt) {
        const gridSize = calculateGridSize(this.dungeon, canvas);

        this.dungeon.rooms.forEach(room => {
            const shape = room.shape.shape;
            shape.forEach((row, y) => {
                row.forEach((isFilled, x) => {
                    if(!isFilled) return;
                    const id = makeLocationId(x, y);
                    const position = new Point(x, y);
                    const shape = room.shape;
                    const hasInnerCorners = (position) => {
                        return !(shape.isContained(position.x, position.y) && shape.shape[position.y][position.x]);
                    }
                    const { top, right, bottom, left } = room.shape.hasNeighbours(id);

                    const topLocation = new Point(position.x, position.y - 1);
                    const rightLocation = new Point(position.x + 1, position.y);
                    const bottomLocation = new Point(position.x, position.y + 1);
                    const leftLocation = new Point(position.x - 1, position.y);

                    if(!top) {
                        canvas.drawHLine(
                            gridSize * ( room.center.x + position.x + this.padding - this.shift.x),
                            gridSize * ( room.center.x + position.x + 1 - this.padding - this.shift.x),
                            gridSize * ( room.center.y + position.y + this.padding - this.shift.y)
                        );
                    } else {
                        if(hasInnerCorners(leftLocation)) {
                            canvas.drawVLine(
                                gridSize * ( room.center.x + position.x + this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y - this.padding - this.shift.y),
                                gridSize * ( room.center.y + position.y + this.padding - this.shift.y),
                            );
                        }
                        
                        if(hasInnerCorners(rightLocation)) {
                            canvas.drawVLine(
                                gridSize * ( room.center.x + position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y - this.padding - this.shift.y),
                                gridSize * ( room.center.y + position.y + this.padding - this.shift.y),
                            );
                        }
                    }

                    if(!right) {
                        canvas.drawVLine(
                            gridSize * ( room.center.x + position.x + 1 - this.padding - this.shift.x),
                            gridSize * ( room.center.y + position.y + this.padding - this.shift.y),
                            gridSize * ( room.center.y + position.y + 1 - this.padding - this.shift.y)
                        );
                    } else {
                        if(hasInnerCorners(topLocation)) {
                            canvas.drawHLine(
                                gridSize * ( room.center.x + position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( room.center.x + position.x + 1 + this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y + this.padding - this.shift.y),
                            );
                        }

                        if(hasInnerCorners(bottomLocation)) {
                            canvas.drawHLine(
                                gridSize * ( room.center.x + position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( room.center.x + position.x + 1 + this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y + 1 - this.padding - this.shift.y),
                            );
                        }
                    }

                    if(!bottom) {
                        canvas.drawHLine(
                            gridSize * ( room.center.x + position.x + this.padding - this.shift.x),
                            gridSize * ( room.center.x + position.x + 1 - this.padding - this.shift.x),
                            gridSize * ( room.center.y + position.y + 1 - this.padding - this.shift.y)
                        );
                    } else {
                        if(hasInnerCorners(leftLocation)) {
                            canvas.drawVLine(
                                gridSize * ( room.center.x + position.x + this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y + 1 - this.padding - this.shift.y),
                                gridSize * ( room.center.y + position.y + 1 + this.padding - this.shift.y),
                            );
                        }

                        if(hasInnerCorners(rightLocation)) {
                            canvas.drawVLine(
                                gridSize * ( room.center.x + position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y + 1 - this.padding - this.shift.y),
                                gridSize * ( room.center.y + position.y + 1 + this.padding - this.shift.y),
                            );
                        }
                    }

                    if(!left) {
                        canvas.drawVLine(
                            gridSize * ( room.center.x + position.x + this.padding - this.shift.x),
                            gridSize * ( room.center.y + position.y + this.padding - this.shift.y),
                            gridSize * ( room.center.y + position.y + 1 - this.padding - this.shift.y)
                        );
                    } else {
                        if(hasInnerCorners(topLocation)) {
                            canvas.drawHLine(
                                gridSize * ( room.center.x + position.x - this.padding - this.shift.x),
                                gridSize * ( room.center.x + position.x + this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y + this.padding - this.shift.y),
                            );
                        }

                        if(hasInnerCorners(bottomLocation)) {
                            canvas.drawHLine(
                                gridSize * ( room.center.x + position.x - this.padding - this.shift.x),
                                gridSize * ( room.center.x + position.x + this.padding - this.shift.x),
                                gridSize * ( room.center.y + position.y + 1 - this.padding - this.shift.y),
                            );
                        }
                    }
                });
            });
        });
    }
}
