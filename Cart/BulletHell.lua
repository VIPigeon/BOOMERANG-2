BulletHell = table.copy(Enemy)

function BulletHell:new(x, y)
    local bullets = {}
    for i = 1, data.BulletHell.bulletCount do
        bullets[i] = HellBullet:new()
    end

    local object = {
        x = x,
        y = y,
        spread = data.BulletHell.bulletSpeadRadius,
        bullets = bullets,
        bulletCount = data.BulletHell.bulletCount,
        bulletSpeed = data.BulletHell.bulletSpeed,
        bulletRotateSpeed = 1,
        hitcircle = HitCircle:new(x, y, data.BulletHell.circleDiameter),
        time = 0,
        reloadTimeMs = 500, -- TODO: Move to Data
        status = 'idle',
        reloadingBullet = nil,
    }
    object.hitbox = object.hitcircle.hb

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
    self.reloadingBullet = self.bullets[minId]
    bull.x = self.bullets[minId].x
    bull.y = self.bullets[minId].y
    bull.hitbox:set_xy(bull.x, bull.y)
    bull:vectorUpdateByTarget(game.player.x, game.player.y)
    self.status = 'reload'
end

function BulletHell:_createShootBullet()
    local bull = Bullet:new(0, 0)

    table.insert(game.drawables, bull)
    table.insert(game.updatables, bull)

    return bull
end

function BulletHell:update()
    if game.metronome.on_beat then
        self:_shoot()
    end
end

function BulletHell._moveBullets(bullethell, offset)
    local step = 2 * math.pi / bullethell.bulletCount
    for i = 1, #bullethell.bullets do
        local x = math.round(bullethell.spread * math.cos((i + offset) * step))
        local y = math.round(bullethell.spread * math.sin((i + offset) * step))
        local bullet = bullethell.bullets[i]
        bullet.x = bullethell.x + x
        bullet.y = bullethell.y + y
    end
end

function BulletHell:draw()
    if self.status == 'reload' then
        local progress = self.time / self.reloadTimeMs

        self:_moveBullets(progress)

        if self.reloadingBullet then
            if self.reloadingBullet.sprite:animationEnd() then
                self.reloadingBullet:nextFrame()
                self.reloadingBullet = nil
            else
                self.reloadingBullet:nextFrame()
            end
        end

        self.time = self.time + Time.dt()
        if self.time > self.reloadTimeMs then
            self.status = 'idle'
            self.time = 0
        end
    end

    self.hitbox:draw(14)
    for i = 1, #self.bullets do
        self.bullets[i]:draw()
    end
end
