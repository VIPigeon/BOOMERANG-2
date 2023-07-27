HellBullet = table.copy(Body)

function HellBullet:new()
    local object = {
        x = 0,
        y = 0,
        sprite = data.Bullet.reloadAnimation:copy(),
        status = 'idle',
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function HellBullet:nextFrame()
    self.sprite:nextFrame()
end

function HellBullet:draw()
    self.sprite:draw(self.x - 2 - gm.x*8 + gm.sx, self.y - 2 - gm.y*8 + gm.sy, self.flip, self.rotate)
end
