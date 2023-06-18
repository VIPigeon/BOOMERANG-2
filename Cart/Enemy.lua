Enemy = table.copy(Body)

local start_x = 0
local start_y = 0

Enemy.spriteDefault = Sprite:new({403}, 1)

function Enemy:new(x, y)
    obj = {
        sprite = Enemy.spriteDefault,
        x = x,
        y = y,
        flip = 0,

        hitbox = Hitbox:new(x, y, x + 8, y + 8),

        hp = 50,
        isDead = false,
        isEnemy = true,
    }

    start_x = x
    start_y = y

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Enemy:update()
end

function Enemy.is_enemy(body)
    return body.is_enemy ~= nil and body.is_enemy
end
