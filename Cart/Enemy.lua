Enemy = table.copy(Body)

function Enemy:new(x, y)
    local obj = {
        sprite = data.Enemy.sprites.ahegaoDeath,
        x = x,
        y = y,
        flip = 0,

        hitbox = Hitbox:new(x, y, x + 8, y + 8),

        hp = data.Enemy.defaultHP,
        isEnemy = true,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Enemy:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
        self.sprite:setFrame(5)
    else
        self.sprite:setFrame(1)
    end
    if self:isDeadCheck() then
        self:die()
    end
end

function Enemy:die()
    trace("I AM DEAD!!!")
    table.removeElement(game.updatables, self)
    table.removeElement(game.drawables, self)
    table.removeElement(game.collideables, self)
end

function Enemy:isDeadCheck()
    return self.hp == 0
end

function Enemy:takeDamage(damage)
    self.hp = math.fence(self.hp - damage, 0, self.hp)
end
