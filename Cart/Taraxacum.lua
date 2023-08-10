Taraxacum = table.copy(Bullet)

function Taraxacum:new(x, y, radius, speed, count, countSlow, countFast, spread)
    radius = radius or data.Taraxacum.radius
    speed = speed or data.Taraxacum.speed
    count = count or data.Taraxacum.deathBulletCount
    countSlow = countSlow or data.Taraxacum.deathBulletSlowCount
    countFast = countFast or data.Taraxacum.deathBulletFastCount
    spread = spread or data.Taraxacum.deathBulletSpread
    local object = {
        x = x,
        y = y,
        vector = {x = 0, y = 0},
        hitbox = HitCircle:new(x, y, radius),
        speed = speed,
        count = count,
        countSlow = countSlow,
        countFast = countFast,
        spread = spread,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function Taraxacum:_launchBullets()
    local spread = self.spread
    local count = self.count

    local function createBulletAtRandomPoint()
        local ran = math.random()
        local angle = (2 * math.pi) * ran
        
        local x = self.x + spread * math.cos(angle)
        local y = self.y + spread * math.sin(angle)

        local bullet = self:_createBullet(x, y)

        local dx = x - self.x
        local dy = y - self.y
        bullet:setVelocity(dx, dy)

        return bullet
    end
    
    for i = 1, count do
        createBulletAtRandomPoint()
    end

    for i = 1, self.countSlow do
        local bullet = createBulletAtRandomPoint()
        bullet.speed = data.Taraxacum.deathSlowBulletSpeed
    end

    for i = 1, self.countFast do
        local bullet = createBulletAtRandomPoint()
        bullet.speed = data.Taraxacum.deathFastBulletSpeed
    end
end

function Taraxacum:_createBullet(x, y)
    local bullet = Bullet:new(x, y, data.Taraxacum.deathBulletSprite)
    bullet.speed = data.Taraxacum.deathBulletSpeed
    
    table.insert(game.updatables, bullet)
    table.insert(game.drawables, bullet)

    return bullet
end

function Taraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_launchBullets()
        self:_destroy()
    end

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
