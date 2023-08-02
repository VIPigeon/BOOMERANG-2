StaticTaraxacum = table.copy(Taraxacum)

function StaticTaraxacum:new(x, y, radius, bodyLength)
    local object = {
        x = x,
        y = y,
        radius = radius,
        hitbox = HitCircle:new(x, y, 2 * radius),
        bodyLength = bodyLength,
    }

    local r = radius
    game.lineDrawer:addLine(r + x - 1, 2 * r + y, 0, bodyLength, data.Taraxacum.bodyColor)

    setmetatable(object, self)
    self.__index = self
    return object
end

function StaticTaraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_launchBullets()
        self:_destroy()
    end
end

function StaticTaraxacum:_destroy()
    table.removeElement(game.updatables, self)
    table.removeElement(game.drawables, self)
    table.removeElement(game.collideables, self)

    local r = self.radius
end

function StaticTaraxacum:_move()
    -- 😣😣😣
end

function StaticTaraxacum:draw()
    self.hitbox:draw(data.Taraxacum.color)
end

LineDrawer = {}
function LineDrawer:new()
    local object = {
        lines = {}
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function LineDrawer:addLine(x1, y1, w, h, color)
    table.insert(self.lines, {x1=x1, y1=y1, w=w, h=h, color=color})
end

function LineDrawer:draw()
    if #self.lines == 0 then
        return
    end

    for _, l in ipairs(self.lines) do
        local x = l.x1 - gm.x*8 + gm.sx
        local y = l.y1 - gm.y*8 + gm.sy
        line(x, y, x + l.w, y + l.h, l.color)
    end
end
