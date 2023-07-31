SnowMan = table.copy(Enemy)

function SnowMan:new(x, y)
    local object = {
        x = x,
        y = y,
        speed = data.SnowMan.speed,
        hp = data.SnowMan.hp,
        hitbox = Hitbox:new(x, y, x + 16, y + 16),
        
        status = 'idle',

        currentAnimations = {}
    }

    setmetatable(object, self)
    self.__index = self
    return object
end