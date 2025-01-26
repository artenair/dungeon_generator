local Point = require("Geometry.Point")
local Polygon = require("Geometry.Polygon")

---@class PolygonFactory
local PolygonFactory = {}
PolygonFactory.__index = {}

---Creates a rectangle
---@param center Point
---@param width integer
---@param height integer
function PolygonFactory.rectangle(center, width, height)
    local topLeft = Point:new(
        center.x - width/2,
        center.y - height/2
    )
    return Polygon:new(
        center,
        {
            topLeft,
            Point:new(topLeft.x + width, topLeft.y),
            Point:new(topLeft.x + width, topLeft.y + height),
            Point:new(topLeft.x, topLeft.y + height),
        }
    )
end

---Creates a regular polygon 
---@param center Point
---@param sides integer
---@param radius integer
function PolygonFactory.regular(center, sides, radius)
    local vertices = {}
    local alpha = 2 * math.pi / sides
    local delta = 0.25
    if math.fmod(sides, 2) == 0 then
        delta = 0.5
    end
    for i=1,sides do
        vertices[#vertices+1] = Point:new(
            center.x + (math.cos(alpha * (i - delta) ) * radius),
            center.y + (math.sin(alpha * (i - delta) ) * radius)
        )
    end
    return Polygon:new(center, vertices)
end

return PolygonFactory
