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
    -- BulletHell body
    self.hitCircle:draw()
end
