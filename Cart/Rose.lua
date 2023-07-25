Rose = table.copy(Enemy)

Rose.sprite = Sprite:new({389, 391, 393, 395, 397, 421}, 2)

-- ЧТО??!
local ANIMATION_FRAME_DURATION_MS = 16
local ROSE_ANIMATION_DURATION_MS = ANIMATION_FRAME_DURATION_MS * #Rose.sprite.animation
local LASER_WIDTH = 3

function Rose:new(x, y, direction)
    -- direction:
    -- 0 - up
    -- 1 - down
    -- 2 - left
    -- 3 - right
    local flip = 0
    local rotate = 0
    local laserdx = 0
    local laserdy = 0
    local laserbeginx = 0
    local laserbeginy = 0
    if direction == 0 then
        laserdy = -1
        laserbeginx = x + 7
        laserbeginy = y + 8
    elseif direction == 1 then
        flip = 2
        laserdy = 1
        laserbeginx = x + 7
        laserbeginy = y + 16 - 8
    elseif direction == 2 then
        flip = 1
        rotate = 1
        laserdx = -1
        laserbeginx = x + 16 - 8
        laserbeginy = y + 7
    else
        rotate = 1
        laserdx = 1
        laserbeginx = x + 8
        laserbeginy = y + 7
    end

    local hitboxx1 = math.min(laserbeginx - 6, laserbeginx + 6)
    local hitboxy1 = math.min(laserbeginy - 6, laserbeginy + 6)
    local hitboxx2 = math.max(laserbeginx - 6, laserbeginx + 6)
    local hitboxy2 = math.max(laserbeginy - 6, laserbeginy + 6)

    obj = {
        sprite = Rose.sprite:copy(),
        x = x,
        y = y,
        flip = flip,
        rotate = rotate,

        hitbox = Hitbox:new(hitboxx1, hitboxy1, hitboxx2, hitboxy2),
        laserbeginx = laserbeginx,
        laserbeginy = laserbeginy,
        laserdx = laserdx,
        laserdy = laserdy,
        laserHitbox = Hitbox:new(x + 7, y + 11 - 20, x + 7 + 3, y + 11),
        direction = direction,

        hp = 50,

        shooting = false,
        ticks = 0,
        ticksBeforeShot = 1,
        ticksShooting = 2,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Rose:onBeat()
    self.ticks = self.ticks + 1

    if not self.shooting then
        if self.ticks == self.ticksBeforeShot then
        self.laserHitbox:draw(1)
            self.shooting = true
            self:shoot()
            self.ticks = 0
        end
    else
        if self.ticks == self.ticksShooting then
            self.shooting = false
            self.sprite:setFrame(1)
            self.ticks = 0
        end
    end
end

function Rose:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    if self:isDeadCheck() then
        self:die()
    end

    if game.metronome.on_beat then
        self:onBeat()
    end

    if self.shooting then
        self.animation_playing = false
        self.laserHitbox:draw(1)
        if self.laserHitbox:collide(game.player.hitbox) then
            game.player:die()
        end
    elseif game.metronome:msBeforeNextBeat() <= ROSE_ANIMATION_DURATION_MS and not self.animation_playing then
        self.animation_playing = true
    end

    if self.animation_playing and not self.sprite:animationEnd() then
        self.sprite:nextFrame()
    end
end

-- Потом это куда-то убрать
local function is_in_bounds(hitbox)
    return hitbox.x1 >= 0 and hitbox.x2 <= 240 and
        hitbox.y1 >= 0 and hitbox.y2 <= 136
end

function Rose:shoot()
    local laserHitbox = Hitbox:new(self.laserbeginx, self.laserbeginy, self.laserbeginx + 1, self.laserbeginy + 1)

    while laserHitbox:mapCheck() and is_in_bounds(laserHitbox) do
        local newx = laserHitbox.x1 + self.laserdx
        local newy = laserHitbox.y1 + self.laserdy
        laserHitbox:set_xy(newx, newy)
    end

    local x = laserHitbox.x1 - self.laserdx
    local y = laserHitbox.y1 - self.laserdy

    local newHitbox
    if self.direction == 0 then
        newHitbox = Hitbox:new(x, y, x + LASER_WIDTH, self.laserbeginy)
    elseif self.direction == 1 then
        newHitbox = Hitbox:new(x, self.laserbeginy, x + LASER_WIDTH, y)
    elseif self.direction == 2 then
        newHitbox = Hitbox:new(x, y, self.laserbeginx, y + LASER_WIDTH)
    else
        newHitbox = Hitbox:new(self.laserbeginx, y, x, y + LASER_WIDTH)
    end

    self.laserHitbox = newHitbox
end
