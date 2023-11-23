MusicRose = table.copy(LongRose)

function MusicRose:tuning(beatMap, sfxMap)
    -- обязательно вызывается после new для настройки музыки

    self.sfxMap = sfxMap
    self.i_sfxMap = 1

    -- строка из 0, 1, указывающая биты, на которые стреляет роза
    self.beatMap = beatMap
    self.i_beatMap = 1
end


function MusicRose:_full_shot()
    if self.beatMap[self.i_beatMap] == 0 then
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
    if #self.beatMap == 4 then
        if not game.metronome.beat4 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 8 then
        if not game.metronome.beat8 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 6 then
        if not game.metronome.beat6 then
            return
        end
        self:_full_shot()
    end
    self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
end


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

    if self:isDeadCheck() then
        self.sprite = data.Rose.sprites.death:copy()
        self.status = 'dying'
        return
    end

    if not self.isActive then
        return
    end

    self:onBeat()

    if self.status == 'shooting' then
        if self.laserHitbox:collide(game.player.hitbox) then
            game.player:die()
        end
    end
end
