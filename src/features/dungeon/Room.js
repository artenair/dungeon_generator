import { v4 as uuidv4 } from "uuid";
import RoomShape from "./RoomShape.js";
import Point from "../../utils/Point.js";
import RoomShapeFactory from "./RoomShapeFactory.js";

export default class Room {

    constructor({center = undefined, shape = undefined, id = undefined } = {}) {
        this.id = id || uuidv4();
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
                boundingBox.minY = Math.min(boundingBox.minY, this.center.y + y)
                boundingBox.maxY = Math.max(boundingBox.maxY, this.center.y + y)
            })
        });

        return boundingBox;
    }
}
