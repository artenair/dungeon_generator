export default class GameLoop {

    constructor(canvas, focus) {
        this.canvas = canvas;
        this.focus = focus;
        this.timestamp = null;
        this.renderers = [];
    }

    addRenderer(renderer) {
        this.renderers.push(renderer);
    }

    start() {
        if(this.timestamp) return;
        requestAnimationFrame((timestamp) => {
            this.timestamp = timestamp;
            this.renderers.forEach((renderer) => {
                renderer.run(this.canvas, this.focus, 0);
            });
            requestAnimationFrame(this.loop.bind(this))
        });
    }

    loop(timestamp) {
        const dt = timestamp - this.timestamp;
        this.renderers.forEach((renderer) => {
            renderer.run(this.canvas, this.focus, dt);
        });
        this.timestamp = timestamp;
        requestAnimationFrame(this.loop.bind(this))
    }
}
