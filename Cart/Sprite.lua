
Sprite = {}


function Sprite:new(animation, size)
    obj = {
        animation = animation,
        frame = 1,  -- номер кадра
        size = size  -- размер спрайта
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Sprite:get_frame(frame)
    return self.frame
end

function Sprite:set_frame(frame)
    self.frame = frame
end

function Sprite:next_frame()
    self.frame = self.frame % #self.animation + 1
end


function Sprite:draw(x, y, flip)
    -- print(self.animation[self.frame], 20, 20, 5)
    -- print(self.frame, 40, 40, 3)
    spr(self.animation[self.frame], x, y, C0, 1, flip, 0, self.size, self.size)
end


function Sprite:animation_end()
    return self.frame == #self.animation
end


function Sprite:copy()
    return Sprite:new(self.animation, self.size)
end


return Sprite
