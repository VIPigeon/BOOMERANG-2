AutoHellBullet = table.copy(Body)

local trash = Sprite:new({379, 382, 381, 380}, 1)
function AutoHellBullet:new()
    local object = {
        x = 0,
        y = 0,
        speed = data.Bullet.defaultSpeed,
        sprite = trash:copy(),
        hitbox = Hitbox:new_with_shift(0, 0, 2, 2, 1, 1),
        status = 'idle',
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function AutoHellBullet:setPos(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function AutoHellBullet:nextFrame()
    self.sprite:nextFrame()
end

function AutoHellBullet:update()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
    end
end

function AutoHellBullet:draw(color)
    local x = self.x - gm.x*8 + gm.sx
    local y = self.y - gm.y*8 + gm.sy

    self.sprite:draw(self.x - 2 - 8*gm.x + gm.sx, self.y - 2 - 8*gm.y + gm.sy, self.flip, self.rotate)
end
