BulletHell = table.copy(Enemy)

function BulletHell:new(x, y, type, color)
    local bullets = {}
    for i = 1, data.BulletHell.bulletCount[type] do
        bullets[i] = HellBullet:new()
    end

    color = color or 14 -- lol

    local object = {
        x = x,
        y = y,
        type = type,
        spread = data.BulletHell.bulletSpeadRadius[type],
        bullets = bullets,
        bulletCount = data.BulletHell.bulletCount[type],
        bulletSpeed = data.BulletHell.bulletSpeed[type],
        deathBulletSpeed = data.BulletHell.deathBulletSpeed[type],
        bulletRotateSpeed = data.BulletHell.bulletRotateSpeed[type],
        hp = data.BulletHell.hp[type],
        hitbox = HitCircle:new(x, y, data.BulletHell.circleDiameter[type]),
        time = 0,
        status = '',
        color = color,

        reloadingBullets = {},
        currentAnimations = {},

        isActive = false,
    }

    BulletHell._moveBullets(object, 0)

    setmetatable(object, self)
    self.__index = self
    return object
end

function BulletHell:_selectBullet()
    local minDist = 2147483647
    local minId = -1
    for i, bull in ipairs(self.bullets) do
        local dirX = game.player.x - bull.x
        local dirY = game.player.y - bull.y
        local dist = math.sqrt(dirX * dirX + dirY * dirY)
        if dist < minDist then
            minDist = dist
            minId = i
        end
    end

    local byTouchId = (minId + data.BulletHell.bulletCount[self.type] - data.BulletHell.bulletCount[self.type] // 4 - 1) % data.BulletHell.bulletCount[self.type] + 1
    table.insert(self.reloadingBullets, self.bullets[(byTouchId - 1) % 8 + 1])

    return byTouchId
end

function BulletHell:_shoot()
    local byTouchId = self:_selectBullet()
    local bull = self:_createShootBullet()
    bull.x = self.bullets[byTouchId].x
    bull.y = self.bullets[byTouchId].y
    bull.hitbox:set_xy(bull.x, bull.y)
    bull:vectorUpdateByTarget(game.player.x, game.player.y)
end

function BulletHell:_createShootBullet()
    local bull = Bullet:new(0, 0)
    bull.speed = self.bulletSpeed
    
    table.insert(game.drawables, bull)
    table.insert(game.updatables, bull)

    return bull
end

function BulletHell:launchBulletsAround()
    for i = 1, #self.bullets do
        local bullet = self:_createShootBullet()
        bullet.x = self.bullets[i].x
        bullet.y = self.bullets[i].y
        bullet.hitbox:set_xy(bullet.x, bullet.y)

        local directionX = bullet.x - self.x
        local directionY = bullet.y - self.y

        local speed = self.deathBulletSpeed

        bullet:setVelocity(speed * directionX, speed * directionY)
    end
end

function BulletHell:update()
    if self.isActive then
        if self.status == 'dying' then
            self.deathTick()
            return
        end

        if self:isDeadCheck() then
            self:launchBulletsAround()
            local time = 0
            self.status = 'dying'
            self.deathTick = function()
                time = time + Time.dt()
                if time > data.BulletHell.deathTimeMs then
                    self:die()
                end
            end
            return
        end

        if game.metronome.onBeat then
            self:_shoot()
        end

        if self.hitbox:collide(game.boomer.hitbox) then
            local damage = game.boomer.dpMs * Time.dt()
            self:takeDamage(damage)
        end

        for i = 1, #self.bullets do
            self.bullets[i]:update()
        end

        self:_focusAnimations()
    else
        return
    end
end

function BulletHell._moveBullets(bullethell, offset)
    local step = 2 * math.pi / bullethell.bulletCount
    for i = 1, #bullethell.bullets do
        local x = math.round(bullethell.spread * math.cos((i + offset) * step))
        local y = math.round(bullethell.spread * math.sin((i + offset) * step))
        local bullet = bullethell.bullets[i]
        bullet:setPos(bullethell.x + x, bullethell.y + y) --не настоящие пули
    end
end

function BulletHell:draw()
    if self.status == 'dying' then
        self.hitbox:drawOutline(14)
        return
    end

    if true then
        local progress = 1 - (game.metronome:msBeforeNextBeat() / game.metronome.msPerBeat)

        self:_moveBullets(progress)

        if #self.reloadingBullets > 0 then
            deletedBullet = nil
            for _, bullet in ipairs(self.reloadingBullets) do
                bullet:nextFrame()
                if bullet.sprite:animationEnd() then
                    deletedBullet = bullet
                end
            end

            if deletedBullet then
                deletedBullet:nextFrame()
                table.removeElement(self.reloadingBullets, deletedBullet)
            end
        end
    end

    self.hitbox:draw(self.color)

    for i = 1, #self.bullets do
        self.bullets[i]:draw()
    end

    self:_drawAnimations()
end

AutoBulletHell = table.copy(BulletHell)

function AutoBulletHell:_shoot()
    local byTouchId = self:_selectBullet()
    local bull = self:_createShootBullet()
    bull.x = self.bullets[byTouchId].x
    bull.y = self.bullets[byTouchId].y
    trace('before: ' .. bull.x .. ' ' .. bull.y)
    bull.hitbox:set_xy(bull.x, bull.y)
    local kawaiiCode = self:_superAim(bull.x, bull.y)
    bull:setVelocity(kawaiiCode.x, kawaiiCode.y)
    bull.speed = self.bulletSpeed
    trace('after: ' .. bull.x .. ' ' .. bull.y)
end

function AutoBulletHell:_superAim(startX, startY)
    -- dirx, diry - направление к игроку
    local dirx = game.player.hitbox:get_center().x - startX
    local diry = game.player.hitbox:get_center().y - startY
    
    local dirX = game.player.dx
    local dirY = game.player.dy
    -- vx, vy - velocity крч. Она точно правильная
    local vx = dirX * game.player.speed
    local vy = dirY * game.player.speed
    if vx ~= 0 and vy ~= 0 then
        vx = vx * data.Player.movementNormalizerDiagonal
        vy = vy * data.Player.movementNormalizerDiagonal
    end

    local s = self.bulletSpeed

    -- Квадратное уравнение
    local a = vx*vx + vy*vy - s*s
    local b = dirx*vx + diry*vy
    local c = dirx*dirx + diry*diry
    local d = b*b - a * c
    local t = (b + math.sqrt(d)) / a
    trace('t: ' .. t .. ' vx: ' .. vx .. ' vy: ' .. vy .. ' dirx: ' .. dirx .. ' diry: ' .. diry)

    -- Здесь по t находим нужную нам скорость (здесь может быть ошибка!)
    local resX = dirx/t + vx
    local resY = diry/t + vy

    vec = math.vecNormalize({x=resX, y=resY})

    trace('rx: ' .. vec.x .. ' ' .. 'ry: ' .. vec.y)

    return {
        x = vec.x,
        y = vec.y,
    }
end
