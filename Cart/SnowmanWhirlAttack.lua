SnowmanWhirlAttack = {}

function SnowmanWhirlAttack:new(x, y, bodyLength)
    local object = {
        x = x,
        y = y,
        bodyLength = bodyLength,
        rotationSpeed = data.Snowman.whirl.rotationSpeed,
        particlesEmitDelayMs = data.Snowman.whirl.particleEmitDelayMs,
        angle = 0,
        taraxacum = nil, -- TODO: Taraxacum!!
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
    -- 😚😚
end

function SnowmanWhirlAttack:_spawnParticle()
    local endX = self.x + self.bodyLength * math.cos(self.angle)
    local endY = self.y + self.bodyLength * math.sin(self.angle)
    local whirl = Whirl:new(endX, endY, data.Snowman.whirl.fadeTimeMs)

    table.insert(game.updatables, whirl)
    table.insert(game.drawables, whirl)
end

function SnowmanWhirlAttack:update()
    self.angle = self.angle + self.rotationSpeed * Time.dt()
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
end
