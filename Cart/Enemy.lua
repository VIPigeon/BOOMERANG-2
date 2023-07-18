Enemy = table.copy(Body)

local start_x = 0
local start_y = 0

Enemy.spriteDefault = data.Enemy.spriteDefault

function Enemy:new(x, y)
    local obj = {
        sprite = data.Enemy.sprites.defaultSprite,
        x = x,
        y = y,
        flip = 0,

        hitbox = Hitbox:new(x, y, x + 8, y + 8),

        hp = data.Enemy.defaultHP,
        isEnemy = true,
    }

    start_x = x
    start_y = y

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Enemy:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    if self:isDeadCheck() then
        self:die()
    end
end

function Enemy:die()
    trace("I AM DEAD!!!")
end

function Enemy:isDeadCheck()
    return self.hp == 0
end

function Enemy:takeDamage(damage)
    trace(damage)
    self.hp = math.fence(self.hp - damage, 0, self.hp)
end

function Enemy.is_enemy(body)
    return body.is_enemy ~= nil and body.is_enemy
end
