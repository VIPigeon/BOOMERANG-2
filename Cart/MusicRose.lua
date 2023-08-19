
MusicRose = table.copy(LongRose)
-- MusicRose.idle_sprite = Sprite:new()
-- MusicRose.shooting_sprite = Sprite:new()


-- function MusicRose:tuning(beatMap, noteMap, soundMap, durationTable, volumeTable, speedTable, channel)
function MusicRose:tuning(beatMap, sfxMap)
    -- обязательно вызывается после new для настройки музыки

    -- строка из 0, 1, указывающая биты, на которые начинает стрелять роза
    self.beatMap = beatMap
    self.i_beatMap = 1

    self.sfxMap = sfxMap
    self.i_sfxMap = 1
end


function MusicRose:full_shot()
    if self.beatMap[self.i_beatMap] == '0' then
        self.status = 'idle'
        self.sprite = data.Rose.sprites.idle
        return
    end
    self.status = 'shooting'
    self.sprite = data.Rose.sprites.shooting
    self:shoot()

    local sound = self.sfxMap[self.i_sfxMap]
    sfx(sound[1],
        sound[2],
        sound[3],
        sound[4],
        sound[5],
        sound[6]
    )

    self.i_sfxMap = (self.i_sfxMap % #self.sfxMap) + 1
end


function MusicRose:onBeat()
    -- trace(#self.beatMap)
    if #self.beatMap == 4 then
        if not game.metronome.beat4 then
            return
        end
        -- sfx(1, 'G-4', -1, 3, 12, 0)
        self:full_shot()
    end
    self.i_beatMap = (self.i_beatMap + 1) % #self.beatMap
end


-- function MusicRose:handleBeat()
    -- if game.metronome.onBeat then
    --     self:onBeat()
    -- end
    -- if self.status == 'shooting' and self.i_beatMap == '0' then
    --     self.status = 'shootEnd'
    -- end
-- end

-- function MusicRose:onBeat()
--     self.ticks = self.ticks + 1

--     if self.status == 'shootBegin' then
--         if self.ticks == self.ticksBeforeShot then
--             -- self.status = 'shooting'
--             self:full_shot()
--             self.ticks = 0
--         end
--     elseif self.status == 'shooting' then
--         if self.ticks == self.ticksShooting then
--             self.status = 'shootEnd'
--             self.ticks = 0
--         end
--     end
--     self.i_beatMap = (self.i_beatMap % #self.i_beatMap) + 1
-- end

function MusicRose:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end
    
    if self.status == 'dying' then
        self.sprite:nextFrame()
        if self.sprite:animationEnd() then
            self:die()
        end
        return
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end

    -- self:handleBeat()

    if self:isDeadCheck() then
        self.sprite = data.Rose.sprites.death:copy()
        self.status = 'dying'
        return
    end

    -- if game.metronome.onBass then
    self:onBeat()
    -- end

    if self.status == 'shooting' then
        if self.laserHitbox:collide(game.player.hitbox) then
            game.player:die()
        end
    end
    -- trace(self.status)
end
