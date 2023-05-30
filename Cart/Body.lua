
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


-- function Body:is_dead()
--     return (self.hp == 0)
-- end


-- function Body:take_damage(damage)
--     self.hp = fence(self.hp - damage, 0, self.hp)
-- end


function Body:draw()
    self.sprite:draw(self.x - gm.x*8 + sx, self.y - gm.y*8 + sy, self.flip)
end


function Body:born_update()
    self:draw()
    -- trace('born')
    if self.sprite:animation_end() then
        self.born_flag = false
        return false
    end
    self.sprite:next_frame()
    return true
end


return Body
