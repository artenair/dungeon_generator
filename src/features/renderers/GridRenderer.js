import Point from "../../utils/Point.js";
import { calculateGridSize } from "../dungeon/Dungeon.js";

export default class Gridrenderer {

    constructor({ dungeon }) {
        this.dungeon = dungeon;
    }

    run(canvas, focus, dt) {
        const gridSize = calculateGridSize(this.dungeon, canvas);

        const radius = Math.max(Math.min(parseInt(gridSize / 2), 10), 4);
        canvas.drawPoint(0, 0, radius, "rgba(0, 0, 0, 0.75)");

        const halfWidth = Math.ceil(canvas.width / 2);
        const halfHeight = Math.ceil(canvas.height / 2);

        const gridOpacity = 0.125;
        for(let dy = 0; dy * gridSize < halfWidth; dy++) {
            const color = dy === 0 ? "rgba(0, 0, 0, 0.5)" : `rgba(0, 0, 0, ${gridOpacity})`;
            canvas.drawVLine(
                focus.x + (dy * gridSize), 
                focus.y - halfHeight, 
                focus.y + halfHeight, 
                1,
                color
            );

            if(dy === 0) continue; 
            canvas.drawVLine(
                focus.x - (dy * gridSize), 
                focus.y - halfHeight, 
                focus.y + halfHeight, 
                1, 
                color 
            );
        }

        for(let dx = 0; dx * gridSize < halfHeight; dx++) {
            const color = dx === 0 ? "rgba(0, 0, 0, 0.5)" : `rgba(0, 0, 0, ${gridOpacity})`;
            canvas.drawHLine(
                focus.x - halfWidth, 
                focus.x + halfWidth, 
                focus.y + (dx * gridSize), 
                1,
                color
            );

            if(dx === 0) continue;
            canvas.drawHLine(
                focus.x - halfWidth, 
                focus.x + halfWidth, 
                focus.y - (dx * gridSize), 
                1,
                color
            );
        }

        const centerOpacity = 2 * gridOpacity;
        const centerRadius = Math.ceil(radius / 4);
        for(let dx = 0; dx * gridSize < halfWidth; dx++) {
            for(let dy = 0; dy * gridSize < halfHeight; dy++) {
                if(dx === 0 && dy === 0) continue;
                const color = `rgba(0, 0, 0, ${centerOpacity})`;
                canvas.drawPoint(
                    focus.x + (dx * gridSize),
                    focus.y + (dy * gridSize),
                    centerRadius,
                    color
                );

                if(dx > 0) {
                    canvas.drawPoint(
                        focus.x - (gridSize * dx),
                        focus.y + (gridSize * dy),
                        centerRadius,
                        color
                    );
                }

                if(dy > 0) {
                    canvas.drawPoint(
                        focus.x + (gridSize * dx),
                        focus.y - (gridSize * dy),
                        centerRadius,
                        color
                    );
                }

                if(dx > 0 && dy > 0) {
                    canvas.drawPoint(
                        focus.x - (gridSize * dx),
                        focus.y - (gridSize * dy),
                        centerRadius,
                        color
                    );
                }
            }
        }
    }

}
