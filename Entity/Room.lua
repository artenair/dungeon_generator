local PolygonFactory = require"Factories.PolygonFactory"
local PolygonRenderer = require"Renderer.PolygonRenderer"
local Direction = require"Helpers.Direction"

---@class Room
---@field body Polygon
---@field neighbours Room[]
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
        neighbours = {}
    }, self)
end

---Draws a room with a given scale
---@param scale number
function Room:draw(scale)
    scale = scale or 1
    self.body:draw(scale)

    love.graphics.setColor(0,0,0,1)
    if self.neighbours[Direction.NORTH] ~= nil then
        love.graphics.line(
            (self.body.center.x - 0.25) * scale, (self.body.center.y - 0.5) * scale,
            (self.body.center.x + 0.25) * scale, (self.body.center.y - 0.5) * scale
        )
    end
    if self.neighbours[Direction.SOUTH] ~= nil then
        love.graphics.line(
            (self.body.center.x - 0.25) * scale, (self.body.center.y + 0.5) * scale,
            (self.body.center.x + 0.25) * scale, (self.body.center.y + 0.5) * scale
        )
    end
    if self.neighbours[Direction.WEST] ~= nil then
        love.graphics.line(
            (self.body.center.x - 0.5) * scale, (self.body.center.y - 0.25) * scale,
            (self.body.center.x - 0.5) * scale, (self.body.center.y + 0.25) * scale
        )
    end
    if self.neighbours[Direction.EAST] ~= nil then
        love.graphics.line(
            (self.body.center.x + 0.5) * scale, (self.body.center.y - 0.25) * scale,
            (self.body.center.x + 0.5) * scale, (self.body.center.y + 0.25) * scale
        )
    end
end

function Room:update()
end

---Adds a room as a neighbour
---@param neighbour Room
---@param direction Direction 
function Room:addNeighbour(neighbour, direction)
    if self.neighbours[direction] ~= nil then error("The room has already been filled") end
    self.neighbours[direction] = neighbour
    local opposite = Direction:opposite(direction)
    if(neighbour.neighbours[opposite] == nil) then
        neighbour.neighbours[opposite] = neighbour
    end
end

return Room
