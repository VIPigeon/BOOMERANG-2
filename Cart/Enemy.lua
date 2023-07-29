Enemy = table.copy(Body)

function Enemy:new(x, y)
    local obj = {
        sprite = data.Enemy.sprites.defaultSprite,
        x = x,
        y = y,
        flip = 0,

        hitbox = Hitbox:new(x, y, x + 8, y + 8),

        hp = data.Enemy.defaultHP,
        isEnemy = true,
        status = 'angry',
        hurtAnimations = {
            AnimationOver:new(data.Enemy.animations.hurtingHorizontal), 
            AnimationOver:new(data.Enemy.animations.hurtingVertical)
        },
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Enemy:draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)

    for _, hurtAnime in ipairs(self.hurtAnimations) do -- отрисуем все анимации вреда
        hurtAnime:play()
    end
end

function Enemy:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end
    if self:isDeadCheck() then
        self:die()
    end

    self:_statusDependingUpdate()

    
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

function Enemy:_statusDependingUpdate()
    if self.status == 'hurt' then
        for _, hurtAnime in ipairs(self.hurtAnimations) do -- включим все анимации вреда
            hurtAnime:focus(self.x, self.y)
            hurtAnime:activateSingleTime()
        end
    end

    self.status = 'angry'
end

function Enemy:takeDamage(damage)
<<<<<<< Updated upstream
=======
    self.status = 'hurt'
>>>>>>> Stashed changes
    self.hp = math.fence(self.hp - damage, 0, self.hp)
end
