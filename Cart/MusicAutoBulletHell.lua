MusicAutoBulletHell = table.copy(AutoBulletHell)
-- local bulletSprite = 379

function MusicAutoBulletHell:new(x, y, config)

    local bullets = {}
    for i = 1, config.bulletCount do
        bullets[i] = AutoHellBullet:new()
    end

    local object = {
        x = x,
        y = y,
        type = type,
        spread = config.bulletSpreadRadius,
        bullets = bullets,
        bulletCount = config.bulletCount,
        bulletSpeed = config.bulletSpeed,
        bulletSprite = bulletSprite,
        rotationSpeed = config.bulletRotationSpeed,
        deathBulletSpeed = config.deathBulletSpeed,
        hp = config.hp,
        hitbox = HitCircle:new(x, y, config.circleDiameter),
        time = 0,
        status = '',
        color = config.color,

        reloadingTimer = 0,
        reloadingBullets = {},
        currentAnimations = {},

        isActive = false,
    }

    BulletHell._moveBullets(object, 0)

    setmetatable(object, self)
    self.__index = self
    return object
end


-- function MusicAutoBulletHell:tuning(beatMap, sfxMap)
function MusicAutoBulletHell:tuning(music)
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
    -- local sfxMap = music.sfxMap
    -- local beatMap = music.beatMap
    -- обязательно вызывается после new для настройки музыки
    
    self.sfxMap = sfxMap
    self.i_sfxMap = 1

    -- строка из 0, 1, указывающая биты, на которые стреляет роза
    self.beatMap = beatMap
    self.i_beatMap = 1

    if music.altBeatMap then
        self.altBeatMap = music.altBeatMap
        -- trace("!!!!!!!!!   "..#self.altBeatMap)
    end
end

function MusicAutoBulletHell:_full_shot()
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

function MusicAutoBulletHell:onBeat()
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
    elseif #self.beatMap == 16 then
        if not game.metronome.beat16 then
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
    if not self.reserveMusic then
        self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
        return
    end
    self.i_beatMap = self.i_beatMap + 1
    if self.i_beatMap > #self.beatMap then
        self:tuning(self.reserveMusic)
        self.reserveMusic = false
    end
end

local trash = Sprite:new({379}, 1)
function MusicAutoBulletHell:_createShootBullet()
    local bull = Bullet:new(0, 0, trash)
    bull.speed = self.bulletSpeed
    
    table.insert(game.drawables, bull)
    table.insert(game.updatables, bull)

    return bull
end

function MusicAutoBulletHell:update()
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


function MusicAutoBulletHell:onBeat()

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
    elseif #self.beatMap == 16 then
        if not game.metronome.beat16 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 32 then
        if not game.metronome.beat32 then
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
    -- self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
    if not self.reserveMusic then
        self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
        if self.altBeatMap and self.i_beatMap == 1 then
            local buf = table.copy(self.beatMap)
            self.beatMap = table.copy(self.altBeatMap)
            self.altBeatMap = buf
            -- trace(self.altBeatMap[1].." "..self.altBeatMap[2].." "..self.altBeatMap[3].." "..self.altBeatMap[4])
            -- trace(self.beatMap[1].." "..self.beatMap[2].." "..self.beatMap[3].." "..self.beatMap[4])
        end
        return
    end
    self.i_beatMap = self.i_beatMap + 1
    if self.i_beatMap > #self.beatMap then
        self:tuning(self.reserveMusic)
        self.reserveMusic = false
    end
end