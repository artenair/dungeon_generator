local Collection = require"Helpers.Collection"

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

---Adds a node to the graph
---@param node Node 
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

function Graph:getSpanningTree()
    local tree = Graph:new()
    if #self.nodes < 1 then return tree end
    tree:addNode(self.nodes[1])
    local isSameNode = function(a, b) return a.id == b.id end
    local nodes = Collection:new(self.nodes)
    while #tree.nodes < #self.nodes do
        local explored = Collection:new(tree.nodes)
        local candidates = explored:reduce(function (candidates, node)
            Collection
                :new(self.edges[node.id])
                :filter(function(candidate) return candidate.id ~= node.id end)
                :foreach(function(candidate)
                    if not candidates:contains(candidate, isSameNode) then
                        candidates:add(candidate)
                    end
                end)
            return candidates
        end, Collection:new())
        local selected = candidates:get(math.random(candidates:size()))
        tree:addNode(selected)

        local selectedEdges = Collection:new(self.edges[selected.id]):filter(function(node)
            return Collection:new(tree.nodes):contains(node, isSameNode)
        end)
        tree:addEdge(selected, selectedEdges:get(math.random(selectedEdges:size())))
    end
    return tree
end

return Graph
