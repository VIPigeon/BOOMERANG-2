BulletHell = table.copy(Enemy)

function BulletHell:new(x, y, type)
    local bullets = {}
    for i = 1, data.BulletHell.bulletCount[type] do
        bullets[i] = HellBullet:new()
    end

    local object = {
        x = x,
        y = y,
        type = type,
        spread = data.BulletHell.bulletSpeadRadius[type],
        bullets = bullets,
        bulletCount = data.BulletHell.bulletCount[type],
        bulletSpeed = data.BulletHell.bulletSpeed[type],
        bulletRotateSpeed = data.BulletHell.bulletRotateSpeed[type],
        hp = data.BulletHell.hp[type],
        hitbox = HitCircle:new(x, y, data.BulletHell.circleDiameter[type]),
        time = 0,
        status = 'idle',
        reloadingBullets = {},
    }
    -- object.hitbox = object.hitcircle.hb

    BulletHell._moveBullets(object, 0)

    setmetatable(object, self)
    self.__index = self
    return object
end

function BulletHell:_shoot()
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

    local bull = self:_createShootBullet()
    local byTouchId = (minId + data.BulletHell.bulletCount[self.type] - data.BulletHell.bulletCount[self.type] // 4 - 1) % data.BulletHell.bulletCount[self.type] + 1
    table.insert(self.reloadingBullets, self.bullets[(byTouchId - 1) % 8 + 1])
    bull.x = self.bullets[byTouchId].x
    bull.y = self.bullets[byTouchId].y
    bull.hitbox:set_xy(bull.x, bull.y)
    bull:vectorUpdateByTarget(game.player.x, game.player.y)
    self.status = 'reload'
end

function BulletHell:_createShootBullet()
    local bull = Bullet:new(0, 0)
    bull.speed = self.bulletSpeed
    
    table.insert(game.drawables, bull)
    table.insert(game.updatables, bull)

    return bull
end

function BulletHell:update()
    if game.metronome.on_beat then
        self:_shoot()
    end

    if self.hitbox:collide(game.boomer.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    if self:isDeadCheck() then
        self:die()
    end

    for i = 1, #self.bullets do
        self.bullets[i]:update()
    end
end

function BulletHell._moveBullets(bullethell, offset)
    local step = 2 * math.pi / bullethell.bulletCount
    for i = 1, #bullethell.bullets do
        local x = math.round(bullethell.spread * math.cos((i + offset) * step))
        local y = math.round(bullethell.spread * math.sin((i + offset) * step))
        local bullet = bullethell.bullets[i]
        bullet:setPos(bullethell.x + x, bullethell.y + y) --не настоящие пули
    end
end

function BulletHell:draw()
    if true then
        local progress = 1 - (game.metronome:msBeforeNextBeat() / game.metronome.ms_per_beat)

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

    self.hitbox:draw(14)
    for i = 1, #self.bullets do
        self.bullets[i]:draw()
    end
end
