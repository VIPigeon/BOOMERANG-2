
Game = {}


function Game:new()
    obj = {
        mode = 'debug'
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end


function Game:update()
    rect(1, 1, 10, 10, 2)
end


return Game
