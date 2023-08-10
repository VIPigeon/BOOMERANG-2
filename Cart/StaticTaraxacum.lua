StaticTaraxacum = table.copy(Taraxacum)

function StaticTaraxacum:new(x, y, radius, bodyLength)
    local object = {
        x = x,
        y = y,
        w = 0,
        h = bodyLength,
        radius = radius,
        hitbox = HitCircle:new(x, y, 2 * radius),
        dead = false,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function StaticTaraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_launchBullets()
        self:_destroy()
    end
end

function StaticTaraxacum:_destroy()
    table.removeElement(game.updatables, self)
    self.dead = true
end

function StaticTaraxacum:_move()
    -- 😣😣😣
end

function StaticTaraxacum:draw()
    local x = self.radius + self.x - gm.x*8 + gm.sx - 1
    local y = self.radius + self.y - gm.y*8 + gm.sy - 1
    line(x, y, x + self.w, y + self.h, data.Taraxacum.bodyColor)
    if not self.dead then
        self.hitbox:draw(data.Taraxacum.color)
    end
end
