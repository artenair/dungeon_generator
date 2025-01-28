local settings = require"settings"
local Collection = require"Helpers.Collection"
local DungeonFactory = require"Factories.DungeonFactory"
local DungeonRenderer = require"Renderer.DungeonRenderer"

local gameState = {
    paused = false,
    entities = Collection:new()
}

function getCenter()
    return settings.window.width / 2, settings.window.height / 2
end


local dungeonCardinality = 4
local dungeonFactory = DungeonFactory:new(dungeonCardinality)
local makeNewDungeon = function(rooms)
    dungeonFactory:setSeed(os.time())
    dungeonFactory:setRooms(rooms)
    return dungeonFactory:makeSkeleton()
end
local dungeonInstance = makeNewDungeon(dungeonCardinality)
local dungeonRenderer = DungeonRenderer:new()

-- Load some default values for our rectangle.
function love.load()
    love.graphics.setDefaultFilter("nearest", "nearest")
    love.window.setMode(settings.window.width, settings.window.height)
end

-- Increase the size of the rectangle every frame.
function love.update(dt)
end

-- Draw a coloured rectangle.
function love.draw()
    dungeonRenderer:handle(dungeonInstance)
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end

    if key == "r" then
        dungeonInstance = makeNewDungeon(dungeonCardinality)
    end
end

