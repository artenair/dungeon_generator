local Collection = require"Helpers.Collection"

---@class Point
---@field x integer
---@field y integer
local Point = {}
Point.__index = Point

function Point:new(x, y)
    return setmetatable({
        x = x,
        y = y
    }, self)
end

---Returns the distance between two point
---@param other Point
---@return number
function Point:distance(other)
    local dx = self.x - other.x
    local dy = self.y - other.y
    return math.sqrt(dx*dx + dy*dy)
end

function Point:equals(other)
    return self.x == other.x and self.y == other.y
end

function Point:getOrthogonals()
    local orthogonals = Collection:new()
    local directions = {
        {dx = 0, dy = -1},
        {dx = 1, dy = 0},
        {dx = 0, dy = 1},
        {dx = -1, dy = 0}
    }

    for _, direction in ipairs(directions) do
        orthogonals:add(Point:new(self.x + direction.dx, self.y + direction.dy))
    end

    return orthogonals
end

return Point
