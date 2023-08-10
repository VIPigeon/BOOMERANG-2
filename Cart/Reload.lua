
Reload = table.copy(Body)

function Reload:new(x, y, radius, angle)
    local object = {
        x = x,
        y = y,
        blowball = StaticTaraxacum:new(x, y, 1, 0),
        final_radius = radius,
        stick = Data.Snowman.stick,  -- длина палки
        angle = angle,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function Reload:draw()
    -- здесь отрисовывается stick и blowball
end

function Reload:update()
    -- увеличивается радиус blowball
end


return Reload