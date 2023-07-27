BulletHell = table.copy(Enemy)

function BulletHell:new(x, y, circleDiameter, bulletSpreadRadius, bullets)
    local object = {
        x = x,
        y = y,
        spread = bulletSpreadRadius,
        bullets = bullets,
        bulletCount = #bullets,
        hitCircle = HitCircle:new(x, y, circleDiameter),
    }

    setmetatable(object, self)
end

function BulletHell:update()
end

function BulletHell:draw()
    -- BulletHell body
    self.hitCircle:draw()
end
