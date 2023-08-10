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
    if not self.isActive then
        return
    end

    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end
    if self:isDeadCheck() then
        self:die()
    end

    self:_focusAnimations()
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
    table.insert(self.currentAnimations, 
        AnimationOver:new(table.chooseRandomElement(data.Enemy.sprites.hurtEffect), 'randomOn', 'activeOnes')
    )
    -- это может оказаться неэффективно 🙄

    self.hp = math.fence(self.hp - damage, 0, self.hp)
end
