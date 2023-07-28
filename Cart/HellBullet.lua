HellBullet = table.copy(Body)

function HellBullet:new()
    local object = {
        x = 0,
        y = 0,
        sprite = data.Bullet.reloadAnimation:copy(),
        hitbox = Hitbox:new(0, 0, 2, 2),
        status = 'idle',
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function HellBullet:setPos(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function HellBullet:nextFrame()
    self.sprite:nextFrame()
end

function HellBullet:update()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
    end
end

function HellBullet:draw()
    self.sprite:draw(self.x - 2 - gm.x*8 + gm.sx, self.y - 2 - gm.y*8 + gm.sy, self.flip, self.rotate)
end
