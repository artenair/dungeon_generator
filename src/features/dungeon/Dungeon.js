import Room from "./Room.js";

export default class Dungeon {
    constructor() {
        this.entrance = new Room();
        this.rooms = [this.entrance];
    }
}
