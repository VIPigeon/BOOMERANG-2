Rect = {}

-- (x y): left top coordinates
function Rect:new(x, y, w, h)
    obj = {
        x = x,
        y = y,
        w = w,
        h = h,
        halfWidth = w / 2,
        halfHeight = h / 2,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Rect:left()
    return self.x
end

function Rect:right()
    return self.x + self.w
end

function Rect:up()
    return self.y
end

function Rect:down()
    return self.y + self.h
end

function Rect:centerX()
    return self.x + self.halfWidth
end

function Rect:centerY()
    return self.y + self.halfHeight
end

function Rect:isObjectRight(object)
    return self:right() < object.x
end

function Rect:isObjectLeft(object)
    return self.x > object.x
end

function Rect:isObjectAbove(object)
    return self.y > object.y
end

function Rect:isObjectBelow(object)
    return self:down() < object.y
end

function Rect:isObjectInside(object)
    return not self:isObjectAbove(object) and
           not self:isObjectBelow(object) and
           not self:isObjectLeft(object) and
           not self:isObjectRight(object)
end

function Rect:move(dx, dy)
    self.x = self.x + dx
    self.y = self.y + dy
end

function Rect:moveCenterTo(x, y)
    self.x = x - self.halfWidth
    self.y = y - self.halfHeight
end

function Rect:drawDebug()
    rect(
        self.x - gm.x * 8 + gm.sx,
        self.y - gm.y * 8 + gm.sy,
        self.w,
        self.h,
        1
    )
end

