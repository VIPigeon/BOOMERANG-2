MusicSnowman = table.copy(Snowman)

-- И Сноумен ⛄ говорит:
-- ноль ноль один один один ноль
-- function MusicSnowman:tuning(beatMap, sfxMap)
function MusicSnowman:tuning(music)
    -- local sfxMap = music.sfxMap
    -- local beatMap = music.beatMap
    local sfxMap, beatMap
    if music.intro then
        sfxMap = music.intro.sfxMap
        beatMap = music.intro.beatMap
        self.reserveMusic = {}
        self.reserveMusic.sfxMap = music.sfxMap
        self.reserveMusic.beatMap = music.beatMap
    else
        sfxMap = music.sfxMap
        beatMap = music.beatMap
    end
    self.sfxMap = sfxMap
    self.sfxMapIndex = 1
    self.beatMap = beatMap
    self.beatMapIndex = 1
    self.pastAngle = 0

    if music.altBeatMap then
        self.altBeatMap = music.altBeatMap
        -- trace("!!!!!!!!!   "..#self.altBeatMap)
    end
end

function MusicSnowman:update()
    --if not self.awake then
    --    trace('not awake')
    --    return
    --end
    --trace('awake')
    -- trace('sdtp = ' .. self.sleepDistanceToPlayer .. ' x = ' .. self.x .. ' gpx = ' .. game.player.x .. 'distance = ' .. math.distance(self.x, self.y, game.player.x, game.player.y))
    if math.distance(self.x, self.y, game.player.x, game.player.y) >= self.sleepDistanceToPlayer then
        self.boxOfBirth:activate()
        return
    end

    if (#self.beatMap == 4 and game.metronome.beat4) or
       (#self.beatMap == 6 and game.metronome.beat6) or
       (#self.beatMap == 8 and game.metronome.beat8) then

        if not self.reserveMusic then
            self.beatMapIndex = (self.beatMapIndex % #self.beatMap) + 1
            if self.altBeatMap and self.beatMapIndex == 1 then
                local buf = table.copy(self.beatMap)
                self.beatMap = table.copy(self.altBeatMap)
                self.altBeatMap = buf
                -- trace(self.altBeatMap[1].." "..self.altBeatMap[2].." "..self.altBeatMap[3].." "..self.altBeatMap[4])
                -- trace(self.beatMap[1].." "..self.beatMap[2].." "..self.beatMap[3].." "..self.beatMap[4])
            end
        else
            self.beatMapIndex = self.beatMapIndex + 1
            if self.beatMapIndex > #self.beatMap then
                self:tuning(self.reserveMusic)
                self.reserveMusic = false
            end
        end

        if (self.beatMap[self.beatMapIndex] ~= 0) then
            --- АХХАХАХАХ ДУббяж кода 😜😋😱🤪🤪🤪
            self.whirlAttack = SnowmanWhirlAttack:new(self.hitbox:get_center().x, self.hitbox:get_center().y, self.taraxacum.h)
            self.whirlAttack.angle = self.pastAngle
            self.whirlAttack.snowman = self
            self.attackStatus = 'whirl'
            self.speed = self.config.speedWithWhirl

            local sound = self.sfxMap[self.sfxMapIndex]
            sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])

            self:_setPath()
            self.sfxMapIndex = (self.sfxMapIndex % #self.sfxMap) + 1
            self:_moveOneTile()
       else
            self.speed = self.config.speed
            self.attackStatus = 'idle'
            if self.whirlAttack then
                self.pastAngle = self.whirlAttack.angle
                self.whirlAttack:endAttack()
                self.whirlAttack = nil -- Чтобы жесткие ошибки 😱😱😷
           end
       end
    end

    if self.whirlAttack then
        self.pastAngle = self.whirlAttack.angle
    end

    self:_focusAnimations()

    if self.attackStatus == 'whirl' then
        self.whirlAttack:update()
        self.sprite = self.config.sprites.chill:copy()
        if self.theWay then
            self:_moveOneTile()
        end
    end

    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)

        if self:isDeadCheck() then
            self.sprite = self.config.sprites.death:copy()
            return
        end
    end

    if self:isDeadCheck() then
        self.sprite:nextFrame()
        if self.sprite:animationEnd() then
            self:_createDeathEffect()
            self:die()
        end
        return
    end
end
