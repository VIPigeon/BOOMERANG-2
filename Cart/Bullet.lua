Bullet = table.copy(Body)

Bullet.defaultSprite = Sprite:new({373}, 1)

function Bullet:new(x, y, sprite)
    sprite = sprite or Bullet.defaultSprite

    local obj = {
        x = x,
        y = y,
        vector = {x = 0, y = 0},
        hitbox = HitCircle:new(x, y, 2), -- Hitbox:new_with_shift(x, y, x + 2, y + 2, 2, 2),
        speed = data.Bullet.defaultSpeed,
        sprite = sprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Bullet:setVelocity(x, y)
    self.vector = {x=x, y=y}
end

function Bullet:vectorUpdateByTarget(targetCoordX, targetCoordY)
    self.vector = {x = targetCoordX - self.x, y = targetCoordY - self.y}
    self.vector = math.vecNormalize(self.vector)
end

function Bullet:_move()
    self.x = self.x + self.vector.x * self.speed
    self.y = self.y + self.vector.y * self.speed
    self.hitbox:set_xy(self.x, self.y)
end

local count = 0
function Bullet:_destroy()
    table.insert(game.deleteSchedule, self)
end

function Bullet:_kill()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
        self:_destroy()
    end
end

function Bullet:_checkCollision()
    if not self.hitbox:mapCheck() then
        self:_destroy()
    end

    -- TODO: тут можно пользоваться тайлами двери, а не этими приколами 🤔🤔
    for _, door in ipairs(game.doors) do
        -- САМЫЙ БЕЗУМНЫЙ КОСТЫЛЬ
        if self.hitbox:collide(door.hitboxLeft) or
           self.hitbox:collide(door.hitboxRight)
        then
     -- begin
            self:_destroy()
        end
    end
end

function Bullet:update()
    self:_checkCollision()
    self:_move()
    self:_kill()
end

function Bullet:draw()
    --self.hitbox:draw(4)
    self.sprite:draw(self.x - 1 - gm.x*8 + gm.sx, self.y - 1 - gm.y*8 + gm.sy, self.flip, self.rotate)
end
