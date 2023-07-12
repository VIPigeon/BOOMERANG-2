Boomerang = table.copy(Body)
boomerangSpinningSprite = data.Boomerang.sprites.spinning

function Boomerang:new(x, y, dx, dy)
    obj = {  -- dx, dy in [-1, 1]
        sprite = boomerangSpinningSprite:copy(),
        x = x, y = y,
        dx = dx, dy = dy,
        speed = data.Boomerang.speed,
        flightNormalizer = data.Boomerang.flightNormalizerStraight,
        px = 0, py = 0,
        dpMs = data.Boomerang.damagePerMillisecond,
        hitbox = Hitbox:new_with_shift(x+2, y+2, x+6, y+6, 2, 2),
        --flightEnded = false
    }

    if obj['dx'] * obj['dy'] ~= 0 then
        obj['flightNormalizer'] = data.Boomerang.flightNormalizerDiagonal
    end
    obj['decelerationThing'] = obj['speed'] / data.Boomerang.decelerationConstant

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj-- body
end

function Boomerang:focus(x, y)
    self.px = x; self.py = y
end

function Boomerang:update()
    self.sprite:next_frame()
    self.speed = self.speed - self.decelerationThing
    if self.speed < 0 then
        self:_reverseUpdate()
        return
    end

    local dx = self.speed * self.dx * self.flightNormalizer
    local dy = self.speed * self.dy * self.flightNormalizer

    self:moveUnclamped(dx, dy)
    self:draw()
end

function Boomerang:_reverseUpdate()
    local fx = self.px
    local fy = self.py
    local x = self.x
    local y = self.y
    if fx == x then
        fx = fx + 0.0000001
    end
    d = math.abs(fy - y) / math.abs(fx - x)
    dx = self.speed / math.sqrt(1 + d*d)
    dy = dx*d -- xdd~~~

    local kx = 1
    local ky = 1
    if fx < x then
        kx = -1
    end
    if fy < y then
        ky = -1
    end
    
    local ddx = -1 * kx * dx
    local ddy = -1 * ky * dy
    self:moveUnclamped(ddx, ddy)
    self:draw()
end


return Boomerang
