JustTaraxacum = table.copy(Taraxacum)

function JustTaraxacum:new(x, y)
    local object = {
        x = x,
        y = y,
        hitbox = HitCircle:new(x, y, data.Snowman.whirl.taraxacum.radius),
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function JustTaraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_destroy()
    end
end

function JustTaraxacum:setPos(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function JustTaraxacum:update()
    self:_checkCollision()
end

function JustTaraxacum:draw()
    self.hitbox:draw(data.Taraxacum.color)
end
