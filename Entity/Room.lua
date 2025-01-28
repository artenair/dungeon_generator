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
    self:drawWall(Direction.NORTH, scale)
    self:drawWall(Direction.SOUTH, scale)
    self:drawWall(Direction.WEST, scale)
    self:drawWall(Direction.EAST, scale)
end

function Room:drawWall(direction, scale)
    if direction == Direction.NORTH or direction == Direction.SOUTH then
        local delta = 0.5
        if direction == Direction.NORTH then
            delta = -0.5
        end
        self:drawHorizontalWall(
            self.body.center.y + delta,
            self.neighbours[direction] ~= nil,
            scale
        )
    else
        local delta = 0.5
        if direction == Direction.WEST then
            delta = -0.5
        end
        self:drawVerticalWall(
            self.body.center.x + delta,
            self.neighbours[direction] ~= nil,
            scale
        )
    end
end

function Room:drawHorizontalWall(y, withGap, scale)
    if not withGap then
        love.graphics.line(
            (self.body.center.x - 0.5) * scale, y * scale,
            (self.body.center.x + 0.5) * scale, y * scale
        )
        return
    end

    love.graphics.line(
        (self.body.center.x - 0.5) * scale, y * scale,
        (self.body.center.x - 0.25) * scale, y * scale
    )

    love.graphics.line(
        (self.body.center.x + 0.25) * scale, y * scale,
        (self.body.center.x + 0.5) * scale, y * scale
    )
end

function Room:drawVerticalWall(x, withGap, scale)
    if not withGap then
        love.graphics.line(
            x * scale, (self.body.center.y - 0.5) * scale,
            x * scale, (self.body.center.y + 0.5) * scale
        )
        return
    end
    love.graphics.line(
        x * scale, (self.body.center.y - 0.5) * scale,
        x * scale, (self.body.center.y - 0.25) * scale
    )

    love.graphics.line(
        x * scale, (self.body.center.y + 0.25) * scale,
        x * scale, (self.body.center.y + 0.5) * scale
    )
end

function Room:update()
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
