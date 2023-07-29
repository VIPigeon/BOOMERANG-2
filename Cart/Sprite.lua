
Sprite = {}


function Sprite:new(animation, size)
    local obj = {
        animation = animation,
        frame = 1,  -- номер кадра
        size = size  -- размер спрайта
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Sprite:getFrame()
    return self.frame
end

function Sprite:setFrame(frame)
    self.frame = math.round(frame)
end

function Sprite:nextFrame()
    self.frame = self.frame % #self.animation + 1
end

function Sprite:draw(x, y, flip, rotate)
    spr(self.animation[self.frame], x, y, C0, 1, flip, rotate, self.size, self.size)
end

function Sprite:animationEnd()
    return self.frame == #self.animation
end


function Sprite:copy()
    return Sprite:new(self.animation, self.size)
end


return Sprite
