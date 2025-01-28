local settings = require"settings"
local Collection = require"Helpers.Collection"
local DungeonFactory = require"Factories.DungeonFactory"

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

-- Load some default values for our rectangle.
function love.load()
    love.graphics.setDefaultFilter("nearest", "nearest")
    love.window.setMode(settings.window.width, settings.window.height)
end

-- Increase the size of the rectangle every frame.
function love.update(dt)
    local updater = function (entity)
        if entity['update'] == nil then return end
        entity:update(dt)
    end
    gameState.entities:foreach(updater)
end

-- Draw a coloured rectangle.
function love.draw()
    local renderer = function (entity)
        if entity['draw'] == nil then return end
        entity:draw()
    end
    gameState.entities:foreach(renderer)
    dungeonInstance:draw()
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end

    if key == "r" then
        dungeonInstance = makeNewDungeon(dungeonCardinality)
    end
end

