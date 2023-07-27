Rose = table.copy(Enemy)

Rose.sprite = Sprite:new({389, 391, 393, 395, 397, 421}, 2)

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
    local laserSpeed = 8
    local laserdx = 0
    local laserdy = 0
    local laserbeginx = 0
    local laserbeginy = 0
    local hitboxx1
    local hitboxy1
    local hitboxx2
    local hitboxy2
    if direction == 0 then
        laserdy = -laserSpeed
        laserbeginx = x + 7
        laserbeginy = y + 8
        hitboxx1 = x + 3
        hitboxy1 = y + 7
        hitboxx2 = hitboxx1 + 10
        hitboxy2 = hitboxy1 + 8
    elseif direction == 1 then
        flip = 2
        laserdy = laserSpeed
        laserbeginx = x + 7
        laserbeginy = y + 16 - 8
        hitboxx1 = x + 3
        hitboxy1 = y + 1
        hitboxx2 = hitboxx1 + 10
        hitboxy2 = hitboxy1 + 8
    elseif direction == 2 then
        flip = 1
        rotate = 1
        laserdx = -laserSpeed
        laserbeginx = x + 16 - 8
        laserbeginy = y + 7
        hitboxx1 = x + 7
        hitboxy1 = y + 4
        hitboxx2 = hitboxx1 + 9
        hitboxy2 = hitboxy1 + 8
    else
        rotate = 1
        laserdx = laserSpeed
        laserbeginx = x + 8
        laserbeginy = y + 7
        hitboxx1 = x
        hitboxy1 = y + 4
        hitboxx2 = hitboxx1 + 9
        hitboxy2 = hitboxy1 + 8
    end

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
        speed = laserSpeed,
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

function Rose:draw()
    if self.shooting then
        self.laserHitbox:draw(1)
    end
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
end

function Rose:shoot()
    local laserHitbox = Hitbox:new(self.laserbeginx, self.laserbeginy, self.laserbeginx + 1, self.laserbeginy + 1)

    while laserHitbox:mapCheck() do
        local newx = laserHitbox.x1 + self.laserdx
        local newy = laserHitbox.y1 + self.laserdy
        laserHitbox:set_xy(newx, newy)
    end

    local x = laserHitbox.x1 - self.laserdx
    local y = laserHitbox.y1 - self.laserdy
    laserHitbox:set_xy(x, y)

    while laserHitbox:mapCheck() do
        local newx = laserHitbox.x1 + (self.laserdx / self.speed)
        local newy = laserHitbox.y1 + (self.laserdy / self.speed)
        laserHitbox:set_xy(newx, newy)
    end

    local x = laserHitbox.x1 - self.laserdx / self.speed
    local y = laserHitbox.y1 - self.laserdy / self.speed

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