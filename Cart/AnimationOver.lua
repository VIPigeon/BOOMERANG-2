--Эпикграф

    -- " --А я не дурак 😉"

AnimationOver = {}

function AnimationOver:new(sprite, focusStatus, preInitStatus)
    local startStatus = 'waiting'
    if preInitStatus ~= nil then
        startStatus = preInitStatus
    end

    local obj2 = {
        x = 0,
        y = 0,
        sprite = sprite:copy(),
        flip = 0, -- for sprite drawing
        rotate = 0, -- for sprite drawing
        status = startStatus,
        focusStatus = focusStatus,
        is_focused = false,
    }

    -- чистая магия!
    setmetatable(obj2, self)
    self.__index = self;
    return obj2
end

function AnimationOver.clearUsuless(currentAnimations) -- если много анимаций накопилось, можно их очистить, круто
    local newCurrentAnimations = {}    
    for _, anime in ipairs(currentAnimations) do
        if anime.status ~= 'garbage' then
            table.insert(newCurrentAnimations, anime)
        end
    end

    return newCurrentAnimations
end

function AnimationOver:changeStats(newStats)
    --meh {x = newX, y = NewY, sprite = ...}
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

function AnimationOver:activateSingleTimeWithDelitionFlag() -- можете звать это костылём...
    self.status = 'activeOnesDelete'
end

function AnimationOver:focus(x1, y1, x2, y2) -- focusing on target area
    if self.is_focused then
        return
    end
    if self.focusStatus == 'static' then
        self.x = x1
        self.y = y1
        self.is_focused = true
    elseif self.focusStatus == 'randomOn' then
        self.x = x1 + math.random(math.ceil(x2 - x1))
        self.y = y1 + math.random(math.ceil(y2 - y1))
        self.is_focused = true
    end
    
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
    elseif self.status == 'activeOnesDelete' then
        self:_draw()
        self:_spriteUpdate()
        if self.sprite:animationEnd() then
            self.status = 'garbage'
        end
    end
end