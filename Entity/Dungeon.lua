local Room = require"Entity.Room"
local Point = require"Geometry.Point"
local Direction = require"Helpers.Direction"
local Collection = require"Helpers.Collection"
local Graph = require"Graph.Graph"
local Node = require"Graph.Node"

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
    self.rooms = self:generateRooms()

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
function Dungeon:generateRooms()
    local dungeonGraph = self:generateRoomsPositions()
    local roomPositions = Collection:new(dungeonGraph.nodes)
    local directions = self:getDungeonDirections()

    local rooms = roomPositions:map(function(node)
        local position = node.item
        return Room:new(position)
    end)

    rooms:foreach(function (room)
        rooms:foreach(function(other)
            local delta = Point:new(
                other.body.center.x - room.body.center.x,
                other.body.center.y - room.body.center.y
            )

            for direction, d in pairs(directions) do
                if delta.x == d.x and delta.y == d.y then
                    room:addNeighbour(other, direction)
                end
            end
        end)
    end)

    return rooms
end

function Dungeon:getDungeonDirections()
    return {
        [Direction.WEST] = Point:new(-1, 0),
        [Direction.EAST] = Point:new(1, 0),
        [Direction.SOUTH] = Point:new(0, 1),
        [Direction.NORTH] = Point:new(0, -1),
    }
end

function Dungeon:generateRoomsPositions()
    local dungeon = Graph:new()
    local delta = self:getDungeonDirections()

    local inGrid = function (position)
        return  position.x > 0 and
                position.x <= self.width and
                position.y > 0 and
                position.y <= self.height
    end

    ---Gets all the possible neighbours from a certain position
    ---@param position Point
    ---@return Collection
    local getNeighbours = function(position)
        local neighbours = {}
        for _, d in pairs(delta) do
            local neighbour = Point:new(position.x + d.x, position.y + d.y)
            if inGrid(neighbour) then
                neighbours[#neighbours+1] = neighbour
            end
        end
        return Collection:new(neighbours)
    end

    for i=1,self.cardinality do
        local nodes = Collection:new(dungeon.nodes)
        local candidates = Collection:new()
        nodes:foreach(function(node)
            local neighbours = getNeighbours(node.item)
            neighbours:foreach(function(neighbour)
                local positions = nodes:map(function(a) return a.item end)
                local present = positions:contains(neighbour, function(a, b) return a:equals(b) end)
                if present then return end
                candidates:add(neighbour)
            end)
        end)

        local selected = candidates:get(math.random(candidates:size()))
        if not selected then
            selected = Point:new(math.floor(self.width / 2), math.floor(self.height / 2))
        end

        local newNode = Node:new(selected)
        dungeon:addNode(newNode)

        getNeighbours(selected):foreach(function(neighbour)
            local neighbourNode = nodes:reduce(function(found, node)
                if found then return found end
                if neighbour:equals(node.item) then return node end
                return nil
            end, nil)
            if not neighbourNode then return end
            dungeon:addEdge(newNode, neighbourNode)
        end)
    end

    return dungeon
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
