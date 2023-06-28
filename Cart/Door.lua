Door = table.copy(Body)

function Door:new(x, y, lever)
    local w = 6
    local h = 4
    local speed = 0.03
    local opensUpTo = 6
    obj = {
    	x = x,  y = y,
        w = w, h = h,
        speed = speed,
        closeDx = 1.08,
        tempSpeed = speed,
        xleft = x, yup = y,
        xright = x + 8 * w // 2, ydown = y + 8 * h // 2,
    	hitboxLeft = Hitbox:new(x, y, x + 8 * w // 2, y + 8 * h),
        hitboxRight = Hitbox:new(x + 8 * w // 2, y, x + 8 * w, y + 8 * h),
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
    --self.hitboxLeft:draw(1)
    --self.hitboxRight:draw(1)
end

function Door:anime()
    return 'Nyan'
end

function Door:checkCollision(entity)
    --trace(self.hitboxLeft.x1..' '..self.hitboxRight.x1..' '..entity.hitbox.x1)
    if self.hitboxLeft:collide(entity.hitbox) then
        entity.x = self.xleft + 8 * self.w // 2 + entity.hitbox.shiftX
        return true
    elseif self.hitboxRight:collide(entity.hitbox) then
        entity.x = self.xright - (entity.hitbox.x2 - entity.hitbox.x1) - entity.hitbox.shiftX
        return true
    end        
end

function Door:actually_checkCollision(entity)
    --trace(self.hitboxLeft.x1..' '..self.hitboxRight.x1..' '..entity.hitbox.x1)
    if self.hitboxLeft:collide(entity.hitbox) then
        -- entity.x = self.xleft + 8 * self.w // 2 + entity.hitbox.shiftX
        return true
    elseif self.hitboxRight:collide(entity.hitbox) then
        -- entity.x = self.xright - (entity.hitbox.x2 - entity.hitbox.x1) - entity.hitbox.shiftX
        return true
    end        
    return false
end

function Door:update()
    --trace(self.lever.status)
    if not self.lever.status and not self.state then
        return
    end
    if not self.lever.status then
        if self.curFrame > 1 then
            self.curFrame = self.curFrame - self.tempSpeed * Time.dt()
            self.xleft = self.xleft + self.tempSpeed * Time.dt()
            self.xright = self.xright - self.tempSpeed * Time.dt()
            
            self.hitboxLeft:set_xy(self.xleft, self.yup) --= Hitbox:new(self.xleft, self.yup, self.x + 8 * self.w // 2, self.y + 8 * self.h)
            self.hitboxRight:set_xy(self.xright, self.yup) -- = Hitbox:new(self.xright, self.yup, self.x + 8 * self.w // 2, self.y + 8 * self.h)

            self.tempSpeed = self.tempSpeed * self.closeDx
        end
        if self.curFrame <= 1 then
            self.state = false
            self.tempSpeed = self.speed
        end
    elseif not self.state then
        if self.curFrame < self.maxFrame then
            self.curFrame = self.curFrame + self.speed * Time.dt()
            self.xleft = self.xleft - self.speed * Time.dt()
            self.xright = self.xright + self.speed * Time.dt()
            
            self.hitboxLeft:set_xy(self.xleft, self.yup) -- = Hitbox:new(self.xleft, self.yup, self.x + 8 * self.w // 2, self.y + 8 * self.h)
            self.hitboxRight:set_xy(self.xright, self.yup) -- = Hitbox:new(self.xright, self.yup, self.x + 8 * self.w // 2, self.y + 8 * self.h)
        end
        if self.curFrame >= self.maxFrame then
            self.state = true
        end
    else
        return
    end

end

function Door:changeState()
	if self.state then
        self.state = false
        
    else
        self.state = true
        
    end
end

return Door