---@class Segment
---@field a Point
---@field b Point
local Segment = {}
Segment.__index = Segment

function Segment:new(a, b)
    return setmetatable({
        a = a,
        b = b
    }, Segment)
end

---Returns the length of the segment
---@return number
function Segment:length()
    return self.a:distance(self.b)
end

---Tells if a segments intersects with another
---@param other Segment
---@return boolean
function Segment:intersects(other)
    local firstDelta = { x = self.b.x - self.a.x, y = self.b.y - self.a.y }
    local secondDelta = { x = other.b.x - other.a.x, y = other.b.y - other.a.y }

    local a = (secondDelta.x * (other.a.y - self.a.y)) - (secondDelta.y * (other.a.x - self.a.x))
    local b = (secondDelta.x * firstDelta.y) - (secondDelta.y * firstDelta.x)
    local c = (firstDelta.x * (other.a.y - self.a.y)) - (firstDelta.y * (other.a.x - self.a.x))

    local alpha = a / b
    local beta = c / b

    return alpha >= 0 and alpha <= 1 and beta >= 0 and beta <= 1
end


return Segment
