import Canvas from "./Canvas.js";
import Point from "../utils/Point.js";
import GameLoop from "../features/GameLoop.js";
import Dungeon from "../features/dungeon/Dungeon.js";

export default class DungeonGenerator {

    constructor(container, width, height) {
        this.focus = new Point(0, 0);
        this.container = container;
        this.width = width || container.offsetWidth; 
        this.height = height || container.offsetHeight;
        this.canvas = Canvas.init(this.width, this.height);
        this.gameLoop = new GameLoop(this.canvas, this.focus);
        this.container.appendChild(this.canvas.canvas);
    }

    static init(container, width, height) {
        const instance = new DungeonGenerator(container, width, height);
        return instance;
    }

    generate() {
        this.dungeon = new Dungeon();
        return this;
    }

    windowedFullScreen() {
        const updateCanvasSize = () => {
            this.canvas.canvas.width = this.container.offsetWidth;
            this.canvas.canvas.height = this.container.offsetHeight;
            this.canvas.shift(
                this.focus.x + parseInt(this.canvas.canvas.width / 2),
                this.focus.y + parseInt(this.canvas.canvas.height / 2),
            )
        }
        window.addEventListener("resize", updateCanvasSize);
        updateCanvasSize();
        return this;
    }

    start(renderers) {
        renderers = Array.isArray(renderers) ? renderers : [];
        renderers.forEach((renderer) => {
            if(!renderer.hasOwnProperty("renderer")) {
                this.gameLoop.addRenderer(new renderer)
            } else {
                const { renderer: rendererClass, params } = renderer;
                this.gameLoop.addRenderer(new rendererClass(params));
            }
        });
        this.gameLoop.start();
        return this;
    }
}
