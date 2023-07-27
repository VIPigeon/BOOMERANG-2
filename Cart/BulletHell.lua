BulletHell = table.copy(Enemy)

function BulletHell:new(x, y, circleDiameter, bulletSpreadRadius, bullets)
    local object = {
        x = x,
        y = y,
        spread = bulletSpreadRadius,
        bullets = bullets,
        bulletCount = #bullets,
        bulletSpeed = 0.5,
        bulletRotateSpeed = 1,
        hitCircle = HitCircle:new(x, y, circleDiameter),
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

    bullets[minId - 2]:shoot()
end

function BulletHell:update()
    if game.metronome.on_beat then
        self:shoot()
    end
end

function BulletHell:draw()
    self.hitCircle:draw()

    local step = math.pi / self.bulletCount
    for i = 1, self.bulletCount do
        local x = self.spread * math.cos(i * step)
        local y = self.spread * math.sin(i * step)
        local bullet = bullets[i]
        bullet.x = x
        bullet.y = y
    end
end
