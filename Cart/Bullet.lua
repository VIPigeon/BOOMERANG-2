Bullet = table.copy(Body)

Bullet.defaultSprite = Sprite:new({373}, 1)

function Bullet:new(x, y)
    local obj = {
        x = x,
        y = y,
        vector = nil,
        speed = data.Bullet.defaultSpeed,
        sprite = Bullet.defaultSprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Bullet:vectorUpdateByTarget(targetCoordX, targetCoordY)
    self.vector = {x = targetCoordX - self.x, y = targetCoordY - self.y}
end

function Bullet:_move()
    self.x = self.x + self.vector.x * self.speed
    self.y = self.y + self.vecotr.y * self.speed
end

function Bullet:update()
    self:_move()
end

function Bullet:draw()
    self.sprite:draw(self.x - 1 - gm.x*8 + gm.sx, self.y - 1 - gm.y*8 + gm.sy, self.flip, self.rotate)
end
