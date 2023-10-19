BulletHell = table.copy(Enemy)

function BulletHell:new(x, y, config) -- type, color, bulletSprite, config)
    local bullets = {}
    for i = 1, config.bulletCount do -- data.BulletHell.bulletCount[type] do
        bullets[i] = HellBullet:new()
    end

    local color = 14

    local object = {
        x = x,
        y = y,
        type = type,
        spread = config.bulletSpreadRadius,
        bullets = bullets,
        bulletCount = config.bulletCount,
        bulletSpeed = config.bulletSpeed,
        bulletSprite = bulletSprite,
        deathBulletSpeed = config.deathBulletSpeed,
        bulletRotateSpeed = config.bulletRotateSpeed,
        hp = config.hp,
        hitbox = HitCircle:new(x, y, config.circleDiameter),
        time = 0,
        status = '',
        color = color,

        reloadingBullets = {},
        currentAnimations = {},

        isActive = false,
    }

    BulletHell._moveBullets(object, 0)

    setmetatable(object, self)
    self.__index = self
    return object
end

function BulletHell:_selectBullet()
    local minDist = 2147483647
    local minId = -1
    for i, bull in ipairs(self.bullets) do
        local dirX = game.player.x - bull.x
        local dirY = game.player.y - bull.y
        local dist = math.sqrt(dirX * dirX + dirY * dirY)
        if dist < minDist then
            minDist = dist
            minId = i
        end
    end

    local byTouchId = (minId + self.bulletCount - self.bulletCount // 4 - 1) % self.bulletCount + 1
    table.insert(self.reloadingBullets, self.bullets[(byTouchId - 1) % 8 + 1])

    return byTouchId
end

function BulletHell:_shoot()
    local byTouchId = self:_selectBullet()
    local bull = self:_createShootBullet()
    bull.x = self.bullets[byTouchId].x
    bull.y = self.bullets[byTouchId].y
    bull.hitbox:set_xy(bull.x, bull.y)
    local function randomFactor()
        return 16 * (2 * math.random() - 1)
    end
    bull:vectorUpdateByTarget(game.player.x + randomFactor(), game.player.y + randomFactor())
end

function BulletHell:_createShootBullet()
    local bull = Bullet:new(0, 0, self.bulletSprite)
    bull.speed = self.bulletSpeed
    
    table.insert(game.drawables, bull)
    table.insert(game.updatables, bull)

    return bull
end

function BulletHell:launchBulletsAround()
    for i = 1, #self.bullets do
        local bullet = self:_createShootBullet()
        bullet.x = self.bullets[i].x
        bullet.y = self.bullets[i].y
        bullet.hitbox:set_xy(bullet.x, bullet.y)

        local directionX = bullet.x - self.x
        local directionY = bullet.y - self.y

        local speed = self.deathBulletSpeed

        bullet:setVelocity(speed * directionX, speed * directionY)
    end
end

function BulletHell:update()
    if self.status == 'dying' then
        self.deathTick()
        return
    end

    if self:isDeadCheck() then
        self:launchBulletsAround()
        local time = 0
        self.status = 'dying'
        self.deathTick = function()
            time = time + Time.dt()
            if time > data.BulletHell.deathTimeMs then
                self:die()
            end
        end
        return
    end

    if self.hitbox:collide(game.boomer.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end

    if game.metronome.onBeat then
        self:_shoot()
    end

    for i = 1, #self.bullets do
        self.bullets[i]:update()
    end
end

function BulletHell._moveBullets(bullethell, offset)
    trace(bullethell.spread)
    local step = 2 * math.pi / bullethell.bulletCount
    for i = 1, #bullethell.bullets do
        local x = math.round(bullethell.spread * math.cos((i + offset) * step))
        local y = math.round(bullethell.spread * math.sin((i + offset) * step))
        local bullet = bullethell.bullets[i]
        bullet:setPos(bullethell.x + x, bullethell.y + y) --не настоящие пули
    end
end

function BulletHell:draw()
    if self.status == 'dying' then
        self.hitbox:drawOutline(self.color)
        return
    end

    if true then
        local progress = 1 - (game.metronome:msBeforeNextBeat() / game.metronome.msPerBeat)

        self:_moveBullets(progress)

        if #self.reloadingBullets > 0 then
            deletedBullet = nil
            for _, bullet in ipairs(self.reloadingBullets) do
                bullet:nextFrame()
                if bullet.sprite:animationEnd() then
                    deletedBullet = bullet
                end
            end

            if deletedBullet then
                deletedBullet:nextFrame()
                table.removeElement(self.reloadingBullets, deletedBullet)
            end
        end
    end

    self.hitbox:draw(self.color)

    for i = 1, #self.bullets do
        self.bullets[i]:draw(self.color)
    end

    self:_drawAnimations()
end
