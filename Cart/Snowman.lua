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
        sprite = data.Snowman.sprites.chill,
        hitbox = Hitbox:new(x, y, x + 16, y + 16),

        taraxacum = startTaraxacum,
        
        theWay = nil,

        status = 'idle',

        currentAnimations = {},
        outOfChaseTime = 0,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function Snowman:_moveOneTile()
    if #self.theWay > 2 and self.status == 'chasing 🧐' then -- широкий парень уважает личное пространство
        self.x = 8 * self.theWay[2].x
        self.y = 8 * self.theWay[2].y
        self.hitbox:set_xy(self.x, self.y)
        self.taraxacum:move(self.x, self.y)
    elseif self.outOfChaseTime < #self.theWay - 2 and self.status == 'lost him 😠' then
        self.x = 8 * self.theWay[2 + self.outOfChaseTime].x
        self.y = 8 * self.theWay[2 + self.outOfChaseTime].y
        self.hitbox:set_xy(self.x, self.y)
        self.taraxacum:move(self.x, self.y)
    else
        trace('let me hug yu🤗!!')
    end
end

function Snowman:_updatePath()
    -- Ух ты! Крутая оптимизация.. 🤩🤩
    -- Я знаю 😎
    -- когда у нас начнет лагать можно будет не создавать новый путь при каждой проверке, а менять предыдущий на основе того,
    -- как изменилось положение игрока. просматривая от конца пути расширяя радиус проверки. должно быть круто, но может быть проблема,
    -- если там глупые препятствия. возможно при этом путь будет не самый короткий, но более интересный.
end

function Snowman:_onBeat()
    self:_moveOneTile()
    trace(self.status)
end

function Snowman:_setPath() 
    local way = aim.bfsMapAdaptedV2x2({x = self.x // 8, y = self.y // 8})
    if way then
        self.status = 'chasing 🧐'
        self.theWay = way
        self.outOfChaseTime = 0
    else
        self.status = 'lost him 😠'
        self.outOfChaseTime = self.outOfChaseTime + 1
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

    if game.metronome.on_beat then
        self:_setPath() 
        self:_onBeat()
    end

    self:_focusAnimations()
end

function Snowman:draw()
    --aim.visualizePath(self.theWay)

    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
    --line(self.x + 5 - gm.x*8 + gm.sx, self.y + 10 - gm.y*8 + gm.sy, self.x + 18 - gm.x*8 + gm.sx, self.y - 3 - gm.y*8 + gm.sy, 10)
    --hard🥵coded stick
    if self.taraxacum then
        self.taraxacum:draw()
    end

    self:_drawAnimations()
end
