local Segment = require"Geometry.Segment"
local PolygonRenderer = require"Renderer.PolygonRenderer"

--- @class Polygon 
--- @field center Point
--- @field vertices Point[] 
--- @field sides Segment[] 
--- @field radius number 
local Polygon = {}
Polygon.__index = Polygon


---Creates a Polygon 
---@param center Point 
---@param vertices Point[]
---@return Polygon
function Polygon:new(center, vertices)
    local instance = setmetatable({
        center = center,
        vertices = vertices,
        radius = -1,
        sides = {},
    }, self)
    for index, vertex in ipairs(vertices) do
        local nextVertex = vertices[math.fmod(index, #vertices) + 1]
        local side = Segment:new(vertex, nextVertex)
        instance.sides[#instance.sides+1] =  side
        instance.radius = math.max(side:length(), instance.radius)
    end
    instance.radius = math.ceil(instance.radius)
    return instance
end

---Checks if a collider is colliding with another collider
---@param other Polygon 
---@return boolean 
function Polygon:collides(other)
    for _, first in ipairs(self.sides) do
        for _, second in ipairs(other.sides) do
            if first:intersects(second) then
                return true
            end
        end
    end

    return false
end

---Draws a polygon with a given scale
---@param scale number
function Polygon:draw(scale)
    PolygonRenderer.hande(self, scale)
end

function Polygon:move(dx, dy)
    self.center.x = self.center.x + dx
    self.center.y = self.center.y + dy

    for _, vertex in pairs(self.vertices) do
        vertex.x = vertex.x + dx
        vertex.y = vertex.y + dy
    end
end

return Polygon
