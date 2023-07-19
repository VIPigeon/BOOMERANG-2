Checkpoint = table.copy(Body)

function Checkpoint:new(x, y)
    local obj = {
        x = x + 1,
        y = y + 1,
        sprite = data.Checkpoint.innerTurnedOffSprite:copy(),
        hitbox = Hitbox:new(
            x,
            y,
            x + data.Checkpoint.width,
            y + data.Checkpoint.height
        ),
        enabled = false,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Checkpoint:update()
    if not self.enabled and self.hitbox:collide(game.boomer.hitbox) then
        self.sprite = data.Checkpoint.innerTurnedOnSprite:copy()
    end
end
