Snowman = table.copy(Enemy)

function Snowman:new(x, y, config)
    local startTaraxacum = nil
    startTaraxacum = SpecialTaraxacum:new(
        x + config.specialTaraxacum.shiftForCenterX,
        y + config.specialTaraxacum.shiftForCenterY,
        config.specialTaraxacum.radius,
        config.specialTaraxacum.bodyLength,
        config.specialTaraxacum.shiftForCenterX,
        config.specialTaraxacum.shiftForCenterY
    )

    local object = {
        x = x,
        y = y,
        awake = false,
        speed = config.speed,
        sleepDistanceToPlayer = config.sleepDistanceToPlayer,
        config = config,
        damageSound = data.EnemyDamageSounds.Snowman,
        deathSound = data.EnemyDeathSounds.Snowman,
        hp = config.hp,
        sprite = config.sprites.chill:copy(),
        hitbox = Hitbox:new(x, y, x + 16, y + 16),

        taraxacum = startTaraxacum,

        theWay = nil,

        status = 'idle',
        attackStatus = 'idle',
        chaseStatus = 'no chase 🙄',

        currentAnimations = {},

        outOfChaseTime = 0,
        forJumpTime = 0,

        area = MapAreas.findAreaWithTile(x // 8, y // 8),
    }

    object.taraxacum.snowman = object

    setmetatable(object, self)
    self.__index = self
    return object
end

function Snowman:_prepareJumpActivate()
    self.status = 'steady'
    if not (self.attackStatus == 'whirl') then
        self.sprite = self.config.sprites.prepareJump:copy()
    end
    self.forJumpTime = 0
end

function Snowman:_jumpActivate()
    self.status = 'go'
    if not (self.attackStatus == 'whirl') then
        self.sprite = self.config.sprites.flyJump:copy()
    end
    self.forJumpTime = 0
end

function Snowman:_resetJumpActivate()
    self.status = 'ready'
    if not (self.attackStatus == 'whirl') then
        self.sprite = self.config.sprites.resetJump:copy()
    end
    self.forJumpTime = 0
    --error('not implemented error on Snowman:_resetJumpActivate()')
end

function Snowman:move(dx, dy) -- special for doors 🥰
    self.x = self.x + dx
    self.y = self.y + dy
    self.hitbox:set_xy(self.x, self.y)
    self.taraxacum:move(self.x, self.y)
    self:_moveWhirlAttack()
end

function Snowman:_moveOneTile() -- оптимизируем вычисления в 60 раз если будем вызывать каждый бит, а не тик.. эх, раньше надо было
    for _, tile in ipairs(game.transitionTiles) do -- этот парень почти как игрок, ему можно
        if tile.x == self.x // 8 and tile.y == self.y // 8 and self.area ~= tile.area then
            self.area = tile.area
            trace('Snowman transitioned into area ' .. self.area)
        end
    end

    if #self.theWay > 2 and self.chaseStatus == 'chasing 🧐' then --[[ придётся менять это условие и то, что ниже в _jumpActivate()
     широкий парень уважает личное пространство                 ]]--
        --trace(tostring(table.contains(data.bfs.solidTiles, mget(self.theWay[2].x, self.theWay[2].y))))
        if not table.contains(data.bfs.solidTiles, mget(self.theWay[2 + 1].x, self.theWay[2 + 1].y)) then -- тут мы проверяем, не является ли, совершенно случайно, следующий тайл дверью 😅
            local vec = {x = 8 * self.theWay[2].x - self.x, y = 8 * self.theWay[2].y - self.y}
            return self:_slowMoveOneTile(math.vecNormalize(vec), {x = 8 * self.theWay[2].x, y = 8 * self.theWay[2].y})
        else
            trace('next time i chase you 👿')
            return false
        end
        -- Честно говоря, я тоже боюсь того, что написал
    elseif self.outOfChaseTime < #self.theWay - 2 and self.chaseStatus == 'lost him 😠' then
        --trace(tostring(table.contains(data.bfs.solidTiles, mget(self.theWay[2 + self.outOfChaseTime].x, self.theWay[2 + self.outOfChaseTime].y))))
        if self.area == game.playerArea then -- провяем, на одной ли зоне 🐓
            local vec = {x = 8 * self.theWay[2 + self.outOfChaseTime].x - self.x, y = 8 * self.theWay[2 + self.outOfChaseTime].y - self.y}
            return self:_slowMoveOneTile(math.vecNormalize(vec), {x = 8 * self.theWay[2 + self.outOfChaseTime].x, y = 8 * self.theWay[2 + self.outOfChaseTime].y})
        else
            trace('damn you, player the sandass')
            return false
        end
    else
        --trace('let me hug yu🤗!!')
    end
