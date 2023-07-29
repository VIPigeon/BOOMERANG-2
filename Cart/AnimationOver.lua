AnimationOver = {}

function AnimationOver:new(sprite)
    local obj2 = {
        x = 0,
        y = 0,
        sprite = sprite:copy(),
        flip = 0, -- for sprite drawing
        rotate = 0, -- for sprite drawing
        status = 'waiting',
    }

    -- чистая магия!
    setmetatable(obj2, self)
    self.__index = self;
    return obj2
end

function AnimationOver:activate()
    self.status = 'active'
end

function AnimationOver:deActivate()
    self.status = 'waiting'
end

function AnimationOver:activateSingleTime()
    self.status = 'activeOnes'
end

function AnimationOver:focus(x, y) -- focusing on x, y
   self.x = x
   self.y = y
end

function AnimationOver:_draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate) -- drawing~
end

function AnimationOver:_spriteUpdate()
    --trace('updating sprite')
    self.sprite:nextFrame() -- nexting~
end

function AnimationOver:play() -- playing the animation
    if self.status == 'active' then
        self:_draw()
        self:_spriteUpdate()

    elseif self.status == 'activeOnes' then
        self:_draw()
        self:_spriteUpdate()
        if self.sprite:animationEnd() then
            self.status = 'waiting'
        end
    end
end