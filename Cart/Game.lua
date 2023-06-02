Game = {}


function Game:new()
    obj = {
        mode = 'action',
        plr = Player:new(10,10),
        levers = Game.addLevers()
    }

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Game.addLevers()
    res = {}
    for x = 0, 239 do
        for y = 0, 135 do
            if mget(x, y) == 1 then
                table.insert(res, Lever:new(x * 8, y * 8))
                --trace(mget(x,y))
            end
        end
    end

    return res
end

function Game:checkLever()
    for i, lever in ipairs(self.levers) do
        if self.plr.boomerang and lever.hitbox:collide(self.plr.boomerang.hitbox) then
            lever:turn(self.plr.boomerang.hitbox)
            --trace(lever:collide(self.plr.boomerang.hitbox))
        end
        lever:draw()
    end
end

function Game:update()
    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy)
    
    self:checkLever()
    self.plr:update()
end


return Game
