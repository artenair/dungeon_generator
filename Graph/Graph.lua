---@class Graph
---@field root Node
---@field nodes Node[]
---@field edges table<integer, Node[]>
local Graph = {}
Graph.__index = Graph

---Creates a new graph from the given root
---@return Graph
function Graph:new()
    local instance = setmetatable({
        nodes = {},
        edges = {}
    }, self)
    return instance
end

function Graph:addNode(node)
    self.nodes[#self.nodes+1] = node
    if not node.id then node.id = #self.nodes end
    self.edges[node.id] = {}
end

function Graph:addEdge(a, b)
    if a.id == nil then self:addNode(a) end
    if b.id == nil then self:addNode(b) end
    local addEdge = function(a, b)
        local edges = self.edges[a.id]
        edges[#edges+1] = b
    end
    if not self:hasEdge(a, b) then addEdge(a, b) end
    if not self:hasEdge(b, a) then addEdge(b, a) end
end

function Graph:hasEdge(a, b)
    local edges = self.edges[a.id]
    for _, node in ipairs(edges) do
        if node == b then return true end
    end
    return false
end

return Graph
