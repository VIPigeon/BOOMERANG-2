-- Система чекпоинтов работает по принципу очереди, реализованной через односвязный список: каждый чекпоинт хранит ссылку на тот, что был включен перед ним
-- В game имеется доступ только к последнему включенному чекпоинту. Когда игрок умирает, он возрождается на нем, а в game записывается следующий в очереди
-- Всего есть три состояния чекпоинта: выключенный, включенный и "только что использованный". Чекпоинт в последнем состоянии всегда не больше одного, и его нельзя включить
-- Только что использованный чекпоинт имеет другой спрайт -- #249
-- Стартовый чекпоинт -- особый. На нем игрок может возрождаться сколько угодно раз (этот чекпоинт все еще никак не отображается)

Checkpoint = table.copy(Body)

local status = {
    disabled = 0,
    enabled = 1,
    justUsed = 2,
    appearing = 3,
}

function Checkpoint:new(x, y)
    local obj = {
        x = x + 1,
        y = y + 1,
        sprite = data.Checkpoint.turnedOffSprite:copy(),
        turnOnAnimation = data.Checkpoint.turnOnAnimation,
        hitbox = Hitbox:new(
            x,
            y,
            x + data.Checkpoint.width,
            y + data.Checkpoint.height
        ),
        status = status.disabled,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Checkpoint:enable()
    self.sprite = data.Checkpoint.turnedOnSprite:copy()
    self.status = status.enabled
end

function Checkpoint:enableBeatiful()
    self.sprite = data.Checkpoint.turnOnAnimation:copy()
    self.status = status.appearing
end

function Checkpoint:disable()
    self.sprite = data.Checkpoint.turnedOffSprite:copy()
    self.status = status.disabled
end

function Checkpoint:use()
    self.sprite = data.Checkpoint.justUsedSprite:copy()
    self.status = status.justUsed
end

function Checkpoint:update()
    if self.status == status.disabled and self.hitbox:collide(game.boomer.hitbox) then
        self:enableBeatiful()
        game.save(self)
    end

    if self.status == status.appearing then
        if self.sprite:animationEnd() then
            self:enable()
        end
        self.sprite:nextFrame()
    end
end
