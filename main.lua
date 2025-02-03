local settings = require"settings"
local Collection = require"Helpers.Collection"
local DungeonFactory = require"Factories.DungeonFactory"
local DungeonRenderer = require"Renderer.DungeonRenderer"
local FloorSizeCalculator = require"ProceduralGeneration.FloorSizeCalculator"

local gameState = {
    paused = false,
    entities = Collection:new()
}

function getCenter()
    return settings.window.width / 2, settings.window.height / 2
end

local dungeonFactory = DungeonFactory:new()

local makeNewDungeon = function(rooms)
    local seed = os.time()
    math.randomseed(seed)
    local isHuge = math.random() > 0.5
    local maxRooms = settings.dungeon.maxRooms.normal
    if isHuge then
        maxRooms = settings.dungeon.maxRooms.huge
    end
    local tier = math.random(1, 4)
    local rooms = FloorSizeCalculator:get(maxRooms, tier, isHuge)
    return dungeonFactory:makeSkeleton(rooms)
end

local dungeonInstance = makeNewDungeon()
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
    dungeonRenderer:handle(dungeonInstance, 0.1)
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end

    if key == "r" then
        dungeonInstance = makeNewDungeon()
    end
end

