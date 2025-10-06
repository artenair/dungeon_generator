import { v4 as uuidv4 } from "uuid";

export default class Node {
    constructor(element, id) {
        this.id = id || uuidv4();
        this.element = element;
    }
}
