local Collection = require"Helpers.Collection"
local RoomRenderer = require"Renderer.RoomRenderer"

local DungeonRenderer = {}
DungeonRenderer.__index = DungeonRenderer

function DungeonRenderer:new()
    return setmetatable({
        roomRenderer = RoomRenderer:new()
    }, self)
end

---Renders a dungeon to video
---@param dungeon Dungeon 
---@param gap ?number
function DungeonRenderer:handle(dungeon, gap)
    local widthSegments = love.graphics.getWidth() / (dungeon.bounds.x + 1)
    local heightSegments = love.graphics.getHeight() / (dungeon.bounds.y + 1)
    local segmentLength = math.min(widthSegments, heightSegments)
    local rooms = Collection:new(dungeon.graph.nodes)

    ---Draws a room
    ---@param room Room
    local drawRoom = function(room)
        self.roomRenderer:handle(room.item, segmentLength, gap, room.id)
    end
    rooms:foreach(drawRoom)
end

return DungeonRenderer
