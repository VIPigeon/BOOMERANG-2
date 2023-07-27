Bullet = table.copy(Body)

Bullet.defaultSprite = Sprite:new({373}, 1)

function Bullet:new(x, y)
    local obj = {
        x = x,
        y = y,
        vector = {x = 0, y = 0},
        hitbox = Hitbox:new(x, y, x + 2, y + 2),
        speed = data.Bullet.defaultSpeed,
        sprite = Bullet.defaultSprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Bullet:vectorUpdateByTarget(targetCoordX, targetCoordY)
    self.vector = {x = targetCoordX - self.x, y = targetCoordY - self.y}
    self.vector = math.vecNormalize(self.vector)
end

function Bullet:_move()
    self.x = self.x + self.vector.x * self.speed
    self.y = self.y + self.vector.y * self.speed
    self.hitbox:set_xy(self.x, self.y)
end

function Bullet:_destroy()
    --trace('im destroyed')
    table.removeElement(game.updatables, self)
    table.removeElement(game.drawables, self)
end

function Bullet:_checkCollision()
    --trace('collide!!!!')
    if not self.hitbox:mapCheck() then
        self:_destroy()
    end
end

function Bullet:update()
    self:_checkCollision()
    self:_move()
end

function Bullet:draw()
    self.sprite:draw(self.x - 1 - gm.x*8 + gm.sx, self.y - 1 - gm.y*8 + gm.sy, self.flip, self.rotate)
end
