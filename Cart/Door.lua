Door = table.copy(Body)

Door.defaultSprite = Sprite:new({41}, 2)

function Door:new(x, y)
    local obj = {
        x = x,
        y = y,
        sprite = Door.defaultSprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Door:update()
end
