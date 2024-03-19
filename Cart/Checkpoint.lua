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
        -- 🔊 😍
        local sound = data.Player.sfx.checkpoint
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
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
