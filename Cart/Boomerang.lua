Boomerang = table.copy(Body)
BOOMERANG_A = Sprite:new(anim.gen60({264, 265, 266, 264, 265, 266, 264, 265, 266, 264, 265, 266}), 1)

function Boomerang:new(x, y, dx, dy)
    obj = {  -- dx, dy in [-1, 1]
        sprite = BOOMERANG_A:copy(),
        x = x, y = y,
        dx = dx, dy = dy,
        v = 0.1, k = 1,
        px = 0, py = 0,
        damage_per_ms = 0.1,
        hitbox = Hitbox:new_with_shift(x+2, y+2, x+6, y+6, 2, 2)
    }
    obj['flip'] = -math.fence(dx, -1, 0)
    if obj['dx'] * obj['dy'] ~= 0 then
        obj['k'] = 1 / math.sqrt(2)
    end
    obj['dv'] = obj['v'] / 80
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj-- body
end

function Boomerang:update()
    self.sprite:next_frame()
    self.v = self.v - self.dv
    if self.v < 0 then
        self:reverse_update()
        return
    end

    local dx = self.v * self.dx * self.k
    local dy = self.v * self.dy * self.k

    self:move_unclamped(dx, dy)
    self:draw()
end

function Boomerang:focus(x, y)
    self.px = x; self.py = y
end

function Boomerang:reverse_update()
    fx = self.px; fy = self.py
    x = self.x; y = self.y
    if fx == x then
        fx = fx + 0.0000001
    end
    d = math.abs(fy - y) / math.abs(fx - x)
    dx = self.v / math.sqrt(1 + d*d)
    dy = dx * d

    kx = 1; ky = 1
    if fx < x then
        kx = -1
    end
    if fy < y then
        ky = -1
    end
    
    local ddx = -1 * kx * dx
    local ddy = -1 * ky * dy
    self:move_unclamped(ddx, ddy)
    self:draw()
end


return Boomerang
