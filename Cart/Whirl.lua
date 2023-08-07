Whirl = table.copy(Body)

function Whirl:new(x, y, taraxacum, angle, fadeTimeMs)
    local spr = data.Snowman.whirl.sprite:copy()
    local object = {
        x = x,
        y = y,
        taraxacum = taraxacum,
        trail = {},
        angle = 0,
        sprite = spr,
        hitbox = Hitbox:new_with_shift(x, y, x+8, y+8, 0, 0),
        stick = data.Snowman.specialTaraxacum.bodyLength,
        fadeTimeMs = fadeTimeMs,
    }

    local time = 0
    object.timer = function()
        time = time + Time.dt()
        if time > object.fadeTimeMs then
            return true
        end
    end

    setmetatable(object, self)
    self.__index = self
    return object
end

function Whirl:_destroy()
    table.insert(game.deleteSchedule, self)
end

function Whirl:_kill()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
        self:_destroy()
    end
end

function Whirl:update()
    self:_kill()
    local isEnded = self.timer()

    if isEnded then
        self:_destroy()
    end
end

function Whirl:draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
end

return Whirl
