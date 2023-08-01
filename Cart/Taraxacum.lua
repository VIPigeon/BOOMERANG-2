Taraxacum = table.copy(Bullet)

function Taraxacum:new(x, y)
    local obj = {
        x = x,
        y = y,
        vector = {x = 0, y = 0},
        hitbox = HitCircle:new(x, y, data.Taraxacum.diameter),
        speed = data.Taraxacum.speed,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Taraxacum:_launchBullets()
    local spread = data.Taraxacum.deathBulletSpread
    local count = data.Taraxacum.deathBulletCount
    local deltaAngle = 2 * math.pi / count
    
    for i = 1, count do
        local x = self.x + math.round(spread * math.cos(i * deltaAngle))
        local y = self.y + math.round(spread * math.sin(i * deltaAngle))

        local bullet = self:_createBullet(x, y)

        local dx = x - self.x
        local dy = y - self.y
        bullet:setVelocity(dx, dy)
    end
end

function Taraxacum:_createBullet(x, y)
    local bullet = Bullet:new(x, y, data.Taraxacum.deathBulletSprite)
    bullet.speed = data.Taraxacum.deathBulletSpeed
    
    table.insert(game.drawables, bullet)
    table.insert(game.updatables, bullet)

    return bullet
end

function Taraxacum:_checkCollision()
    if not self.hitbox:mapCheck() then
        self:_launchBullets()
        self:_destroy()
    end
end

function Taraxacum:setVelocity(x, y)
    self.vector = {x=x, y=y}
end

function Taraxacum:draw()
    self.hitbox:draw(data.Taraxacum.color)
end