local PolygonFactory = require"Factories.PolygonFactory"
local PolygonRenderer = require"Renderer.PolygonRenderer"
local Direction = require"Helpers.Direction"

---@class Room
---@field body Polygon
---@field neighbours Room[]
---@field isSpawn boolean
local Room = {}
Room.__index = Room

---Creates a new room
---@param center Point
---@param width ?integer
---@param height ?integer
---@return Room
function Room:new(center, width, height)
    return setmetatable({
        body = PolygonFactory.rectangle(
            center,
            width or 1,
            height or 1
        ),
        neighbours = {},
        isSpawn = false
    }, self)
end

---Adds a room as a neighbour
---@param neighbour Room
---@param direction Direction 
function Room:addNeighbour(neighbour, direction)
    if not direction then return end
    if self.neighbours[direction] ~= nil then return end
    self.neighbours[direction] = neighbour
    local opposite = Direction:opposite(direction)
    if(neighbour.neighbours[opposite] == nil) then
        neighbour.neighbours[opposite] = neighbour
    end
end

return Room
