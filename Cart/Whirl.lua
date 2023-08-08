
Whirl = table.copy(Body)
-- одна из атак Snowman

function Whirl:new(x, y, blowball, angle)
    local object = {
        x = x,
        y = y,
        blowball = blowball,
        trail = {},
        angle = 0,  -- угол, с которым отрисовывается палка.
        stick = Data.Snowman.stick,  -- длина палки
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function Whirl:draw()
    -- здесь отрисовывается stick, blowball и trail
end

function Whirl:update()
    -- меняется угол поворота палки, появляются и убираются следы

    -- в конце вихря blowball запускается в игрока
end

function Whirl:collide(body)
    -- проверяется на пересечение с blowball или trail
end


return Whirl
