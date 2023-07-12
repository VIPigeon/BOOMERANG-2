Player = table.copy(Body)

Player.stayFront = data.Player.sprites.stayFront
Player.stayBack = data.Player.sprites.stayBack
Player.runFront = data.Player.sprites.runFront
Player.runBack = data.Player.sprites.runBack

Player.death = data.Player.sprites.death
Player.born = data.Player.sprites.born
Player.hat = data.Player.sprites.hat

function Player:new(x, y)
    obj = {
        sprite = Player.born:copy(),
        startX = x, startY = y,
        verticalFlip = false,
        x = x, y = y,
        lastDx = 1, lastDy = 0,
        dx = 0, dy = 0, speed = data.Player.speed,
        flip = 0,  -- направление при отрисовке спрайта
        hitbox = Hitbox:new_with_shift(x, y, x+3, y+6, 2, 1),
        boomerang = false,
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Player:_willMoveCheck()
    self.dx = 0; self.dy = 0 -- chill bro~~

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
end

function Player:_verticalFlipCalculator()
    local wasMoving = false
    if math.abs(self.dx) + math.abs(self.dy) ~= 0 then  -- was moving~
        wasMoving = true
    end

    if math.abs(self.dx) + math.abs(self.dy) ~= 0 then  -- is moving~
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
end

function Player:_horizontalFlipCalculator()
    if self.dx == -1 then
        self.flip = 1
    elseif self.dx == 1 then
        self.flip = 0
    end
end

function Player:_tryMove(movementNormalizer)
    local dx = self.dx * self.speed * movementNormalizer
    local dy = self.dy * self.speed * movementNormalizer

    if self:willCollideAfter(dx, dy) then
        if not self:willCollideAfter(dx, 0) then
            self:move(dx, 0)
        end
        if not self:willCollideAfter(0, dy) then
            self:move(0, dy)
        end
    else
        self:move(dx, dy)
    end
end

function Player:_movementNormalizerGen()
    local movementNormalizer = data.Player.movementNormalizerStraight
    if self.dx * self.dy ~= 0 then
       movementNormalizer = data.Player.movementNormalizerDiagonal
    end
    return movementNormalizer
end

function Player:_shoot()
    self.shooted = true

    if key(KEY_UP) then
        self.boomerang = Boomerang:new(self.x, self.y, 0, -1)
        return
    end
    if key(KEY_DOWN) then
        self.boomerang = Boomerang:new(self.x, self.y, 0, 1)
        return
    end
    if key(KEY_LEFT) then
        self.boomerang = Boomerang:new(self.x, self.y, -1, 0)
        return
    end
    if key(KEY_RIGHT) then
        self.boomerang = Boomerang:new(self.x, self.y, 1, 0)
        return
    end

    self.shooted = false
end

function Player:boomerangHandle()
    if not self.boomerang then
        self:_shoot() -- *dead*
    end
    if self.boomerang then
        self.boomerang:focus(self.x, self.y)
        self.boomerang:update()
        if self.boomerang.hitbox:collide(self.hitbox) and
                self.boomerang.speed < self.speed then
            self.boomerang = false
        end
    end
end

function Player:update()
    self:_willMoveCheck() -- wanna move?~

    self:_verticalFlipCalculator() -- will flip?

    self:_horizontalFlipCalculator() -- will flip??

    self.sprite:next_frame()

    self:_tryMove(self:_movementNormalizerGen()) -- MOVED‼

    self:boomerangHandle()
end

return Player
