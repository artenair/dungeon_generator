import Point from "../../utils/Point.js";
import RoomShape from "./RoomShape.js";
import RoomShapeFactory from "./RoomShapeFactory.js";

export default class Room {

    constructor(center, shape) {
        this.center = center || new Point(0, 0);
        shape = shape || RoomShapeFactory.getRandomShape();
        this.shape = new RoomShape(shape, this.center);
    }

    width() {
        return this.shape.width();
    }

    height() {
        return this.shape.height();
    }
}
