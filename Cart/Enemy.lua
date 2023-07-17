Enemy = table.copy(Body)

Enemy.defaultSprite = Sprite:new({403}, 1)

function Enemy:new(x, y)
    obj = {
        x = x,
        y = y,
        sprite = Enemy.defaultSprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Enemy:update()
end
