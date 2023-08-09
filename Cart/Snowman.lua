Snowman = table.copy(Enemy)

function Snowman:new(x, y, hasTaraxacum)
    local startTaraxacum = nil
    if hasTaraxacum then
        startTaraxacum = SpecialTaraxacum:new(
            x + data.Snowman.specialTaraxacum.shiftForCenterX,
            y + data.Snowman.specialTaraxacum.shiftForCenterY,
            data.Snowman.specialTaraxacum.radius,
            data.Snowman.specialTaraxacum.bodyLength,
            data.Snowman.specialTaraxacum.shiftForCenterX,
            data.Snowman.specialTaraxacum.shiftForCenterY
        )
    end
    local object = {
        x = x,
        y = y,
        speed = data.Snowman.speed,
        hp = data.Snowman.hp,
        sprite = data.Snowman.sprites.chill:copy(),
        hitbox = Hitbox:new(x, y, x + 16, y + 16),

        taraxacum = startTaraxacum,
        
        theWay = nil,

        status = 'idle',
        chaseStatus = 'no chase 🙄',

        currentAnimations = {},
        
        outOfChaseTime = 0,
        forJumpTime = 0,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function Snowman:_prepareJumpActivate()
    self.status = 'steady'
    self.sprite = data.Snowman.sprites.prepareJump:copy()
    self.forJumpTime = 0
end

function Snowman:_jumpActivate()
    self.status = 'go'
    self.sprite = data.Snowman.sprites.flyJump:copy()
    self.forJumpTime = 0
end

function Snowman:_resetJumpActivate()
    self.status = 'ready'
    self.sprite = data.Snowman.sprites.resetJump:copy()
    self.forJumpTime = 0
    --error('not implemented error on Snowman:_resetJumpActivate()')
end

function Snowman:_moveOneTile() -- оптимизируем вычисления в 60 раз если будем вызывать каждый бит, а не тик
    if #self.theWay > 2 and self.chaseStatus == 'chasing 🧐' then --[[ придётся менять это условие и то, что ниже в _jumpActivate()
     широкий парень уважает личное пространство                 ]]--
        local vec = {x = 8 * self.theWay[2].x - self.x, y = 8 * self.theWay[2].y - self.y}
        return self:_slowMoveOneTile(math.vecNormalize(vec), {x = 8 * self.theWay[2].x, y = 8 * self.theWay[2].y})

    elseif self.outOfChaseTime < #self.theWay - 2 and self.chaseStatus == 'lost him 😠' then
        local vec = {x = 8 * self.theWay[2 + self.outOfChaseTime].x - self.x, y = 8 * self.theWay[2 + self.outOfChaseTime].y - self.y}
        return self:_slowMoveOneTile(math.vecNormalize(vec), {x = 8 * self.theWay[2 + self.outOfChaseTime].x, y = 8 * self.theWay[2 + self.outOfChaseTime].y})

    else
        --trace('let me hug yu🤗!!')
    end
end

function Snowman:_slowMoveOneTile(vector, neededXY)
    --trace(neededXY.x..' '..neededXY.y..' '..self.x..' '..self.y)
    if math.abs(self.x - neededXY.x) < 1 then
        self.x = neededXY.x
    end
    if math.abs(self.y - neededXY.y) < 1 then
        self.y = neededXY.y
    end
    if self.x == neededXY.x and self.y == neededXY.y then
        self.hitbox:set_xy(self.x, self.y)
        self.taraxacum:move(self.x, self.y)
        return true
    end
    self.x = self.x + vector.x * self.speed
    self.y = self.y + vector.y * self.speed
    self.hitbox:set_xy(self.x, self.y)
    self.taraxacum:move(self.x, self.y)
end

function Snowman:_updatePath()
    -- Ух ты! Крутая оптимизация.. 🤩🤩
    -- Я знаю 😎
    -- когда у нас начнет лагать можно будет не создавать новый путь при каждой проверке, а менять предыдущий на основе того,
    -- как изменилось положение игрока. просматривая от конца пути расширяя радиус проверки. должно быть круто, но может быть проблема,
    -- если там глупые препятствия. возможно при этом путь будет не самый короткий, но более интересный.
end

function Snowman:_onBeat()
    if game.metronome.onOddBeat then
        self:_prepareJumpActivate()
    elseif game.metronome.onEvenBeat then
        self:_jumpActivate()
    end
    
    --trace(self.status)
    --trace(self.chaseStatus)
end

function Snowman:_setPath() 
    local way = aim.bfsMapAdaptedV2x2({x = self.x // 8, y = self.y // 8})
    if way then
        self.chaseStatus = 'chasing 🧐'
        self.theWay = way
        self.outOfChaseTime = 0
    else
        self.chaseStatus = 'lost him 😠'
        self.outOfChaseTime = self.outOfChaseTime + 1 --in bits
    end
end

function Snowman:update()
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

    if self:isDeadCheck() then
        self.sprite = data.Snowman.sprites.death:copy()
        self.status = 'dying'
        return
    end

    --разбили время на прыжок на две равные части, фрейм меняем в соответствующее время
    if self.status == 'steady' then
        self.forJumpTime = self.forJumpTime + 1
        if self.forJumpTime == data.Snowman.prepareJumpTime then
            self.status = 'idle'
        elseif self.forJumpTime == data.Snowman.prepareJumpTime // 2 then
            self.sprite:nextFrame()
        end
    end

    if self.status == 'go' then
        self:_moveOneTile()
        if self:_moveOneTile() then
            --trace('phew')
            self:_resetJumpActivate()
        end
    end

    if self.status == 'ready' then
        --trace('im ready')
        self.forJumpTime = self.forJumpTime + 1
        if self.forJumpTime == data.Snowman.resetJumpTime then
            self.status = 'idle'
        elseif self.forJumpTime == data.Snowman.resetJumpTime // 3 then
            self.sprite:nextFrame()
        elseif self.forJumpTime == 2 * data.Snowman.resetJumpTime // 3 then
            self.sprite:nextFrame()
        end
    end

    if game.metronome.onBeat then
        self:_setPath() -- перенести на оддБит
        self:_onBeat()
    end

    self:_focusAnimations()
end

function Snowman:draw()
    aim.visualizePath(self.theWay)

    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
    --line(self.x + 5 - gm.x*8 + gm.sx, self.y + 10 - gm.y*8 + gm.sy, self.x + 18 - gm.x*8 + gm.sx, self.y - 3 - gm.y*8 + gm.sy, 10)
    --hard🥵coded stick
    if self.taraxacum then
        self.taraxacum:draw()
    end

    self:_drawAnimations()
end
