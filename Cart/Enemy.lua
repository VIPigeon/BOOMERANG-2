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
        currentAnimations = {},

        isActive = false, -- активируется, когда в зону входит игрок
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Enemy:_drawAnimations()
    for _, anime in ipairs(self.currentAnimations) do
        anime:play()
    end
end

function Enemy:_focusAnimations()
    local center = self.hitbox:get_center()
    local width = self.hitbox:getWidth()
    local height = self.hitbox:getHeight()
    -- чтобы анимация проигрывалась вокруг противника равномерно

    local x1 = center.x - width
    local x2 = center.x
    local y1 = center.y - height
    local y2 = center.y 
    for _, anime in ipairs(self.currentAnimations) do
        anime:focus(x1, y1, x2, y2)
    end
end

function Enemy:draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)

    self:_drawAnimations()
end

function Enemy:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end
    
    if self:isDeadCheck() then
        self:die()
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end
end

function Enemy:die()
    -- Это самый древний trace в нашей кодовой базе! 🦖
    trace("I AM DEAD!!!")
    if self.deathSound ~= nil then
        local sound = self.deathSound
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
    else
        trace('Возможно ошибка: У врага нету звука смерти')
    end
    table.removeElement(game.updatables, self)
    table.removeElement(game.drawables, self)
    table.removeElement(game.collideables, self)
end

function Enemy:isDeadCheck()
    return self.hp == 0
end

function Enemy:takeDamage(damage)
    table.insert(self.currentAnimations,
        AnimationOver:new(table.chooseRandomElement(data.Enemy.sprites.hurtEffect), 'randomOn', 'activeOnes')
    )
    -- это может оказаться неэффективно

    self.hp = math.fence(self.hp - damage, 0, self.hp)

    if self.hp >= 0 and self.damageSound ~= nil then
        -- kawaii-Code@boomerang2.com:
        -- Я сначала копипастил код звука в update каждому врагу отдельно, и вот
        -- какие комментарии я при этом оставлял (в хронологическом порядке):
        --
        -- 1. А может это отправить в takeDamage?
        --
        -- 2. Ну, по-хорошему нужно отправить, чтобы переиспользовать важный код.
        --
        -- 3. Можно даже использовать вместо EnemyDeathSounds EnemyConfig!
        -- Тогда takeDamage будет универсальным для всех! Какая отличная
        -- идея! 😊

        if game.metronome.beat16 then
            -- Этот код у меня компилировался!!! Что? 😫
            -- local sound game.soundsQueue:dequeue()
            local sound = self.damageSound
            sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
        end
    end

end
