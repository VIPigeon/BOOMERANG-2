Stack = {}

function Stack:new()
    local obj = {
        items = {},
        head = 1,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Stack:count()
    return self.head - 1
end

function Stack:push(item)
    table.insert(self.items, self.head, item)
    self.head = self.head + 1
end

function Stack:pop()
    item = table.remove(self.items, self.head - 1)
    self.head = self.head - 1

    return item
end
