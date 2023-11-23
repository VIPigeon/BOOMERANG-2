SnowmanWhirlAttack = {}

function SnowmanWhirlAttack:new(x, y, bodyLength)
    local endX = x + bodyLength
    local endY = y
    local object = {
        x = x,
        y = y,
        bodyLength = bodyLength,
        rotationSpeed = data.Snowman.whirl.rotationSpeed,
        particlesEmitDelayMs = data.Snowman.whirl.particleEmitDelayMs,
        angle = 0,
        taraxacum = JustTaraxacum:new(endX, endY),
    }

    local time = 0
    object.whirlParticleTimer = function()
        time = time + Time.dt()
        if time > object.particlesEmitDelayMs then
            time = 0
            return true
        end

        return false
    end

    setmetatable(object, self)
    self.__index = self
    return object
end

function SnowmanWhirlAttack:endAttack()
    local taraxacum = Taraxacum:new(
        self.x, self.y,
        data.Snowman.whirl.taraxacum.radius,
        data.Snowman.whirl.endTaraxacumSpeed,
        data.Snowman.whirl.taraxacum.deathBulletCount,
        data.Snowman.whirl.taraxacum.deathSlowBulletCount,
        data.Snowman.whirl.taraxacum.deathFastBulletCount
    )
    vec = aim.superAim(self.x, self.y, data.Snowman.whirl.endTaraxacumSpeed)
    taraxacum:setVelocity(vec.x, vec.y)
    table.insert(game.updatables, taraxacum)
    table.insert(game.drawables, taraxacum)
    self.snowman.taraxacum.status = 'needReload'
    -- 😚😚
end

function SnowmanWhirlAttack:_spawnParticle()
    local halfWhirlParticle = 8 / 2
    local endX = self.x - halfWhirlParticle + self.bodyLength * math.cos(self.angle)
    local endY = self.y - halfWhirlParticle + self.bodyLength * math.sin(self.angle)
    local whirl = Whirl:new(endX, endY, data.Snowman.whirl.fadeTimeMs)

    table.insert(game.updatables, whirl)
    table.insert(game.drawables, whirl)
end

function SnowmanWhirlAttack:update()
    self.angle = self.angle + self.rotationSpeed * Time.dt()
    local x = self.x + self.bodyLength * math.cos(self.angle)
    local y = self.y + self.bodyLength * math.sin(self.angle)
    self.taraxacum:setPos(x, y)
    self.taraxacum:update()

    if self.whirlParticleTimer() then
        self:_spawnParticle()
    end
end

function SnowmanWhirlAttack:draw()
    local x = self.x - 8 * gm.x + gm.sx
    local y = self.y - 8 * gm.y + gm.sy
    local endX = x + self.bodyLength * math.cos(self.angle)
    local endY = y + self.bodyLength * math.sin(self.angle)
    line(x, y, endX, endY, data.Snowman.specialTaraxacum.bodyColor)

    self.taraxacum:draw()

    local armLength = self.bodyLength / 3
    local armX = x + armLength * math.cos(self.angle)
    local armY = y + armLength * math.sin(self.angle)
    
    -- МАГИЧЕСКИЕ ЧИСЛА 👽👽👽👺
    -- left arm
    line (x - 2, y - 2, armX, armY, data.Snowman.color)
    -- right arm
    line (x + 2, y - 2, armX, armY, data.Snowman.color)
end
