local FloorSizeCalculator = {}
FloorSizeCalculator.__index = FloorSizeCalculator

function FloorSizeCalculator:get(maxRooms, tier, isHuge)
    tier = tier or 1
    isHuge = isHuge or false
    
    local total = tier * 10 / 3 + 5 + math.random(0, 1)
    if isHuge then
        total = total * 1.8
    end
    return math.min(math.ceil(total), maxRooms)
end

return FloorSizeCalculator
