HellBullet = table.copy(Body)

function HellBullet:new()
    local object = {
        x = 0,
        y = 0,
        speed = data.Bullet.defaultSpeed,
        sprite = data.Bullet.reloadAnimation:copy(),
        hitbox = Hitbox:new_with_shift(0, 0, 2, 2, 1, 1),
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

function HellBullet:draw(color)
    local x = self.x - gm.x*8 + gm.sx
    local y = self.y - gm.y*8 + gm.sy

    self.hitbox:draw(color)
end
