CameraWindow = {}

function CameraWindow:new(x1, y1, x2, y2)
    obj = {
        x = 0,
        y = 0,
        x1 = x1,
        y1 = y1,
        x2 = x2,
        y2 = y2,
        targetX = 0,
        targetY = 0,
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end

function CameraWindow:left()
    return self.x + self.x1
end

function CameraWindow:right()
    return self.x + self.x2
end

function CameraWindow:top()
    return self.y + self.y1
end

function CameraWindow:bottom()
    return self.y + self.y2
end

function CameraWindow:tryMove(x, y)
    dx = math.min(x - self:left(), self:right() - x)
    dy = math.min(y - self:top(), self:bottom() - y)

    if dx < 0 or dy < 0 then
        self:startFollow(x, y)
    end
end

function CameraWindow:startFollow(x, y)
    if x - self:right() > 0 then
        self.targetX = x - self.x2
    elseif self:left() - x > 0 then
        self.targetX = x - self.x1
    else
        self.targetX = self.x
    end

    if y - self:bottom() > 0 then
        self.targetY = y - self.y2
    elseif self:top() - y > 0 then
        self.targetY = y - self.y1
    else
        self.targetY = self.y
    end

    if not isMoving then
        isMoving = true
    end
end

function CameraWindow:trace()
    trace("Camera position: " .. '(' .. gm.x .. ', ' .. gm.y .. ') tiles, (' .. gm.sx .. ', ' .. gm.sy .. ') px')
end

function CameraWindow:move()
    gm.x = math.floor(self.x / 8)
    gm.sx = (gm.x - 1) * 8 - math.floor(self.x)
    gm.x = gm.x - math.floor(120 / 8)

    gm.y = math.floor(self.y / 8)
    gm.sy = (gm.y - 1) * 8 - math.floor(self.y)
    gm.y = gm.y - math.floor(68 / 8)

    self:trace()
end

function CameraWindow:drawDebug()
    local x = self.x + self.x1
    local y = self.y + self.y1
    local w = self.x2 - self.x1
    local h = self.y2 - self.y1

    rectb(x - gm.x * 8 + gm.sx, y - gm.y * 8 + gm.sy, w, h, 1)
end

CAMERA_SPEED = 0.1

function CameraWindow:update()
    if math.abs(self.x - self.targetX) < 0.1 and math.abs(self.y - self.targetY) < 0.1 then
        return
    end

    local dx = (self.targetX - self.x) * CAMERA_SPEED
    local dy = (self.targetY - self.y) * CAMERA_SPEED

    self.x = self.x + dx
    self.y = self.y + dy
    self:move()
end

return CameraWindow
