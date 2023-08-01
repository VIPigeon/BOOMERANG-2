StaticTaraxacum = table.copy(Taraxacum)

function StaticTaraxacum:new(x, y, bodyLength)
    local object = {
        x = x,
        y = y,
        hitbox = HitCircle:new(x, y, data.Taraxacum.diameter),
        bodyLength = bodyLength,
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

function StaticTaraxacum:_move()
    -- 😣😣😣
end

function StaticTaraxacum:draw()
    local r = self.hitbox.d / 2
    local x = r + self.x - gm.x*8 + gm.sx
    local y = r + self.y - gm.y*8 + gm.sy

    line(x, y, x, y + self.bodyLength, data.Taraxacum.bodyColor)
    self.hitbox:draw(data.Taraxacum.color)
end
