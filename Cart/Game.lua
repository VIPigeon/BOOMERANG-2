Game = {}


function Game:new()
    obj = {
        mode = 'action',
        plr = Player:new(10,10)
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

sx = 0
sy = 0

function Game:update()
    map(gm.x, gm.y , 30, 17, sx, sy)
    
    self.plr:update()
end


return Game