---@class Edge
---@field a Node
---@field b Node
---@field data table

local Edge = {}
Edge.__index = Edge

---Creates a new Edge
---@param a Node 
---@param b Node 
---@param data ?table
---@return Edge
function Edge:new(a, b, data)
    return setmetatable({
        a = a,
        b = b,
        data = data or {}
    }, self)
end

return Edge
