local Node = require"Graph.Node"
local Room = require"Entity.Room"
local Graph = require"Graph.Graph"
local Point = require"Geometry.Point"
local Dungeon = require"Entity.Dungeon"
local Direction = require"Helpers.Direction"
local Collection = require"Helpers.Collection"

local DungeonFactory = {}
DungeonFactory.__index = DungeonFactory

---Creates a new dungeon generator
---@param seed ?integer
function DungeonFactory:new(seed)
    return setmetatable({
        seed = seed or os.time(),
    }, self)
end

---Creates a dungeon of a given size
---@param rooms integer The number of rooms to generate in this dungeon
---@return Dungeon 
function DungeonFactory:makeSkeleton(rooms)
    math.randomseed(self.seed)
    local roomPositions = self:getRoomPositions(rooms)
    local dungeonGraph = self:generateGraph(roomPositions)
    return Dungeon:new(dungeonGraph)
end

---Returns the positions of the rooms to be spawned
---@param rooms integer The number of positions to reserve for rooms
---@return Collection 
function DungeonFactory:getRoomPositions(rooms)
    local positions = Collection:new({
        Point:new(0, 0)
    })

    local samePoint = function(a, b) return a:equals(b) end

    ---Gets the candidates to be added to the room
    ---@param candidates Collection 
    ---@param position Point 
    local getCandidates = function (candidates, position)
        position:getOrthogonals():foreach(function(neighbour)
            if positions:contains(neighbour, samePoint) then return end
            if candidates:contains(neighbour, samePoint) then return end
            candidates:add(neighbour)
        end)
        return candidates
    end

    while positions:size() < rooms do
        local candidates = positions:reduce(getCandidates, Collection:new())
        local selected = candidates:get(math.random(candidates:size()))
        positions:add(selected)
    end

    return DungeonFactory:normalizeRooms(positions)
end

---Gets a list of positions, and normalizes them to have the minX = 0 and minY = 0
---@param rooms Collection 
---@return Collection
function DungeonFactory:normalizeRooms(rooms)
    local getX = function (room) return room.x end
    local getY = function (room) return room.y end
    local getMin = function (a, b) if a < b then return a end return b end

    local dx = rooms:map(getX):reduce(getMin, math.huge) - 1
    local dy = rooms:map(getY):reduce(getMin, math.huge) - 1
    rooms:foreach(function(room)
        room.x = room.x - dx
        room.y = room.y - dy
    end)

    return rooms
end

---Gets an array of positions and generates a graph
---@param positions Collection 
---@return Graph 
function DungeonFactory:generateGraph(positions)
    local dungeon = Graph:new()

    --- Adds each node to the graph
    ---@param position Point
    positions:foreach(function(position)
        dungeon:addNode(Node:new(position))
    end)

    local rooms = Collection:new(dungeon.nodes)

    rooms:foreach(function(a)
        rooms:foreach(function(b)
            if a == b then return end

            local dx = math.abs(b.item.x - a.item.x)
            local dy = math.abs(b.item.y - a.item.y)
            local d = dx + dy
            if d ~= 1 then return end
            dungeon:addEdge(a, b)
            dungeon:addEdge(b, a)
        end)
    end)

    local spanningTree = dungeon:getSpanningTree()

    for i=1,#spanningTree.nodes do
        local node = spanningTree.nodes[i]
        node.item = Room:new(node.item)
    end

    for _, node in ipairs(spanningTree.nodes) do
        for _, neighbour in ipairs(spanningTree:getNeighboursFor(node.id)) do
            local d = Point:new(
                neighbour.item.body.center.x - node.item.body.center.x,
                neighbour.item.body.center.y - node.item.body.center.y
            )
            node.item:addNeighbour(neighbour.item, Direction.detect(d.x, d.y))
        end
    end

    return spanningTree
end

---TODO: Generate the decorations of the room
---@param position Point
---@return Room
function DungeonFactory:generateRoom(position)
    return Room:new(position)
end

return DungeonFactory
