Snowman = table.copy(Enemy)

function Snowman:new(x, y)
    local object = {
        x = x,
        y = y,
        speed = data.Snowman.speed,
        hp = data.Snowman.hp,
        hitbox = Hitbox:new(x, y, x + 16, y + 16),
        
        theWay = nil,

        status = 'idle',

        currentAnimations = {},
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function Snowman:_moveOneTile()
    if #self.theWay ~= 0 then
        self.x = path[#self.theWay - 1].x
        self.y = path[#self.theWay - 1].y
    else
        trace('let me hug yu!!')
    end
end

function Snowman:_updatePath()
    -- когда у нас начнет лагать можно будет не создавать новый путь при каждой проверке, а менять предыдущий на основе того,
    -- как изменилось положение игрока. просматривая от конца пути расширяя радиус проверки. должно быть круто, но может быть проблема,
    -- если там глупые препятствия. возможно при этом путь будет не самый короткий, но более интересный.
end

function Snowman:_onBeat()
    self:_moveOneTile()
end

function Snowman:_setPath() 
    self.theWay = aim.bfsMapAdapted(self.x, self.y)
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
        self.sprite = data.Rose.sprites.death:copy()
        self.status = 'dying'
        return
    end

    if game.metronome.on_beat then
        self:_getPath() 
        self:_onBeat()
    end

    self:_focusAnimations()
end