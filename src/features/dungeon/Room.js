import Point from "../../utils/Point.js";
import RoomShape from "./RoomShape.js";
import RoomShapeFactory from "./RoomShapeFactory.js";

export default class Room {

    constructor({center = undefined, shape = undefined } = {}) {
        this.center = center || new Point(0, 0);
        shape = shape || RoomShapeFactory.getRandomShape();
        this.shape = new RoomShape(shape, this.center);
    }

    setCenter(center) {
        this.center = center;
        this.shape.setOrigin(center);
    }

    width() {
        return this.shape.width();
    }

    height() {
        return this.shape.height();
    }

    boundingBox() {
        const boundingBox = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
        };

        this.shape.shape.forEach((row, y) => {
            row.forEach((isOccupied, x) => {
                if(!isOccupied) return;
                boundingBox.minX = Math.min(boundingBox.minX, this.center.x + x)
                boundingBox.maxX = Math.max(boundingBox.maxX, this.center.x + x)
                boundingBox.minY = Math.min(boundingBox.minY, this.center.y + x)
                boundingBox.maxY = Math.max(boundingBox.maxY, this.center.y + x)
            })
        });

        return boundingBox;
    }
}
