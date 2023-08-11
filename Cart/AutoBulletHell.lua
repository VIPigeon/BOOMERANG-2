AutoBulletHell = table.copy(BulletHell)

function AutoBulletHell:_shoot()
    local byTouchId = self:_selectBullet()
    local bull = self:_createShootBullet()
    bull.x = self.bullets[byTouchId].x
    bull.y = self.bullets[byTouchId].y
    bull.hitbox:set_xy(bull.x, bull.y)

    local kawaiiCode = aim.superAim(bull.x, bull.y, self.bulletSpeed)
    bull:setVelocity(kawaiiCode.x, kawaiiCode.y)
    bull.speed = self.bulletSpeed
end

function aim.superAim(startX, startY, bulletSpeed)
    -- dirx, diry - направление к игроку
    -- local dirx = game.player.hitbox:get_center().x - startX
    -- local diry = game.player.hitbox:get_center().y - startY
    local dirx = -game.player.hitbox:get_center().x + startX  -- я не понимаю :(
    local diry = -game.player.hitbox:get_center().y + startY  -- ну ладно
    
    local dirX = game.player.dx
    local dirY = game.player.dy
    -- vx, vy - velocity крч. Она точно правильная
    local vx = dirX * game.player.speed
    local vy = dirY * game.player.speed
    if vx ~= 0 and vy ~= 0 then
        vx = vx * data.Player.movementNormalizerDiagonal
        vy = vy * data.Player.movementNormalizerDiagonal
    end

    local s = bulletSpeed

    -- Квадратное уравнение
    local a = vx*vx + vy*vy - s*s
    local b = dirx*vx + diry*vy
    local c = dirx*dirx + diry*diry
    local d = b*b - a * c
    local t = (-b + math.sqrt(d)) / a
    -- trace('t: ' .. t .. ' vx: ' .. vx .. ' vy: ' .. vy .. ' dirx: ' .. dirx .. ' diry: ' .. diry)

    -- Здесь по t находим нужную нам скорость (здесь может быть ошибка!)
    local resX = dirx/t + vx
    local resY = diry/t + vy

    local vec = math.vecNormalize({x=resX, y=resY})
    -- vec = {x=resX, y=resY}

    return {
        x = vec.x,
        y = vec.y,
    }
end
