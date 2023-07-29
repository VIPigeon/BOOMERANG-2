Particle = table.copy(Body)

function Particle:new(x, y, sprite)
    local object = {
        x = x,
        y = y,
        velocity = {x = 0, y = 0},
        sprite = sprite:copy()
    }

    table.insert(game.updatables, object)
    table.insert(game.drawables, object)

    setmetatable(object, self)
    self.__index = self
    return object
end

function Particle:setVelocity(x, y)
    self.velocity = {x=x, y=y}
end

function Particle:_move()
    self.x = self.x + self.velocity.x
    self.y = self.y + self.velocity.y
end

function Particle:update()
    self:_move()
end

function Particle:draw()
    self.sprite:draw(self.x - 1 - gm.x*8 + gm.sx, self.y - 1 - gm.y*8 + gm.sy, self.flip, self.rotate)
end
