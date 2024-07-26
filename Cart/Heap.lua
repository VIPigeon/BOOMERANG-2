Heap = {}
Heap.Node = {}

function Heap.Node:new(key)
    local obj = {
        key = key,
        i = nil
    }
    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Heap.Node:write()
    io.write("Node\tkey="..self.key.."\ti="..self.i.."\n")
end

-- function Heap.compare(node1, node2)
--     return node1.key > node2.key
-- end

function Heap:new(content)
    local obj = {
        tree = content,
        size = #content + 1,
        compare = function(node1, node2)
            return node1.key > node2.key;
        end,
    }
    setmetatable(obj, self)
    self.__index = self
    return obj
end


function Heap:buildHeap()
    for i, node in ipairs(self.tree) do
        node.i = i  -- установление начальных индексов
    end
    for i = self.size // 2, 1, -1 do
        self:heapify(i)
    end
end

function Heap:heapify(i)
    local left = 2 * i
    local right = 2 * i + 1
    local largest = i
    if left < self.size and not self.compare(self.tree[left], self.tree[largest]) then
        largest = left
    end
    if right < self.size and not self.compare(self.tree[right], self.tree[largest]) then
        largest = right
    end

    if largest == i then
        return
    end

    local swapVar = self.tree[largest]
    self.tree[largest] = self.tree[i]
    self.tree[i] = swapVar
    self.tree[i].i = i; self.tree[largest].i = largest;

    self:heapify(largest)
end

function Heap:push(node)
    self.tree[self.size] = node
    self.size = self.size + 1;
    node.i = self.size - 1
    self:increaseKey(node.i, node.key);
end

function Heap:increaseKey(i, key)
    self.tree[i].key = key
    -- io.write(self.tree[i].key.." ")
    while i > 1 and not self.compare(self.tree[i], self.tree[i // 2]) do
    -- while i > 0 and not (self.tree[i].key > self.tree[i // 2].key) do
        local swapVar = self.tree[i]
        self.tree[i] = self.tree[i // 2]
        self.tree[i // 2] = swapVar
        self.tree[i].i = i; self.tree[i//2].i = i//2;
        i = i // 2
    end
end

function Heap:pull()
    local res = self.tree[1];
    self.size = self.size - 1;
    self.tree[1] = self.tree[self.size];
    table.remove(self.tree, nil)  -- remove last element
    self:heapify(1);
    return res.key;
end

function Heap:print()
    for i, e in ipairs(self.tree) do
        e:write()
    end
    io.write("\n")
end

function Heap:empty()
    return #self.tree == 0;
end

--[[
-- Ссылочная структура работает. Вот пруфы:
node1 = Heap.Node:new(1)
node2 = Heap.Node:new(2)
node3 = Heap.Node:new(3)
t = {node1, node2, node3}
print(t[1].key .." ".. t[2].key)
tmp = t[1]
t[1] = t[2]
t[2] = tmp
print(t[1].key .." ".. t[2].key)
t[2].key = 5
print(node1.key .." ".. node2.key)
--]]

--[[
-- Отладка
node = Heap.Node:new(70)
h = Heap:new{Heap.Node:new(1),
Heap.Node:new(2),
Heap.Node:new(4),
Heap.Node:new(-5),
Heap.Node:new(6),
Heap.Node:new(8),
Heap.Node:new(9),
node
}
h:buildHeap()
h:print()
io.write(h:pull().."\n")
io.write(h:pull().."\n")
io.write(h:pull().."\n")
io.write(h:pull().."\n")
io.write(h:pull().."\n")
h:push(Heap.Node:new(-48))
h:push(Heap.Node:new(8))
h:push(Heap.Node:new(4))
h:push(Heap.Node:new(50))
h:push(Heap.Node:new(23))
h:print()
h:increaseKey(node.i, 2)
h:print()
--]]
