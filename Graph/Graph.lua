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

function Graph:display()
    local output = ""
    for _, node in ipairs(self.nodes) do
        output = output .. node.id .. " -> "
        local edges = ""
        for _, edge in ipairs(self.edges[node.id]) do
            edges = edges .. ", " .. edge.id
        end
        output = output .. edges:sub(2, #edges) .. "\n"
    end
    print(output)
end

function Graph:getSpanningTree()
    local tree = Graph:new()
    if #self.nodes < 1 then return tree end
    tree:addNode(self.nodes[math.random(#self.nodes)])
    for loops=0,#self.nodes - 1 do
        local foundEdge = false
        local i = 0
        local nodeId = math.random(#tree.nodes)
        local edgeId = 0
        local node = nil
        local edge = nil
        repeat
            nodeId = math.fmod(nodeId + i, #tree.nodes) + 1
            node = tree.nodes[nodeId]
            edgeId = math.random(#self.edges[node.id])
            local j = 0
            repeat
                edgeId = math.fmod(edgeId + j, #self.edges[node.id]) + 1
                edge = self.edges[node.id][edgeId]
                foundEdge = edge and not Collection:new(tree.nodes):contains(edge, function (a, b) return a.id == b.id end)
                j = j + 1
            until foundEdge or j > #self.edges[node.id]
            i = i + 1
        until foundEdge or i > #tree.nodes
        if foundEdge then
            tree:addNode(edge)
            tree:addEdge(node, edge)
        end
    end
    local loops = 1
    while loops < #self.nodes do
        loops = loops + 1
    end
    return tree
end

return Graph