end

function Snowman:_moveWhirlAttack()
    --  ________________________________________________________________________________________
    -- | BOOMER @ MAIL.tic 😏 |                                                                 |
    -- |-----------------------                                                                 |
    -- |                                                                                        |
    -- | kawaii-Code@boomerang2.com: Тот кто увидит этот комментарий должен удалить             | 
    -- | эту функцию. 🥵🤬🤬                                                                    |
    -- |                                                                                        |
    -- | Linux Torbolts@boomerang2.com: я закомментирую, вдруг ещё пригодится 🤓👍              |
    -- |                                                                                        |
    -- | kawaii-Code@boomerang2.com: Ладно, не удаляйте 😅😅                                    |
    --  ----------------------------------------------------------------------------------------
    --
    if self.whirlAttack then
        self.whirlAttack.x = self.hitbox:get_center().x
        self.whirlAttack.y = self.hitbox:get_center().y
    end
end

function Snowman:_slowMoveOneTile(vector, neededXY)
    if math.abs(self.x - neededXY.x) < 1 then
        self.x = neededXY.x
    end
    if math.abs(self.y - neededXY.y) < 1 then
        self.y = neededXY.y
    end
    if self.x == neededXY.x and self.y == neededXY.y then
        self.hitbox:set_xy(self.x, self.y)
        self.taraxacum:move(self.x, self.y)
        self:_moveWhirlAttack()
        return true
    end
    self.x = self.x + vector.x * self.speed
    self.y = self.y + vector.y * self.speed
    self.hitbox:set_xy(self.x, self.y)
    self.taraxacum:move(self.x, self.y)
    self:_moveWhirlAttack()
end

function Snowman:_updatePath()
    -- Ух ты! Крутая оптимизация.. 🤩🤩
    -- Я знаю 😎
    -- когда у нас начнет лагать можно будет не создавать новый путь при каждой проверке, а менять предыдущий на основе того,
    -- как изменилось положение игрока. просматривая от конца пути расширяя радиус проверки. должно быть круто, но может быть проблема,
    -- если там глупые препятствия. возможно при этом путь будет не самый короткий, но более интересный.
end

function Snowman:_onBeat()
    if self.attackStatus == 'whirl' then
        return
    elseif game.metronome.onOddBeat then
        self:_prepareJumpActivate()
    elseif game.metronome.onEvenBeat then
        self:_jumpActivate()
    end
end

