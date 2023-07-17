-- Добавить CameraWindow в kawaiiRefactoring.
-- 
--  Камера является полем game
--  Камера обновляется сразу после Player
--  Добавить функцию тряски экрана. Для демонстрации сделать так, чтобы она вызывалась по нажатию пробела


CameraWindow = {}

function CameraWindow:new(rect, target)
    local speedUp = 10

    obj = {
        area = rect,
        speedupArea = Rect:new(
            rect.x - speedUp, rect.y - speedUp,
            rect.w + speedUp * 2, rect.h + speedUp * 2
        ),
        target = target,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
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

function CameraWindow:moveCamera()
    local centerX = math.floor(self.area:centerX())
    local centerY = math.floor(self.area:centerY())
    local tileX = math.floor(self.area:centerX() / 8)
    local tileY = math.floor(self.area:centerY() / 8)

    gm.x = tileX - math.floor(120 / 8)
    gm.sx = 8 * (tileX) - centerX

    gm.y = tileY - math.floor(68 / 8)
    gm.sy = 8 * (tileY) - centerY
end

function CameraWindow:getDirectionToTarget()
    local dx, dy = 0, 0

    if self.area:isObjectRight(self.target) then
        dx = 1
    elseif self.area:isObjectLeft(self.target) then
        dx = -1
    end

    if self.area:isObjectBelow(self.target) then
        dy = 1
    elseif self.area:isObjectAbove(self.target) then
        dy = -1
    end

    if dx ~= 0 and not dy ~= 0 then
        dx = dx * (1 / math.sqrt(2))
        dy = dy * (1 / math.sqrt(2))
    end

    return dx, dy
end

local CAMERA_SPEEDUP_FACTOR = 3

function CameraWindow:update()
    self.area:drawDebug()

    if self.area:isObjectInside(self.target) then
        return
    end

    local dx, dy = self:getDirectionToTarget()

    -- local dx = (self.target.x - self.area:centerX()) * CAMERA_SPEED
    -- local dy = (self.target.y - self.area:centerY()) * CAMERA_SPEED

    if not self.speedupArea:isObjectInside(self.target) then
        self.area:move(dx * CAMERA_SPEEDUP_FACTOR * CAMERA_SPEED, dy * CAMERA_SPEEDUP_FACTOR * CAMERA_SPEED)
        self.speedupArea:move(dx * CAMERA_SPEEDUP_FACTOR * CAMERA_SPEED, dy * CAMERA_SPEEDUP_FACTOR * CAMERA_SPEED)
    else
        self.area:move(dx * CAMERA_SPEED, dy * CAMERA_SPEED)
        self.speedupArea:move(dx * CAMERA_SPEED, dy * CAMERA_SPEED)
    end

    self:moveCamera()
end

return CameraWindow
