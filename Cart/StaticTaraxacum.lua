StaticTaraxacum = table.copy(Taraxacum)

function StaticTaraxacum:new(x, y)
    local object = {
        x = x,
        y = y,
        hitbox = HitCircle:new(x, y, data.Taraxacum.diameter),
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
    table.removeElement(game.drawables, self)
    table.removeElement(game.collideables, self)
end

function StaticTaraxacum:_move()
    -- 😣😣😣
end

function StaticTaraxacum:draw()
    self.hitbox:draw(data.Taraxacum.color)
end
