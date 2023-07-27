BulletHell = table.copy(Enemy)

function BulletHell:new(x, y)
    local bullets = {}
    for i = 1, data.BulletHell.bulletCount do
        bullets[i] = Bullet:new(0, 0)
    end
    local object = {
        x = x,
        y = y,
        spread = data.BulletHell.bulletSpeadRadius,
        bullets = bullets,
        bulletCount = data.BulletHell.bulletCount,
        bulletSpeed = data.BulletHell.bulletSpeed,
        bulletRotateSpeed = 1,
        hitbox = HitCircle:new(x, y, data.BulletHell.circleDiameter),
        time = 0,
        reloadTimeMs = 500,
        status = 'idle',
    }

    BulletHell._moveBullets(object, 0)

    setmetatable(object, self)
    self.__index = self
    return object
end

function BulletHell:shoot()
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

    bullets[minId - 2]:vectorUpdateByTarget(game.player.x, game.player.y)
    self.status = 'reload'
end

function BulletHell:update()
    if game.metronome.on_beat then
        self:shoot()
        self.status = self.status == 'idle' and 'reload' or 'idle'
    end
end

function BulletHell._moveBullets(bullethell, offset)
    local step = 2 * math.pi / bullethell.bulletCount
    for i = 1, bullethell.bulletCount do
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

        self.time = self.time + Time.dt()
        if progress > self.time then
            self.status = 'idle'
            self.time = 0
        end
    end

    self.hitbox:draw(14)
    for i = 1, self.bulletCount do
        self.bullets[i]:draw()
    end
end