function Snowman:_setPath()
    -- local way = aim.bfsMapAdaptedV2x2({x = self.x // 8, y = self.y // 8})
    local way = aim.astar_2x2({x = self.x // 8, y = self.y // 8})

    if way then
        self.chaseStatus = 'chasing 🧐'
        self.theWay = way
        self.outOfChaseTime = 0
    else
        self.chaseStatus = 'lost him 😠'
        self.outOfChaseTime = self.outOfChaseTime + 1 --in bits
    end
end

-- DO NOT EDIT. UPDATE OVERRIDE IN MUSIC SNOWMAN. YES THIS IS STUPID. 😊
function Snowman:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    if not game.metronome.onBass and self.attackStatus == 'whirl' then
        self.speed = self.config.speed
        self.attackStatus = 'idle'
        self.whirlAttack:endAttack()
        self.whirlAttack = nil -- Чтобы жесткие ошибки 😱😱😷
    end

    if game.metronome.onBass and self.attackStatus ~= 'whirl' then
        self.attackStatus = 'whirl'
        self.speed = self.config.speedWithWhirl
        -- DO: Тут костыль +8
        -- Готово 🤠
        self.whirlAttack = SnowmanWhirlAttack:new(self.hitbox:get_center().x, self.hitbox:get_center().y, self.taraxacum.h)
        self.whirlAttack.snowman = self
    end

    self:_focusAnimations()

    if self.status == 'dying' then
        self.sprite:nextFrame()
        if self.sprite:animationEnd() then
            self:_createDeathEffect()
            self:die()
        end
        return
    end

    if self:isDeadCheck() then
        self.sprite = self.config.sprites.death:copy()
        self.status = 'dying'
        return
    end

    if self.attackStatus == 'whirl' then
        self.whirlAttack:update()
        self.sprite = self.config.sprites.chill:copy()
        if self.theWay then
            self:_moveOneTile()
        end
    end

    --разбили время на прыжок на две равные части, фрейм меняем в соответствующее время
    if self.status == 'steady' then
        self.forJumpTime = self.forJumpTime + 1
        if self.forJumpTime == self.config.prepareJumpTime then
            self.status = 'idle'
        elseif self.forJumpTime == self.config.prepareJumpTime // 2 then
            self.sprite:nextFrame()
        end
    end

    if self.status == 'go' then
        self:_moveOneTile()
        if self:_moveOneTile() then
            self:_resetJumpActivate()
        end
    end

    if self.status == 'ready' then
        self.forJumpTime = self.forJumpTime + 1
        if self.forJumpTime == self.config.resetJumpTime then
            self.status = 'idle'
        elseif self.forJumpTime == self.config.resetJumpTime // 3 then
            self.sprite:nextFrame()
        elseif self.forJumpTime == 2 * self.config.resetJumpTime // 3 then
            self.sprite:nextFrame()
        end
    end

    if game.metronome.onBeat then
        self:_setPath() -- перенести на оддБит
        self:_onBeat()
    end

    self:_focusAnimations()
end

function Snowman:_createDeathEffect()
    local x = self.x
    local y = self.y

    local particleCount = math.random(self.config.deathParticleCountMin, self.config.deathParticleCountMax)
    local particleSpeed = self.config.deathAnimationParticleSpeed

    local function randomSide()
        return 2 * math.random() - 1
    end

    local function randomSpeed()
        return math.random(50, 150) / 100
    end

    particles = {}
    for i = 1, particleCount do
        local spawnx = x + randomSide()
        local spawny = y + randomSide()
        --particles are weak, bullets here
        particles[i] = Bullet:new(spawnx, spawny, self.config.deathParticleSprite)
        table.insert(game.updatables, particles[i])
        table.insert(game.drawables, particles[i])

        local dx = randomSide() * randomSpeed()
        local dy = randomSide() * randomSpeed()
        local vecLen = math.sqrt(dx * dx + dy * dy)
        if vecLen < self.config.deathAnimationParticleSpeedNormalizer then
            dx = dx * self.config.deathAnimationParticleSpeedNormalizer / vecLen
            dy = dy * self.config.deathAnimationParticleSpeedNormalizer / vecLen
        end
        particles[i]:setVelocity(particleSpeed * dx, particleSpeed * dy)
    end
end

function Snowman:die()
    trace("I AM DEAD!!!")
    table.removeElement(game.updatables, self)
    table.removeElement(game.drawables, self)
    table.removeElement(game.collideables, self)
    table.removeElement(game.enemies, self) -- именно этого ему не хватало, чтобы умереть спокойно
end

function Snowman:draw()
    if self.attackStatus == 'whirl' then
        self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
        self.whirlAttack:draw()
    end

    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
    if not (self.attackStatus == 'whirl') and self.taraxacum then
        self.taraxacum:draw()
    end

    self:_drawAnimations()

    circb(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.sleepDistanceToPlayer, 4)
end
