local Collection = require"Helpers.Collection"
local Edge = require"Graph.Edge"

---@class Graph
---@field root Node
---@field nodes Node[]
---@field edges Edge[]
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
end

function Graph:addEdge(a, b)
    if a.id == nil then self:addNode(a) end
    if b.id == nil then self:addNode(b) end
    if not self:hasEdge(a, b) then
        self.edges[#self.edges+1] = Edge:new(a, b)
    end
end

function Graph:hasEdge(a, b)
    for _, edge in ipairs(self.edges) do
        if (edge.a == a and edge.b == b) then
            return true
        end
    end
    return false
end

function Graph:display()
    local output = ""
    for _, edge in ipairs(self.edges) do
        output = output .. "(" ..tostring(edge.a.item) .. " <-> " .. tostring(edge.b.item) .. ")\n"
    end
    print(output)
end

function Graph:getSpanningTree()
    local tree = Graph:new()
    if #self.nodes < 1 then return tree end
    tree:addNode(self.nodes[math.random(#self.nodes)])
    while #tree.nodes < #self.nodes do
        local foundEdge = false
        local i = 0
        local nodeIdx = math.random(#tree.nodes)
        local neighbourId = 0
        local node = nil
        local neighbour = nil

        repeat
            nodeIdx = math.fmod(nodeIdx + i, #tree.nodes) + 1
            node = tree.nodes[nodeIdx]
            local neighbours = self:getNeighboursFor(node.id)
            neighbourId = math.random(#neighbours)
            local j = 0
            repeat
                neighbourId = math.fmod(neighbourId + j, #neighbours) + 1
                neighbour = neighbours[neighbourId]
                foundEdge = neighbour and not Collection:new(tree.nodes):contains(neighbour, function (a, b) return a.id == b.id end)
                j = j + 1
            until foundEdge or j > #neighbours
            i = i + 1
        until foundEdge or i > #tree.nodes

        if foundEdge then
            tree:addNode(neighbour)
            tree:addEdge(node, neighbour)
            tree:addEdge(neighbour, node)
        end
    end

    return tree
end

function Graph:getNeighboursFor(nodeId)
    local neighbours = {}
    for _, edge in ipairs(self.edges) do
        if(edge.a.id == nodeId) then
            neighbours[#neighbours+1] = edge.b
        end
    end
    return neighbours
end

return Graph
