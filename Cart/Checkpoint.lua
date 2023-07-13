Checkpoint = {}

function Checkpoint:new()
    obj = {}

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Checkpoint:update()
end

function Checkpoint:draw()
end
