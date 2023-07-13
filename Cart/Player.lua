
-- function plr_death_anim()
--     res = {}
--     for i=272, 278 do
--         for _=1, 8 do
--             table.insert(res, i)
--         end
--     end
--     for _=1, 4 do
--         table.insert(res, 279)
--     end
--     return res
-- end

Player = table.copy(Body)
Player.stay_a = Sprite:new({257}, 1)
Player.run_a = Sprite:new(anim.gen60({256, 257, 258, 259, 256, 257, 258, 259, 256, 257, 258, 259}), 1)
Player.death_a = Sprite:new(anim.gen60(plr_death_anim()), 1)
Player.born_a = Sprite:new(table.reversed(anim.gen60(plr_death_anim())), 1)
Player.hat_a = Sprite:new(anim.gen60({279}), 1)

Player.stay_b = Sprite:new({465}, 1)
Player.run_b = Sprite:new(anim.gen60({464, 465, 466, 467, 464, 465, 466, 467, 464, 465, 466, 467}), 1)

function Player:new(x, y)
    obj = {
        sprite = Player.born_a:copy(),
        start_x = x, start_y = y,
        vertical_flip = false,
        x = x, y = y,
        last_dx = 1, last_dy = 0,
        dx = 0, dy = 0, v = 0.07,
        flip = 0,  -- направление при отрисовке спрайта
        hitbox = Hitbox:new_with_shift(x, y, x+3, y+6, 2, 1),
        hp = 1,
        born_flag = true,
        boomerang = false
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Player:tryMove(kNormal)
    local dx = self.dx * self.v * kNormal
    local dy = self.dy * self.v * kNormal

    if self:will_collide_after(dx, dy) then
        if not self:will_collide_after(dx, 0) then
            self:move(dx, 0)
        end
        if not self:will_collide_after(0, dy) then
            self:move(0, dy)
        end
    else
        self:move(dx, dy)
    end
end

-- KEY_W = 23
-- KEY_A = 01
-- KEY_S = 19
-- KEY_D = 04
-- KEY_UP = 58
-- KEY_DOWN = 59
-- KEY_LEFT = 60
-- KEY_RIGHT = 61


function Player:update()
    if self.isDead then
        self:death_update()
        return
    end

    if self.born_flag then
        if not self:born_update() then  -- если рождение закончилось
            self.sprite = Player.stay_a:copy()
        end
        return
    end

    flag = false
    if math.abs(self.dx) + math.abs(self.dy) ~= 0 then  -- is moving
        flag = true
    end

    self.dx = 0; self.dy = 0
    if key(KEY_W) then
        self.dy = self.dy - 1
    end
    if key(KEY_S) then
        self.dy = self.dy + 1
    end
    if key(KEY_A) then
        self.dx = self.dx - 1
    end
    if key(KEY_D) then
        self.dx = self.dx + 1
    end

    if math.abs(self.dx) + math.abs(self.dy) ~= 0 then  -- is moving
        self.last_dx = self.dx;
        self.last_dy = self.dy
        if self.dy < 0 and not self.vertical_flip then
            frame = self.sprite:get_frame()
            self.vertical_flip = true
            self.sprite = Player.run_b:copy();
            self.sprite:set_frame(frame)
        elseif self.dy > 0 and self.vertical_flip then
            frame = self.sprite:get_frame()
            self.vertical_flip = false
            self.sprite = Player.run_a:copy();
            self.sprite:set_frame(frame)
        end

        if not flag or #self.sprite.animation == 1 then
            if self.vertical_flip then
                self.sprite = Player.run_b:copy()
            else
                self.sprite = Player.run_a:copy()
            end
        end
    else
        if self.vertical_flip then
            self.sprite = Player.stay_b:copy()
        else
            self.sprite = Player.stay_a:copy()
        end
    end

    if self.dx == -1 then
        self.flip = 1
    elseif self.dx == 1 then
        self.flip = 0
    end

    k = 1
    if self.dx * self.dy ~= 0 then
        k = 1 / math.sqrt(2)
    end

    self.sprite:next_frame()

    self:tryMove(k)

    if not self.boomerang then
        self:shoot()
    end

    if self.boomerang then
        self.boomerang:focus(self.x, self.y)
        if self.boomerang.hitbox:collide(self.hitbox) and
                self.boomerang.v < self.v then
            self.boomerang = false
        end
    end
end

function Player:shoot()
    if key(KEY_UP) then
        self.boomerang = Boomerang:new(self.x, self.y, 0, -1)
    elseif key(KEY_DOWN) then
        self.boomerang = Boomerang:new(self.x, self.y, 0, 1)
    elseif key(KEY_LEFT) then
        self.boomerang = Boomerang:new(self.x, self.y, -1, 0)
    elseif key(KEY_RIGHT) then
        self.boomerang = Boomerang:new(self.x, self.y, 1, 0)
    end
end

function Player:death_update()
    self.sprite:next_frame()
    if self.sprite.frame == 60 then
        self.sprite = Player.hat_a:copy()
    end
    self:draw()
end

function Player:death()
    -- self.dead = true
    self.sprite = Player.death_a:copy()
end

function Player:set_start_stats()
    self.hp = 1
    self.boomerang = false
    self.x = self.start_x
    self.y = self.start_y
    self.sprite = Player.born_a:copy()
    self.born_flag = true
    self.hitbox = Hitbox:new_with_shift(self.start_x, self.start_y, self.start_x + 3, self.start_y + 6, 2, 1)
end


return Player
