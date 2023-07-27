BulletHell = table.copy(Enemy)

function BulletHell:new(x, y)
    local bullets = {}
    for i = 1, bulletCount do
        bullets[i] = Bullet:new(0, 0)
    end
    local object = {
        x = x,
        y = y,
        spread = data.BulletHell.bulletSpeadRadius,
        bullets = bullets,
        bulletCount = data.BulletHell.bulletCount,
        bulletSpeed = data.BulletHell.bulletSpeed
        bulletRotateSpeed = 1,
        status = 'idol'
        hitbox = HitCircle:new(x, y, data.BulletHell.circleDiameter),
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function BulletHell:shoot()
    local minDist = 2147483647
    local minId = -1
    for i, bull in ipairs(self.bullets) do
        local dist = math.sqrt(math.sqr(game.player.x - bull.x) + math.sqr(game.player.y - bull.y))
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
    end
end

function BulletHell:draw()
    trace('hello')
    self.hitbox:draw()

    local step = math.pi / self.bulletCount
    for i = 1, self.bulletCount do
        local x = self.spread * math.cos(i * step)
        local y = self.spread * math.sin(i * step)
        local bullet = self.bullets[i]
        bullet.x = x
        bullet.y = y
    end
end
