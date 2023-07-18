
--  базовый класс

Body = {}


function Body:new(sprite, x, y)
    local obj = {
        sprite = sprite,
        hitbox = 'nil',
        flip = 0,
        rotate = 0,
        x = x, y = y,
        isDead = false,  -- в этой игре не нужно понятие здоровья
        born_flag = true
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Body:willCollideAfter(dx, dy)
    local oldX = self.x
    local oldY = self.y

    self:move(dx, dy)

    local will_collide = not self.hitbox:mapCheck()

    for i, door in ipairs(game.doorlever.doors) do
        if door:actually_checkCollision(self) then
            --trace('door')
            will_collide = true
        end
    end
    self:set_position(oldX, oldY)

    return will_collide
end

function Body:moveUnclamped(dx, dy)
    local newX = self.x + dx * Time.dt()
    local newY = self.y + dy * Time.dt()

    self.x = newX
    self.y = newY

    self.hitbox:set_xy(self.x, self.y)
end

function Body:move(dx, dy)
    local newX = self.x + dx * Time.dt()
    local newY = self.y + dy * Time.dt()

    self.x = newX
    self.y = newY

    --self.x = math.fence(newX, 0, 240 - 8)
    --self.y = math.fence(newY, 0, 136 - 8)

    self.hitbox:set_xy(self.x, self.y)
end

function Body:stay_in_borders()
    self.x = math.fence(newX, 0, 240 - 8)
    self.y = math.fence(newY, 0, 136 - 8)

    self.hitbox:set_xy(self.x, self.y)
end

function Body:set_position(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function Body:draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
end

function Body:born_update()
    self:draw()
    if self.sprite:animation_end() then
        self.born_flag = false
        return false
    end
    self.sprite:next_frame()
    return true
end


return Body
