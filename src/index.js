import "./main.scss";

import DungeonGenerator from "./components/DungeonGenerator.js";

import GridRenderer from "./features/renderers/GridRenderer.js";
import ClearRenderer from "./features/renderers/ClearRenderer.js";
import DungeonRenderer from "./features/renderers/DungeonRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".dungeon-generator--container");
    if(!container) throw new Error("No container for the generator found!");

    const dungeonGenerator = DungeonGenerator.init(container);
    dungeonGenerator.generate();
    const { dungeon } = dungeonGenerator;

    dungeonGenerator
        .windowedFullScreen()
        .start([
            ClearRenderer,
            { 
                renderer: GridRenderer,
                params: { 
                    dungeon, 
                    withCenter : false, 
                    withIntersections: false 
                }
            },
            { renderer: DungeonRenderer, params: { dungeon } }
        ])
    ;
});
