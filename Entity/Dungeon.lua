local Room = require"Entity.Room"
local Point = require"Geometry.Point"
local Direction = require"Helpers.Direction"
local Collection = require"Helpers.Collection"

---@class Dungeon
---@field cardinality integer
---@field width integer
---@field height integer
local Dungeon = {}
Dungeon.__index = Dungeon

---Creates a new Dungeon
---@param rooms integer The numer or rooms this dungeon needs to have
---@param width ?integer The width of the virtual grid in which the dungeon will be generated
---@param height ?integer The height of the virtual grid in which the dungeon will be generated
function Dungeon:new(rooms, width, height)
    local instance = setmetatable({
        cardinality = rooms,
        width = width or rooms,
        height = height or rooms,
        rooms = nil,
        spawnPoint = nil
    }, self)
    instance:generate()
    return instance
end

---Generates the virtual grid and spawns the dungeon rooms anchor points
function Dungeon:generate()
    math.randomseed(os.time())
    self.rooms = Collection:new()
    local grid = {}

    for y=1,self.height do
        grid[y] = {}
        for x=1,self.width do
            grid[y][x] = nil
        end
    end

    for _=1,self.cardinality do self:expand(grid) end

    local getX = function (room) return room.body.center.x end
    local getY = function (room) return room.body.center.y end
    local getMin = function (a, b) if a < b then return a end return b end
    local getMax = function (a, b) if a > b then return a end return b end

    local dx = self.rooms:map(getX):reduce(getMin, math.huge) - 1
    local dy = self.rooms:map(getY):reduce(getMin, math.huge) - 1
    self.rooms:foreach(function(room) room.body:move(-dx, -dy) end)

    local mx = self.rooms:map(getX):reduce(getMax, 0)
    local my = self.rooms:map(getY):reduce(getMax, 0)
    self.width = mx
    self.height = my

    self.spawnPoint = self.rooms:reduce(function(carry, room)
        local currentMaxDistance = self.rooms:reduce(function(distance, other)
            return math.max(distance, room.body.center:distance(other.body.center))
        end, 0)
        if carry.distance < currentMaxDistance then
            return carry
        end
        return { room = room, distance = currentMaxDistance }
    end, { room = nil, distance = math.huge}).room
end

---Adds a room to the dungeon
---@param grid Room[][]
function Dungeon:expand(grid)
    local neighboursLocations = {
        [Direction.WEST] = Point:new(-1, 0),
        [Direction.EAST] = Point:new(1, 0),
        [Direction.SOUTH] = Point:new(0, 1),
        [Direction.NORTH] = Point:new(0, -1),
    }

    local candidates = Collection:new()

    for y=1,self.height do
        for x=1,self.width do
            local foundNeighbour = false
            local location = Point:new(x, y)
            local neighbour = nil
            if grid[location.y][location.x] == nil then
                for _, neighbourLocation in pairs(neighboursLocations) do
                    neighbour = Point:new(x + neighbourLocation.x, y + neighbourLocation. y)
                    if neighbour.x > 0 and neighbour.x <= self.width and neighbour.y > 0 and neighbour.y <= self.height then
                        foundNeighbour = foundNeighbour or grid[neighbour.y][neighbour.x] ~= nil
                    end
                end
                local alreadyFound = candidates:contains(location, function (a, b)
                    return a.x == b.x and a.y == b.y
                end)

                if foundNeighbour and not alreadyFound then
                    candidates:add(location)
                end
            end
        end
    end

    local selected = nil
    if candidates:size() > 0 then
        selected = candidates:get(math.random(candidates:size()))
    else
        selected = Point:new(math.floor(self.width / 2), math.floor(self.height / 2))
    end

    local room = Room:new(selected)
    grid[selected.y][selected.x] = room
    self.rooms:add(room)

    local neighbour = nil
    for direction, delta in pairs(neighboursLocations) do
        local neighbourLocation = Point:new(selected.x + delta.x, selected.y + delta.y)
        if neighbourLocation.x > 0 and neighbourLocation.x <= self.width and neighbourLocation.y > 0 and neighbourLocation.y <= self.height then
            neighbour = grid[neighbourLocation.y][neighbourLocation.x]
        end
        if neighbour ~= nil then
            room:addNeighbour(neighbour, direction)
        end
    end

end

function Dungeon:draw()
    local widthSegments = love.graphics.getWidth() / (self.width + 1)
    local heightSegments = love.graphics.getHeight() / (self.height + 1)
    local segmentLength = math.min(widthSegments, heightSegments)

    -- love.graphics.setColor(1, 1, 1, 0.25)
    -- for i=1,self.width do
    --     love.graphics.line(
    --         segmentLength * i, segmentLength,
    --         segmentLength * i, segmentLength * self.height
    --     )
    -- end

    -- for i=1,self.height do
    --     love.graphics.line(
    --         segmentLength, segmentLength * i,
    --         segmentLength * self.width, segmentLength * i
    --     )
    -- end

    love.graphics.setColor(1, 1, 1, 1)
    self.rooms:foreach(function (room)
        room:draw(segmentLength)
        if room == self.spawnPoint then return end

        -- love.graphics.line(
        --     self.spawnPoint.body.center.x * segmentLength, self.spawnPoint.body.center.y * segmentLength,
        --     room.body.center.x * segmentLength, room.body.center.y * segmentLength
        -- )
    end)
end
    
return Dungeon
