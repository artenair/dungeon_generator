local Direction = require"Helpers.Direction"

local RoomRenderer = {}
RoomRenderer.__index = RoomRenderer

function RoomRenderer:new()
    return setmetatable({
        roomRenderer = nil
    }, self)
end

function RoomRenderer:handle(room, scale, gap)
    scale = scale or 1
    gap = gap or 0

    love.graphics.setColor(1, 1, 1, 1)
    self:drawWalls(room, scale, gap)
    self:drawDecoration(room, scale)
end

function RoomRenderer:drawDecoration(room, scale)
    if not room.isSpawn then return end
    love.graphics.setNewFont(math.floor(scale / 2))
    love.graphics.print("s", scale * (room.body.center.x - 0.1), scale * (room.body.center.y - 0.375))
end

function RoomRenderer:drawWalls(room, scale, gap)
    self:drawWall(room, Direction.NORTH, scale, gap)
    self:drawWall(room, Direction.SOUTH, scale, gap)
    self:drawWall(room, Direction.WEST, scale, gap)
    self:drawWall(room, Direction.EAST, scale, gap)
end

function RoomRenderer:drawWall(room, direction, scale, gap)
    gap = gap or 0
    if direction == Direction.NORTH or direction == Direction.SOUTH then
        local delta = 0.5 * (1 - gap)

        if direction == Direction.NORTH then
            delta = -delta
        end

        self:drawHorizontalWall(
            room,
            room.body.center.y + delta,
            room.neighbours[direction] ~= nil,
            scale, gap
        )
    else
        local delta = 0.5
        if direction == Direction.WEST then
            delta = -0.5
        end
        self:drawVerticalWall(
            room,
            room.body.center.x + delta,
            room.neighbours[direction] ~= nil,
            scale, gap
        )
    end
end

function RoomRenderer:drawHorizontalWall(room, y, withOpening, scale, gap)
    if not withOpening then
        love.graphics.line(
            (room.body.center.x - 0.5) * scale, y * scale,
            (room.body.center.x + 0.5) * scale, y * scale
        )
        return
    end

    love.graphics.line(
        (room.body.center.x - 0.5) * scale, y * scale,
        (room.body.center.x - 0.25) * scale, y * scale
    )

    love.graphics.line(
        (room.body.center.x + 0.25) * scale, y * scale,
        (room.body.center.x + 0.5) * scale, y * scale
    )
end

function RoomRenderer:drawVerticalWall(room, x, withOpening, scale, gap)
    if not withOpening then
        love.graphics.line(
            x * scale, (room.body.center.y - 0.5) * scale,
            x * scale, (room.body.center.y + 0.5) * scale
        )
        return
    end
    love.graphics.line(
        x * scale, (room.body.center.y - 0.5) * scale,
        x * scale, (room.body.center.y - 0.25) * scale
    )

    love.graphics.line(
        x * scale, (room.body.center.y + 0.25) * scale,
        x * scale, (room.body.center.y + 0.5) * scale
    )
end

return RoomRenderer
