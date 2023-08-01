Dandelion = table.copy(Bullet)

function Dandelion:new(x, y)
    local obj = {
        sprite = data.Dandelion.sprites.defaultSprite,
        x = x,
        y = y,
        flip = 0,

        hitbox = Hitbox:new(x, y, x + 8, y + 8),

        hp = data.Dandelion.defaultHP,
        isEnemy = true,
        currentAnimations = {},
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end