CameraWindow = {}

function CameraWindow:new(deadZoneRect, target, targetWidth, targetHeight)
    local obj = {
        area = deadZoneRect,
        deadbeef = nil,
        target = target,
        targetWidth = targetWidth,
        targetHeight = targetHeight,

        shakeMagnitude = {},
        statuses = {},
        status = 'normal',
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
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

function CameraWindow:centerOnTarget()
    local dx = self.target.x + self.targetWidth  / 2 - self.area:centerX()
    local dy = self.target.y + self.targetHeight / 2 - self.area:centerY()

    -- Чтобы не камера не дергалась, когда уже достигла игрока
    if math.abs(dx) < 1 and math.abs(dy) < 1 then
        return
    end

    local length = math.sqrt(dx * dx + dy * dy)

    dx = dx / length
    dy = dy / length

    self.area:move(dx * CAMERA_SPEED, dy * CAMERA_SPEED)
end

function CameraWindow:getDirectionToTarget()
    local dx, dy = 0, 0

    if self.area:isObjectRight(self.target, self.targetWidth) then
        dx = 1
    elseif self.area:isObjectLeft(self.target) then
        dx = -1
    end

    if self.area:isObjectBelow(self.target, self.targetHeight) then
        dy = 1
    elseif self.area:isObjectAbove(self.target) then
        dy = -1
    end

    return dx, dy
end

function CameraWindow:shakeByDoor(magnitude)
    if not self.statuses['doork'] then
        self.statuses['doork'] = true
    end
    self.shakeMagnitude['doork'] = magnitude
end

function CameraWindow:shakeByBoomer(magnitude)
    if not self.statuses['boomer'] then
        self.statuses['boomer'] = true
    end
    self.shakeMagnitude['boomer'] = magnitude
end

function CameraWindow:shake(magnitude)
    --self.status = 'shake'
    --self.shakeMagnitude = magnitude
    if not self.statuses['shake'] then
        self.statuses['shake'] = true
    end
    self.shakeMagnitude['shake'] = magnitude
end

function CameraWindow:shakeByDoorStop()
    self.statuses['doork'] = false
end

function CameraWindow:shakeByBoomerStop()
    self.statuses['boomer'] = false
end

--function CameraWindow:shakeStop() -- TODO fix conflict with many shakes 😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑
--    self.status = 'normal'
--end

local function oneOrMinusOne()
    return math.random(0, 1) == 0 and -1 or 1
end

function CameraWindow:update()
    local dx, dy = self:getDirectionToTarget()

    if self.area:isObjectInside(self.target, self.targetWidth, self.targetHeight) then
        -- self:centerOnTarget()
        -- Ура, я использовал goto!!!
        goto move
    end

    if dx < 0 then
        self.area:moveLeftTo(self.target.x)
    elseif dx > 0 then
        self.area:moveRightTo(self.target.x + self.targetWidth)
    end

    if dy < 0 then
        self.area:moveUpTo(self.target.y)
    elseif dy > 0 then
        self.area:moveDownTo(self.target.y + self.targetHeight)
    end

    ::move::

    if self.statuses['doork'] then
        self.area:move(
            self.shakeMagnitude['doork'] * oneOrMinusOne(),
            self.shakeMagnitude['doork'] * oneOrMinusOne()
        )
    elseif self.statuses['boomer'] then
        self.area:move(
            self.shakeMagnitude['boomer'] * oneOrMinusOne(),
            self.shakeMagnitude['boomer'] * oneOrMinusOne()
        )
    elseif self.statuses['shake'] then
        self.area:move(
            self.shakeMagnitude['shake'] * oneOrMinusOne(),
            self.shakeMagnitude['shake'] * oneOrMinusOne()
        )
    end
    --if self.status == 'shake' then
    --    self.area:move(
    --        self.shakeMagnitude['shake'] * oneOrMinusOne(),
    --        self.shakeMagnitude['shake'] * oneOrMinusOne()
    --    )
    --end
    self:moveCamera()
end

return CameraWindow
