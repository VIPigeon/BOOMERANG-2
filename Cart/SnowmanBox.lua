SnowmanBox = table.copy(Body)

function SnowmanBox:new(x, y, config)
    local object = {
        sprite = data.SnowmanBox.sleepSprite:copy(),
        snowman = MusicSnowman:new(x, y, config),
        snowmanConfig = config,
        x = x,
        y = y,
        playerCheckTimeMs = data.SnowmanBox.playerCheckFrequencyMs,
        wakeUpDistance = data.SnowmanBox.wakeUpDistanceToPlayer,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function SnowmanBox:newFake(x, y, config, snowman)
    local object = {
        sprite = data.SnowmanBox.sleepSprite:copy(),
        snowman = snowman,
        snowmanConfig = config,
        x = x,
        y = y,
        playerCheckTimeMs = data.SnowmanBox.playerCheckFrequencyMs,
        wakeUpDistance = data.SnowmanBox.wakeUpDistanceToPlayer,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function SnowmanBox:activate()
    fakeBox = self:newFake(self.snowman.x, self.snowman.y, self.snowmanConfig, self.snowman)
    table.insert(game.updatables, fakeBox)
    table.insert(game.drawables, fakeBox)
    self.snowman:die()
end

function SnowmanBox:deactivate()
    table.removeElement(game.updatables, self)
end

function SnowmanBox:_distanceToPlayer()
    local dx = self.x - game.player.x
    local dy = self.y - game.player.y
    return math.sqrt(dx*dx + dy*dy)
end

function SnowmanBox:_spawnSnowman()
    self.snowman.awake = true
    self.snowman.boxOfBirth = self
    -- snowman:tuning(self.snowmanConfig.music.beatMap, self.snowmanConfig.music.sfxMap); -- Затюнил 🏎сноумена ☃
    self.snowman:tuning(self.snowmanConfig.music); -- Затюнил 🏎сноумена ☃
    self.snowman.x = self.x
    self.snowman.y = self.y
    table.insert(game.updatables, self.snowman)
    table.insert(game.drawables, self.snowman)
    table.insert(game.collideables, self.snowman)
    table.insert(game.enemies, self.snowman) -- всем привет, пока что он здесь не босс 👾
    self:deactivate()
end

function SnowmanBox:_changeSprite()
    self.sprite = data.SnowmanBox.wokeupSprite:copy()
end

function SnowmanBox:update()
    -- self.checkTimer() -- Можно использовать если метроном не оч 🙄🙄
    if game.metronome.onBeat and self:_distanceToPlayer() < self.wakeUpDistance then
        self:_spawnSnowman()
        self:_changeSprite()
    end
end

function SnowmanBox:draw()
    local x = self.x - gm.x*8 + gm.sx
    local y = self.y - gm.y*8 + gm.sy
    -- Никто не заставит меня вынести это в дату! 😈😈😈
    local whiteColor = 12
    rect(x + 3, y - 2, 11, 2, whiteColor)
    self.sprite:draw(x, y, self.flip, self.rotate)
    rect(x + 3, y + 16, 11, 2, whiteColor)
end
