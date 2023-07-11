Player = table.copy(Body)
Player.stayFront = Sprite:new(data.Player.tiles.stayFrontTiles, 1)
Player.runFront = Sprite:new(anim.gen60(runFrontTiles), 1)
Player.deathFront = Sprite:new(anim.gen60(data.Player.tiles.deathTiles), 1)
Player.bornFront = Sprite:new(anim.gen60(data.Player.tiles.bornTiles), 1)
Player.hatFront = Sprite:new(anim.gen60(data.Player.tiles.hatTiles), 1)

Player.stayBack = Sprite:new(data.Player.tiles.stayBackTiles, 1)
Player.runBack = Sprite:new(anim.gen60(data.Player.tiles.runBackTiles), 1)

function Player:new(x, y)
    obj = {
        sprite = Player.bornFront:copy(),
        startX = x, startY = y,
        verticalFlip = false,
        x = x, y = y,
        lastDx = 1, lastDy = 0,
        dx = 0, dy = 0, speed = 0.07,
        flip = 0,  -- направление при отрисовке спрайта
        hitbox = Hitbox:new_with_shift(x, y, x+3, y+6, 2, 1),
        hp = 1,
        bornFlag = true,
        boomerang = false
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Player:_tryMove(movementNormalizer)
    local dx = self.dx * self.speed * movementNormalizer
    local dy = self.dy * self.speed * movementNormalizer

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

    if self.bornFlag then
        if not self:born_update() then  -- если рождение закончилось
            self.sprite = Player.stayFront:copy()
            self.bornFlag = false
        end
        return
    end

    wasMoving = false
    if math.abs(self.dx) + math.abs(self.dy) ~= 0 then  -- was moving
        wasMoving = true
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
        self.lastDx = self.dx;
        self.lastDy = self.dy

        frame = self.sprite:get_frame()
        self.sprite:set_frame(frame)
        
        if self.dy < 0 and not self.verticalFlip then
            self.verticalFlip = true
            self.sprite = Player.runBack:copy();
        elseif self.dy > 0 and self.verticalFlip then
            self.verticalFlip = false
            self.sprite = Player.runFront:copy();
        end

        if not wasMoving or #self.sprite.animation == 1 then
            if self.verticalFlip then
                self.sprite = Player.runBack:copy()
            else
                self.sprite = Player.runFront:copy()
            end
        end
    else
        if self.verticalFlip then
            self.sprite = Player.stayBack:copy()
        else
            self.sprite = Player.stayFront:copy()
        end
    end

    if self.dx == -1 then
        self.flip = 1
    elseif self.dx == 1 then
        self.flip = 0
    end    

    self.sprite:next_frame()

    movementNormalizer = data.Player.movementNormalizerStraight
    if self.dx * self.dy ~= 0 then
       movementNormalizer = data.Player.movementNormalizerDiagonal
    end
    self:_tryMove(movementNormalizer)
end

function Player:set_start_stats()
    self.hp = 1
    self.boomerang = false
    self.x = self.startX
    self.y = self.startY
    self.sprite = Player.bornFront:copy()
    self.bornFlag = true
    self.hitbox = Hitbox:new_with_shift(self.startX, self.startY, self.startX + 3, self.startY + 6, 2, 1)
end


return Player
