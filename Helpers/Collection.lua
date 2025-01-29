require("Helpers.functions")

---@class Collection
---@field elements any[] 
local Collection = {}
Collection.__index = Collection

function Collection:new(elements)
    return setmetatable({
        elements = elements or {}
    }, self)
end

function Collection:size()
    return #self.elements
end

function Collection:add(item)
    if not self.elements then
        self.elements = {item}
    else
        self.elements[#self.elements+1] = item
    end
    return self
end

---Finds an item if it's inside the collection
---@param needle any
---@param comparator ?function 
---@return boolean
function Collection:contains(needle, comparator)
    if not self.elements then return false end

    comparator = comparator or function(a, b)
        return a == b
    end

    for _, item in ipairs(self.elements) do
        if comparator(needle, item) then
            return true
        end
    end

    return false
end

---Calls a callback on each item of the collection
---@param callback function
function Collection:map(callback)
    local newCollection = Collection:new()
    for i, item in ipairs(self.elements) do
        newCollection:add(callback(item, i))
    end

    return newCollection
end

---Reduces a collection to a single value
---@param reductor ?function
---@param defaultValue any
function Collection:reduce(reductor, defaultValue)
    local carry = defaultValue or nil

    reductor = reductor or function (carry, item, i)
        return i
    end

    for i, item in pairs(self.elements) do
        carry = reductor(carry, item, i)
    end

    return carry
end

--- Returns only the parameters that pass the filter function
---@param filter ?function
function Collection:filter(filter)
    filter = filter or function (item, i)
        return item ~= nil
    end

    local newCollection = Collection:new()
    for i, item in ipairs(self.elements) do
        if filter(item, i) then
            newCollection:add(item)
        end
    end

    return newCollection
end

---Calls a callback on each item of the collection
---@param callback function
function Collection:foreach(callback)
    for i, item in ipairs(self.elements) do
        callback(item, i)
    end
end

function Collection:dump()
    local dump = Dump(self.elements)
    print(dump)
end

function Collection:get(index)
    if index < 1 or index > #self.elements then
        return nil
    end
    return self.elements[index]
end

---Shifts the first N elements of the collection
---@param quantity ?integer 
---@return any
function Collection:shift(quantity)
    quantity = quantity or 1
    return table.remove(self.elements, 1)
end

return Collection
