local PolygonRenderer = {}
PolygonRenderer.__index = PolygonRenderer

---Renders a polygon
---@param polygon Polygon 
---@param scale ?number
function PolygonRenderer.hande(polygon, scale)
    scale = scale or 1
    love.graphics.setColor(1,1,1,1)
    for _, side in pairs(polygon.sides) do
        love.graphics.line(
            side.a.x * scale,
            side.a.y * scale,
            side.b.x * scale,
            side.b.y * scale
        )
    end
    love.graphics.circle("fill", polygon.center.x * scale, polygon.center.y * scale, 2)
end

return PolygonRenderer
