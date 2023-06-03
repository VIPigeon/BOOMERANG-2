
function plr_death_anim()
    res = {}
    for i=272, 278 do
        for _=1, 8 do
            table.insert(res, i)
        end
    end
    for _=1, 4 do
        table.insert(res, 279)
    end
    return res
end

Player = table.copy(Body)
Player.stay_a = Sprite:new({257}, 1)
Player.run_a = Sprite:new(anim.gen60({256, 257, 258, 259, 256, 257, 258, 259, 256, 257, 258, 259}), 1)
Player.death_a = Sprite:new(anim.gen60(plr_death_anim()), 1)
Player.born_a = Sprite:new(table.reversed(anim.gen60(plr_death_anim())), 1)
Player.hat_a = Sprite:new(anim.gen60({279}), 1)

function Player:new(x, y)
    obj = {
        sprite = Player.born_a:copy(),
        start_x = x, start_y = y,
        x = x, y = y,
        last_dx = 1, last_dy = 0,
        dx = 0, dy = 0, v = 1,
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
    -- if not self.hitbox:mapCheck() then
    --     self.x = self.x - self.dx * self.v * self.k
    --     self.hitbox:set_xy(self.x, self.y)
    -- end

    -- self.y = self.y + self.dy * self.v * self.k
    -- self.hitbox:set_xy(self.x, self.y)
    -- if not self.hitbox:mapCheck() then
    --     self.y = self.y - self.dy * self.v * self.k
    --     self.hitbox:set_xy(self.x, self.y)
    -- end

    local tryX = math.fence(self.x + self.dx * self.v * kNormal, 0, 240 - 8)
    local tryY = math.fence(self.y + self.dy * self.v * kNormal, 0, 136 - 8)

    self.hitbox:set_xy(tryX, tryY);

    print(self.hitbox:mapCheck())

    if not self.hitbox:mapCheck() then
        self.hitbox:set_xy(self.x, tryY)

        if self.hitbox:mapCheck() then
            self:move(self.x, tryY)
        end

        self.hitbox:set_xy(tryX, self.y)

        if self.hitbox:mapCheck() then
            self:move(tryX, self.y)
        end
    else
        self:move(tryX, tryY)
    end

    self.hitbox:set_xy(self.x, self.y)
end


function Player:move(newX, newY)
    self.x = newX
    self.y = newY
end

KEY_W = 23
KEY_A = 01
KEY_S = 19
KEY_D = 04
KEY_UP = 58
KEY_DOWN = 59
KEY_LEFT = 60
KEY_RIGHT = 61


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
        self.last_dx = self.dx; self.last_dy = self.dy
        if not flag or #self.sprite.animation == 1 then
            self.sprite = Player.run_a:copy()
        end
    else
        self.sprite = Player.stay_a:copy()
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
    self:draw()

    if not self.boomerang then
        self:shoot()
    end

    if self.boomerang then
        self.boomerang:focus(self.x, self.y)
        self.boomerang:update()
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
    self.hitbox = Hitbox:new(self.x+2, self.y+1, self.x+5, self.y+7)
end


return Player
