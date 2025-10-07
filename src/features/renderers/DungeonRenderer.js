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
        const passages = this.dungeon.getPassages();

        this.dungeon.rooms.forEach(room => {
            const isLocationOccupied = (shape, locationX, locationY, normalize = true) => {
                const normalized = new Point(
                    locationX - (normalize ? room.center.x : 0),
                    locationY - (normalize ? room.center.y : 0)
                );

                return  shape.isContained(normalized.x, normalized.y) 
                        && shape.shape[normalized.y][normalized.x]
            }

            room.shape.shape.forEach((row, y) => {
                row.forEach((isFilled, x) => {
                    if(!isFilled) return;
                    const id = makeLocationId(x, y);
                    const position = new Point(room.center.x + x, room.center.y + y);
                    const shape = room.shape;
                    const hasInnerCorners = (position) => {
                        return !(shape.isContained(position.x - room.center.x, position.y - room.center.y) && shape.shape[position.y - room.center.y][position.x - room.center.x]);
                    }
                    const { top, right, bottom, left } = room.shape.hasNeighbours(id);

                    const topLocation = new Point(position.x, position.y - 1);
                    const rightLocation = new Point(position.x + 1, position.y);
                    const bottomLocation = new Point(position.x, position.y + 1);
                    const leftLocation = new Point(position.x - 1, position.y);

                    const tl_x = position.x + this.padding;
                    const tl_y = position.y + this.padding;
                    const br_x = position.x + 1 - this.padding;
                    const br_y = position.y + 1 - this.padding;
                    const fillColor = 'rgba(0, 0, 0, 0.1)';

                    canvas.drawRectangle(
                        gridSize * (tl_x - this.shift.x),
                        gridSize * (tl_y - this.shift.y),
                        gridSize * (br_x - this.shift.x),
                        gridSize * (br_y - this.shift.y),
                        fillColor
                    );

                    if(!top) {
                        const currentId = makeLocationId(position.x, position.y);
                        const neighbourId = makeLocationId(topLocation.x, topLocation.y);
                        const passageId = `${currentId}_${neighbourId}`;

                        if(!passages.hasOwnProperty(passageId)) {
                            canvas.drawHLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y)
                            );
                        } else {
                            canvas.drawRectangle(
                                gridSize * ( position.x + (1/3) - this.shift.x ),
                                gridSize * ( position.y - this.shift.x ),
                                gridSize * ( position.x + (2/3) - this.shift.x ),
                                gridSize * ( position.y + this.padding - this.shift.x ),
                                 fillColor
                            )
                            canvas.drawHLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.x + (1/3) - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y)
                            );
                            canvas.drawVLine(
                                gridSize * ( position.x + (1/3) - this.shift.x),
                                gridSize * ( position.y - this.shift.y),
                                gridSize * ( position.y + this.padding - this.shift.y),
                            );
                            canvas.drawVLine(
                                gridSize * ( position.x + (2/3) - this.shift.x),
                                gridSize * ( position.y - this.shift.y),
                                gridSize * ( position.y + this.padding - this.shift.y),
                            );
                            canvas.drawHLine(
                                gridSize * ( position.x + (2/3) - this.shift.x),
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y)
                            );
                        }
                    } else {
                        canvas.drawRectangle(
                            gridSize * (position.x + this.padding - this.shift.x),
                            gridSize * (position.y - this.shift.y),
                            gridSize * (position.x + 1 - this.padding - this.shift.x),
                            gridSize * (position.y + this.padding - this.shift.y),
                            fillColor
                        )

                        if(
                            isLocationOccupied(shape, leftLocation.x, leftLocation.y - 1) &&
                            isLocationOccupied(shape, leftLocation.x, leftLocation.y)
                        ) {
                            canvas.drawRectangle(
                                gridSize * (position.x - this.shift.x),
                                gridSize * (position.y - this.shift.x),
                                gridSize * (position.x + this.padding - this.shift.x),
                                gridSize * (position.y + this.padding - this.shift.x),
                                 fillColor
                            )
                        }

                        if(
                            isLocationOccupied(shape, rightLocation.x, rightLocation.y - 1) &&
                            isLocationOccupied(shape, rightLocation.x, rightLocation.y)
                        ) {
                            canvas.drawRectangle(
                                gridSize * (position.x + 1 - this.padding - this.shift.x),
                                gridSize * (position.y - this.shift.x),
                                gridSize * (position.x + 1 - this.shift.x),
                                gridSize * (position.y + this.padding - this.shift.x),
                                 fillColor
                            )
                        }

                        if(hasInnerCorners(leftLocation)) {
                            canvas.drawVLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.y - this.padding - this.shift.y),
                                gridSize * ( position.y + this.padding - this.shift.y),
                            );
                        }
                        
                        if(hasInnerCorners(rightLocation)) {
                            canvas.drawVLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y - this.padding - this.shift.y),
                                gridSize * ( position.y + this.padding - this.shift.y),
                            );
                        }
                    }

                    if(!right) {
                        const currentId = makeLocationId(position.x, position.y);
                        const neighbourId = makeLocationId(rightLocation.x, rightLocation.y);
                        const passageId = `${currentId}_${neighbourId}`;

                        if(!passages.hasOwnProperty(passageId)) {
                            canvas.drawVLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y)
                            );
                        } else {
                            canvas.drawRectangle(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x ),
                                gridSize * ( position.y + (1/3) - this.shift.y ),
                                gridSize * ( position.x + 1 - this.shift.x ),
                                gridSize * ( position.y + (2/3) - this.shift.y ),
                                 fillColor
                            )
                            canvas.drawVLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y),
                                gridSize * ( position.y + (1/3) - this.shift.y)
                            );
                            canvas.drawHLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.x + 1 - this.shift.x),
                                gridSize * ( position.y + (1/3) - this.shift.y)
                            );
                            canvas.drawHLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.x + 1 - this.shift.x),
                                gridSize * ( position.y + (2/3) - this.shift.y)
                            );
                            canvas.drawVLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + (2/3) - this.shift.y),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y)
                            );
                        }
                    } else {
                        canvas.drawRectangle(
                            gridSize * (position.x + 1 - this.padding - this.shift.x),
                            gridSize * (position.y + this.padding - this.shift.x),
                            gridSize * (position.x + 1 - this.shift.x),
                            gridSize * (position.y + 1 - this.padding - this.shift.x),
                            fillColor
                        )

                        if(hasInnerCorners(topLocation)) {
                            canvas.drawHLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.x + 1 + this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y),
                            );
                        }

                        if(hasInnerCorners(bottomLocation)) {
                            canvas.drawHLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.x + 1 + this.padding - this.shift.x),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y),
                            );
                        }
                    }

                    if(!bottom) {
                        const currentId = makeLocationId(position.x, position.y);
                        const neighbourId = makeLocationId(bottomLocation.x, bottomLocation.y);
                        const passageId = `${currentId}_${neighbourId}`;

                        if(!passages.hasOwnProperty(passageId)) {
                            canvas.drawHLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y)
                            );
                        } else {
                            canvas.drawRectangle(
                                gridSize * ( position.x + (1/3) - this.shift.x ),
                                gridSize * ( position.y + 1 - this.padding - this.shift.x ),
                                gridSize * ( position.x + (2/3) - this.shift.x ),
                                gridSize * ( position.y + 1 - this.shift.x ),
                                 fillColor
                            )
                            canvas.drawHLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.x + (1/3) - this.shift.x),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y)
                            );
                            canvas.drawVLine(
                                gridSize * ( position.x + (1/3) - this.shift.x),
                                gridSize * ( position.y + 1 - this.shift.y),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y),
                            );
                            canvas.drawVLine(
                                gridSize * ( position.x + (2/3) - this.shift.x),
                                gridSize * ( position.y + 1 - this.shift.y),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y),
                            );
                            canvas.drawHLine(
                                gridSize * ( position.x + (2/3) - this.shift.x),
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y)
                            );
                        }
                    } else {
                        canvas.drawRectangle(
                            gridSize * (position.x + this.padding - this.shift.x),
                            gridSize * (position.y + 1 - this.padding - this.shift.x),
                            gridSize * (position.x + 1 - this.padding - this.shift.x),
                            gridSize * (position.y + 1 - this.shift.x),
                            fillColor
                        )

                        if(
                            isLocationOccupied(shape, leftLocation.x, leftLocation.y + 1) &&
                            isLocationOccupied(shape, leftLocation.x, leftLocation.y)
                        ) {
                            canvas.drawRectangle(
                                gridSize * (position.x - this.shift.x),
                                gridSize * (position.y + 1 - this.padding - this.shift.x),
                                gridSize * (position.x + this.padding - this.shift.x),
                                gridSize * (position.y + 1 - this.shift.x),
                                 fillColor
                            )
                        }

                        if(
                            isLocationOccupied(shape, rightLocation.x, rightLocation.y + 1) &&
                            isLocationOccupied(shape, rightLocation.x, rightLocation.y)
                        ) {
                            canvas.drawRectangle(
                                gridSize * (position.x + 1 - this.padding - this.shift.x),
                                gridSize * (position.y + 1 - this.padding - this.shift.x),
                                gridSize * (position.x + 1 - this.shift.x),
                                gridSize * (position.y + 1 - this.shift.x),
                                 fillColor
                            )
                        }

                        if(hasInnerCorners(leftLocation)) {
                            canvas.drawVLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y),
                                gridSize * ( position.y + 1 + this.padding - this.shift.y),
                            );
                        }

                        if(hasInnerCorners(rightLocation)) {
                            canvas.drawVLine(
                                gridSize * ( position.x + 1 - this.padding - this.shift.x),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y),
                                gridSize * ( position.y + 1 + this.padding - this.shift.y),
                            );
                        }
                    }

                    if(!left) {
                        const currentId = makeLocationId(position.x, position.y);
                        const neighbourId = makeLocationId(leftLocation.x, leftLocation.y);
                        const passageId = `${currentId}_${neighbourId}`;
                        if(!passages.hasOwnProperty(passageId)) {
                            canvas.drawVLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y)
                            );
                        } else {
                            canvas.drawRectangle(
                                gridSize * ( position.x - this.shift.x ),
                                gridSize * ( position.y + (1/3) - this.shift.y ),
                                gridSize * ( position.x + this.padding - this.shift.x ),
                                gridSize * ( position.y + (2/3) - this.shift.y ),
                                 fillColor
                            )
                            canvas.drawVLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y),
                                gridSize * ( position.y + (1/3) - this.shift.y)
                            );
                            canvas.drawHLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.x - this.shift.x),
                                gridSize * ( position.y + (1/3) - this.shift.y)
                            );
                            canvas.drawHLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.x - this.shift.x),
                                gridSize * ( position.y + (2/3) - this.shift.y)
                            );
                            canvas.drawVLine(
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.y + (2/3) - this.shift.y),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y)
                            );
                        }

                    } else {
                        const hasBottomSquare = hasInnerCorners(bottomLocation);

                        canvas.drawRectangle(
                            gridSize * (position.x - this.shift.x),
                            gridSize * (position.y + this.padding - this.shift.x),
                            gridSize * (position.x + this.padding - this.shift.x),
                            gridSize * (position.y + 1 - this.padding - this.shift.x),
                            fillColor
                        )

                        if(hasInnerCorners(topLocation)) {
                            canvas.drawHLine(
                                gridSize * ( position.x - this.padding - this.shift.x),
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.y + this.padding - this.shift.y),
                            );
                        }

                        if(hasInnerCorners(bottomLocation)) {
                            canvas.drawHLine(
                                gridSize * ( position.x - this.padding - this.shift.x),
                                gridSize * ( position.x + this.padding - this.shift.x),
                                gridSize * ( position.y + 1 - this.padding - this.shift.y),
                            );
                        }
                    }
                });
            });
        });
    }
}
