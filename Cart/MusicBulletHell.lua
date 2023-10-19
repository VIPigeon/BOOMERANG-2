MusicBulletHell = table.copy(BulletHell)

function MusicBulletHell:tuning(beatMap, sfxMap)
    -- обязательно вызывается после new для настройки музыки
    
    self.sfxMap = sfxMap
    self.i_sfxMap = 1

    -- строка из 0, 1, указывающая биты, на которые стреляет роза
    self.beatMap = beatMap
    self.i_beatMap = 1
end

function MusicBulletHell:_full_shot()
    if self.beatMap[self.i_beatMap] == 0 then
        return
    end
    self:_shoot()

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

function MusicBulletHell:onBeat()
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
    elseif #self.beatMap == 24 then
        self:_full_shot()
    elseif #self.beatMap == 6 then
        if not game.metronome.beat6 then
            return
        end
        self:_full_shot()
    end
    self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
end

function MusicBulletHell:update()
    if self.status == 'dying' then
        self.deathTick()
        return
    end

    if self:isDeadCheck() then
        self:launchBulletsAround()
        local time = 0
        self.status = 'dying'
        self.deathTick = function()
            time = time + Time.dt()
            if time > data.BulletHell.deathTimeMs then
                self:die()
            end
        end
        return
    end

    if self.hitbox:collide(game.boomer.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end

    if game.metronome.onBeat then
        self:onBeat()
    end

    for i = 1, #self.bullets do
        self.bullets[i]:update()
    end
end
