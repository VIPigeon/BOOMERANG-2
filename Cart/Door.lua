Door = table.copy(Body)

function Door:new(x, y, lever)
    local w = 6
    local h = 4
    local opensUpTo = 6
    obj = {
    	x = x,  y = y,
        w = w, h = h,
        Speed = 1.0,
        closeDx = 1.0,
        xleft = x, yup = y,
        xright = x + 8 * w // 2, ydown = y + 8 * h // 2,
    	hitboxLeft = Hitbox:new(xleft, yleft, x + 8 * w // 2, y + 8 * h // 2),
        hitboxRight = Hitbox:new(xright, yright, x + 8 * w // 2, y + 8 * h // 2),
        lever = lever,
        state = false,
        curFrame = 1,
        maxFrame = 8 // 2 * w - opensUpTo
    }

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self;
    return obj
end

function Door:draw()
    local xleft = math.floor(self.xleft - gm.x*8 + gm.sx)
    local yup = self.yup - gm.y*8 + gm.sy
    local xright = math.floor(self.xright - gm.x*8 + gm.sx)
    local ydown = self.ydown - gm.y*8 + gm.sy
    local w = self.w
    local h = self.h
    --LeftUpSide
    spr(34, xleft, yup, C0, 1, 0, 0, 2, 2)
    spr(36, xleft + 8 * w // 3, yup, C0, 1, 0, 0, 1, 1)
    spr(52, xleft + 8 * w // 3, yup + 8 * (h // 2 - 1), C0, 1, 0, 0, 1, 1)
    --LeftLowSide
    spr(34, xleft, ydown, C0, 1, 2, 0, 2, 2)
    spr(52, xleft + 8 * w // 3, ydown, C0, 1, 2, 0, 1, 1)
    spr(36, xleft + 8 * w // 3, ydown + 8 * (h // 2 - 1), C0, 1, 2, 0, 1, 1)
    --RightUpSide
    spr(34, xright + 8 * w // 6, yup, C0, 1, 1, 0, 2, 2)
    spr(36, xright, yup, C0, 1, 1, 0, 1, 1)
    spr(52, xright, yup + 8 * (h // 2 - 1), C0, 1, 1, 0, 1, 1)
    --RightLowSide
    spr(34, xright + 8 * w // 6, ydown, C0, 1, 3, 0, 2, 2)
    spr(52, xright, ydown, C0, 1, 3, 0, 1, 1)
    spr(36, xright, ydown + 8 * (h // 2 - 1), C0, 1, 3, 0, 1, 1)
end

function Door:anime()
end

function Door:update()
    --trace(self.lever.status)
    if not self.lever.status and not self.state then
        return
    end
    if not self.lever.status then
        if self.curFrame > 1 then
            self.curFrame = self.curFrame - 1
            self.xleft = self.xleft + 1
            self.xright = self.xright - 1
        end
        if self.curFrame == 1 then
            self.state = false
        end
    elseif not self.state then
        if self.curFrame < self.maxFrame then
            self.curFrame = self.curFrame + 1
            self.xleft = self.xleft - 1
            self.xright = self.xright + 1
        end
        if self.curFrame == self.maxFrame then
            self.state = true
        end
    else
        return
    end
    --self:draw()


end

function Door:changeState()
	if self.state then
        self.state = false
        
    else
        self.state = true
        
    end
end

return Door