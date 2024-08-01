StaticTaraxacum = table.copy(Taraxacum)

function StaticTaraxacum:new(
    x, y, config
)
    local radius = config.staticRadius or error('no config!')
    local speed = config.speed or error('no config!')
    local count = config.deathBulletCount or error('no config!')
    local countSlow = config.deathBulletSlowCount or error('no config!')
    local countFast = config.deathBulletFastCount or error('no config!')
    local spread = config.deathBulletSpread or error('no config!')
    local bodyLength = config.bodyLength or error('no config!')
    local deathBulletSpeed = config.deathBulletSpeed or error('no config!')

    local object = {
        x = x,  -- wtf
        y = y,
        w = 0,
        h = bodyLength,
        config = config,
        radius = radius,
        hitbox = HitCircle:new(x, y, 2 * radius),
        dead = false,
        speed = speed,
        count = count,
        countSlow = countSlow,
        countFast = countFast,
        deathBulletSpeed = deathBulletSpeed,
        spread = spread,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function StaticTaraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_launchBullets()
        self:_destroy()
    end
end

function StaticTaraxacum:_destroy()
    table.removeElement(game.updatables, self)
    self.dead = true
end

function StaticTaraxacum:_move()
    -- 😣😣😣
end

function StaticTaraxacum:draw()
    local x = self.radius + self.x - gm.x*8 + gm.sx - 1
    local y = self.radius + self.y - gm.y*8 + gm.sy - 1
    line(x, y, x + self.w, y + self.h, data.StaticTaraxacum.bodyColor)
    if not self.dead then
        self.hitbox:draw(data.Taraxacum.color)
    end
end
