---@class Node
---@field id integer
---@field item any
local Node = {}
Node.__index = Node

function Node:new(item)
    return setmetatable({
        id = nil,
        item = item
    }, self)
end

return Node
