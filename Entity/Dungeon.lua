local Graph = require"Graph.Graph"
local Point = require"Geometry.Point"
local Collection = require"Helpers.Collection"

---@class Dungeon
---@field graph Graph 
---@field bounds Point
---@field spawn Room
local Dungeon = {}
Dungeon.__index = Dungeon

---Creates a new Dungeon
---@param graph Graph A collection of the dungeon rooms 
function Dungeon:new(graph)

    local instance = setmetatable({
        graph = graph,
        bounds = Point:new(0,0),
        spawn = nil
    }, self)
    instance:detectSpawn()
    instance:detectBounds()
    return instance
end

function Dungeon:detectBounds()
    ---Finds the max width and height of the dungeon
    ---@param bounds Point
    ---@param room Room
    local findBounds = function(bounds, room)
        bounds.x = math.max(bounds.x, room.body.center.x)
        bounds.y = math.max(bounds.y, room.body.center.y)
        return bounds
    end

    local rooms = Collection:new(self.graph.nodes):map(function(node) return node.item end)
    self.bounds = rooms:reduce(findBounds, self.bounds)
end

---Generates the virtual grid and spawns the dungeon rooms anchor points
function Dungeon:detectSpawn()
    local rooms = Collection:new(self.graph.nodes):map(function(node) return node.item end)

    self.spawn = rooms:reduce(function(carry, room)
        local currentMaxDistance = rooms:reduce(function(distance, other)
            return math.max(distance, room.body.center:distance(other.body.center))
        end, 0)
        if carry.distance < currentMaxDistance then
            return carry
        end
        return { room = room, distance = currentMaxDistance }
    end, { room = nil, distance = math.huge}).room

    self.spawn.isSpawn = true
end

return Dungeon
