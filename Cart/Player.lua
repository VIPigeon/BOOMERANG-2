Player = table.copy(Body)

Player.stayFront = data.Player.sprites.stayFront
Player.stayBack = data.Player.sprites.stayBack
Player.runFront = data.Player.sprites.runFront
Player.runBack = data.Player.sprites.runBack

Player.death = data.Player.sprites.death
Player.hat = data.Player.sprites.hat

function Player:new(x, y, boomerang)
    local obj = {
        sprite = Player.stayFront:copy(),
        startX = x,
        startY = y,
        verticalFlip = false,
        x = x,
        y = y,
        lastDx = 1, lastDy = 0,
        dx = 0,
        dy = 0,
        speed = data.Player.speed,
        flip = 0,  -- направление при отрисовке спрайта
        hitbox = Hitbox:new_with_shift(x, y, x+3, y+6, 2, 1),
        boomerang = boomerang,
        boomerangActive = false,
        status = 'alive',
        deathDurationMs = data.Player.deathAnimationDurationMs,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Player:getPositionTile()
    return {x = self.x // 8, y = self.y // 8}
end

function Player:_willMoveCheck()
    self.dx = 0
    self.dy = 0 -- chill bro~~

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

        frame = self.sprite:getFrame()
        self.sprite:setFrame(frame)

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
    self.boomerang.active = true

    if key(KEY_UP) then
        self.boomerang:init(self.x, self.y, C0, -1) -- С0 - яйца самого лучшего качества 
        return
    end
    if key(KEY_DOWN) then
        self.boomerang:init(self.x, self.y, C0, 1)
        return
    end
    if key(KEY_LEFT) then
        self.boomerang:init(self.x, self.y, -1, C0)
        return
    end
    if key(KEY_RIGHT) then
        self.boomerang:init(self.x, self.y, 1, C0)
        return
    end

    self.boomerang.active = false
end

function Player:_createDeathEffect()
    local x = self.x
    local y = self.y

    local particleCount = math.random(data.Player.deathParticleCountMin, data.Player.deathParticleCountMax)
    local particleSpeed = data.Player.deathAnimationParticleSpeed

    local function randomSide()
        return 2 * math.random() - 1
    end

    particles = {}
    for i = 1, particleCount do
        local spawnx = x + randomSide()
        local spawny = y + randomSide()
        particles[i] = Particle:new(spawnx, spawny, data.Player.deathParticleSprite)

        local dx = randomSide()
        local dy = randomSide()
        particles[i]:setVelocity(particleSpeed * dx, particleSpeed * dy)
    end
end

function Player:die()
    if self.status == 'dying' then
        return
    end

    self.sprite = Player.death:copy()
    self.sprite:setFrame(1)
    self:_createDeathEffect()
    local time = 0
    local step = self.deathDurationMs / #Player.death.animation
    self.deathTimer = function()
        time = time + Time.dt()
        self.sprite:setFrame(1 + time / step)
        return time > self.deathDurationMs
    end
    self.status = 'dying'
end

function Player:boomerangHandle()
    if not self.boomerang.active then
        self:_shoot() -- *dead*
    end
end

function Player:update()
    if self.status == 'dying' then
        isDead = self.deathTimer()
        if isDead then
            self.status = 'alive'
            game.restart()
        end
        return
    end

    if keyp(KEY_R) then
        -- Smert :)
        self:die()
        return
    end

    self:_willMoveCheck() -- wanna move?~

    self:_verticalFlipCalculator() -- will flip?

    self:_horizontalFlipCalculator() -- will flip??

    self.sprite:nextFrame()

    self:_tryMove(self:_movementNormalizerGen()) -- MOVED‼

    self:boomerangHandle() -- Boomer go brrrrr
end

return Player
