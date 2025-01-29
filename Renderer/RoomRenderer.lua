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
    self:drawPassages(room, scale, gap)
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

function RoomRenderer:drawPassages(room, scale, gap)
    self:drawPassage(room, Direction.NORTH, scale, gap)
    self:drawPassage(room, Direction.SOUTH, scale, gap)
    self:drawPassage(room, Direction.WEST, scale, gap)
    self:drawPassage(room, Direction.EAST, scale, gap)
end

function RoomRenderer:drawPassage(room, direction, scale, gap)
    if gap <= 0 then return end

    local delta = 0.5
    if direction == Direction.NORTH or direction == Direction.WEST then
        delta = -delta
    end

    local halfGap = gap / 2

    if room.neighbours[direction] ~= nil and direction == Direction.NORTH then
        love.graphics.line(
            (room.body.center.x + 0.25) * scale, (room.body.center.y + delta - halfGap) * scale,
            (room.body.center.x + 0.25) * scale, (room.body.center.y + delta + halfGap) * scale
        )
    end

    if room.neighbours[direction] ~= nil and direction == Direction.SOUTH then
        love.graphics.line(
            (room.body.center.x - 0.25) * scale, (room.body.center.y + delta - halfGap) * scale,
            (room.body.center.x - 0.25) * scale, (room.body.center.y + delta + halfGap) * scale
        )
    end

    if room.neighbours[direction] ~= nil and direction == Direction.EAST then
        love.graphics.line(
            (room.body.center.x + delta - halfGap) * scale, (room.body.center.y + 0.25) * scale,
            (room.body.center.x + delta + halfGap) * scale, (room.body.center.y + 0.25) * scale
        )
    end

    if room.neighbours[direction] ~= nil and direction == Direction.WEST then
        love.graphics.line(
            (room.body.center.x + delta - halfGap) * scale, (room.body.center.y - 0.25) * scale,
            (room.body.center.x + delta + halfGap) * scale, (room.body.center.y - 0.25) * scale
        )
    end
end

function RoomRenderer:drawWall(room, direction, scale, gap)
    gap = math.min(gap or 0, 0.5)
    if direction == Direction.NORTH or direction == Direction.SOUTH then
        local delta = 0.5
        if direction == Direction.NORTH then
            delta = -delta
        end

        self:drawHorizontalWall(
            room,
            room.body.center.y + delta,
            room.neighbours[direction] ~= nil,
            scale, gap / 2
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
            scale, gap / 2
        )
    end
end

function RoomRenderer:drawHorizontalWall(room, y, withOpening, scale, gap)
    local gapSign = 1
    if room.body.center.y < y then
        gapSign = -1
    end

    if not withOpening then
        love.graphics.line(
            (room.body.center.x - 0.5 + gap) * scale, (y + gap * gapSign) * scale,
            (room.body.center.x + 0.5 - gap) * scale, (y + gap * gapSign) * scale
        )

        -- love.graphics.line(
        --     (room.body.center.x - 0.5) * scale, y * scale,
        --     (room.body.center.x + 0.5) * scale, y * scale
        -- )
        return
    end
    
    -- Interior walls
    love.graphics.line(
        (room.body.center.x - 0.5 + gap) * scale, (y + gap * gapSign) * scale,
        (room.body.center.x - 0.25) * scale, (y + gap * gapSign) * scale
    )

    love.graphics.line(
        (room.body.center.x + 0.25) * scale, (y + gap * gapSign) * scale,
        (room.body.center.x + 0.5 - gap) * scale, (y + gap * gapSign) * scale
    )

    -- exterior walls
    -- love.graphics.line(
    --     (room.body.center.x - 0.5) * scale, y * scale,
    --     (room.body.center.x - 0.25 - gap) * scale, y * scale
    -- )
    --
    -- love.graphics.line(
    --     (room.body.center.x + 0.25 + gap) * scale, y * scale,
    --     (room.body.center.x + 0.5) * scale, y * scale
    -- )
end

function RoomRenderer:drawVerticalWall(room, x, withOpening, scale, gap)
    local gapSign = 1
    if room.body.center.x < x then
        gapSign = -1
    end

    if not withOpening then
        love.graphics.line(
            (x + gap * gapSign) * scale, (room.body.center.y - 0.5 + gap) * scale,
            (x + gap * gapSign) * scale, (room.body.center.y + 0.5 - gap) * scale
        )

        -- love.graphics.line(
        --     x * scale, (room.body.center.y - 0.5) * scale,
        --     x * scale, (room.body.center.y + 0.5) * scale
        -- )
        return
    end

    -- Interior walls
    love.graphics.line(
        (x + gap * gapSign) * scale, (room.body.center.y - 0.5 + gap) * scale,
        (x + gap * gapSign) * scale, (room.body.center.y - 0.25) * scale
    )

    love.graphics.line(
        (x + gap * gapSign) * scale, (room.body.center.y + 0.25) * scale,
        (x + gap * gapSign) * scale, (room.body.center.y + 0.5 - gap) * scale
    )

    -- exterior walls
    -- love.graphics.line(
    --     x * scale, (room.body.center.y - 0.5) * scale,
    --     x * scale, (room.body.center.y - 0.25 - gap) * scale
    -- )
    --
    -- love.graphics.line(
    --     x * scale, (room.body.center.y + 0.25 + gap) * scale,
    --     x * scale, (room.body.center.y + 0.5) * scale
    -- )
end

return RoomRenderer
