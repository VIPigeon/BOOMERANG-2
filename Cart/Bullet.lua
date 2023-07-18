Bullet = table.copy(Body)

Bullet.defaultSprite = Sprite:new({162}, 1)

function Bullet:new(x, y)
    local obj = {
        x = x,
        y = y,
        sprite = Bullet.defaultSprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Bullet:update()
end
