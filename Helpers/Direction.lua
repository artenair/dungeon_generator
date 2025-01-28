local Enum = require"Helpers.functions"

---@class Direction
---@field NORTH string 
---@field WEST string 
---@field SOUTH string 
---@field EAST string 
local Direction = {
    ["NORTH"] = "NORTH",
    ["WEST"] = "WEST",
    ["SOUTH"] = "SOUTH",
    ["EAST"] = "EAST"
}
Direction.__index = Direction

---Get the opposite direction of the direction given
---@param direction string
---@return string
function Direction:opposite(direction)
    if self[direction] == nil then error("Invalid direction : " .. direction) end
    if self[direction] == "NORTH" then return "SOUTH" end
    if self[direction] == "WEST" then return "EAST" end
    if self[direction] == "SOUTH" then return "NORTH" end
    return "WEST"
end

function Direction.detect(dx, dy)
    if dx ~= 0 and dy ~=0 then return nil end
    if dx > 0 then return Direction.EAST end
    if dx < 0 then return Direction.WEST end
    if dy > 0 then return Direction.SOUTH end
    return Direction.NORTH
end

return Direction
