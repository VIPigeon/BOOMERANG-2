Game = {}


function Game:new()
    obj = {
        mode = 'debug',
        plr = Player:new(10,10)
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end


function Game:update()
    self.plr:update()
end


return Game
