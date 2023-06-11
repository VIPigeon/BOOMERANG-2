
--  базовый класс

Body = {}


function Body:new(sprite, x, y)
    obj = {
        sprite = sprite,
        hitbox = 'nil',
        flip = 0,
        x = x, y = y,
        isDead = false,  -- в этой игре не нужно понятие здоровья
        born_flag = true
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Body:die()
    trace("I AM DEAD!!!")
end

function Body:is_dead()
    return self.hp == 0
end

function Body:take_damage(damage)
    trace("HP: " .. self.hp)

    self.hp = math.fence(self.hp - damage, 0, self.hp)

    if self:is_dead() then
        self.isDead = true
    end
end

function Body:will_collide_after(dx, dy)
    local oldX = self.x
    local oldY = self.y

    self:move(dx, dy)

    local will_collide = not self.hitbox:mapCheck()

    self:set_position(oldX, oldY)

    return will_collide
end

function Body:move_unclamped(dx, dy)
    local newX = self.x + dx * Time.dt()
    local newY = self.y + dy * Time.dt()

    self.x = newX
    self.y = newY

    self.hitbox:set_xy(self.x, self.y)
end

function Body:move(dx, dy)
    local newX = self.x + dx * Time.dt()
    local newY = self.y + dy * Time.dt()

    self.x = math.fence(newX, 0, 240 - 8)
    self.y = math.fence(newY, 0, 136 - 8)

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
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip)
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
