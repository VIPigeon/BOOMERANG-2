Boomerang = table.copy(Body)

boomerangSpinningSprite = data.Boomerang.sprites.spinning

function Boomerang:new(x, y, dx, dy)
    local obj = {  -- dx, dy in [-1, 1]
        sprite = boomerangSpinningSprite:copy(),
        x = x,
        y = y,
        dx = dx,
        dy = dy,
        canBePickedUp = false,
        speed = data.Boomerang.speed,
        flightNormalizer = data.Boomerang.flightNormalizerStraight,
        px = 0,
        jpy = 0,
        dpMs = data.Boomerang.damagePerMillisecond,
        hitbox = Hitbox:new_with_shift(-1000+2, -1000+2, -1000+6, -1000+6, 2, 2),
        active = false,
        status = 'going brrr',
        shakeOld = false,
    }
    obj.pickupTimer = Timer:new(900):onEnd(function() obj.canBePickedUp = true end)

    if obj['dx'] * obj['dy'] ~= 0 then
        obj['flightNormalizer'] = data.Boomerang.flightNormalizerDiagonal
    end
    obj['decelerationThing'] = obj['speed'] / data.Boomerang.decelerationConstant

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Boomerang:init(x, y, dx, dy)
    self.x = x; self.y = y
    self.dx = dx; self.dy = dy
    self.speed = data.Boomerang.speed
    self.pickupTimer:reset()
    if self.shakeOld then
        game.camera:shakeByBoomer(0.2)
        self.shaking = true
    end
end

function Boomerang:focus()
    self.px = game.player.x
    self.py = game.player.y
end

function Boomerang:update()
    -- trace(self.x.." "..self.y)
    if not self.active then
        return
    end

    self.sprite:nextFrame()

    self.pickupTimer:update()
    self.speed = self.speed - self.decelerationThing * Time.dt_in_60fps()

    if self.pickupTimer:ended() and self.hitbox:collide(game.player.hitbox) then
        if self.shakeOld or self.shaking then
            game.camera:shakeByBoomerStop()
            self.shaking = false
        end
        self.active = false
        self.hitbox:set_xy(-1000, -1000)
        return
    end

    if self.speed < 0 then
        self:focus()
        self:_reverseUpdate()
        return
    end

    local dx = self.speed * self.dx * self.flightNormalizer --* Time.dt_in_60fps()
    local dy = self.speed * self.dy * self.flightNormalizer --* Time.dt_in_60fps()

    self:moveUnclamped(dx, dy)
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
    dx = self.speed / math.sqrt(1 + d*d) --* Time.dt_in_60fps()
    dy = dx*d --* Time.dt_in_60fps() -- xdd~~~

    local kx = 1
    local ky = 1
    if fx < x then
        kx = -1
    end
    if fy < y then
        ky = -1
    end

    local ddx = -1 * kx * dx  -- вторая производная хули ?!??!?!?!
    local ddy = -1 * ky * dy
    self:moveUnclamped(ddx, ddy)
end

function Boomerang:draw()
    if not self.active then
        return
    end
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
end


return Boomerang
