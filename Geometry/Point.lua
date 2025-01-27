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

return Point
