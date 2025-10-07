export default class RandomBag {

    constructor(elements) {
        this.originalElements = elements;
        this.elements = [];
        this.reset();
    }

    reset() {
        this.elements = this.originalElements.map((element) => element);
    }

    empty() {
        return this.elements.length === 0;
    }

    put (item) {
        this.elements.push(item);
    }

    pull() {
        const index = Math.floor(Math.random() * this.elements.length);
        const removed = this.elements.splice(index, 1);
        return removed[0];
    }
}
