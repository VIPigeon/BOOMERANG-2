Lever = table.copy(Body)

Lever.defaultSprite = Sprite:new({1}, 1)

function Lever:new(x, y)
    obj = {
        x = x,
        y = y,
        sprite = Lever.defaultSprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Lever:update()
end
