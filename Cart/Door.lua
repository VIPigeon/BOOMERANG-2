Door = table.copy(Body)

function Door:new(x, y) --калитка только из двух частей(
    local rectangleLeft = Rect:new(x, y, 8 * data.Door.widthTiles // 2, 8 * data.Door.heightTiles)
    local rectangleRight = Rect:new(rectangleLeft:right(), y, 8 * data.Door.widthTiles // 2, 8 * data.Door.heightTiles)
    local object1 = {
        x = x,
        y = y,
        rectL = rectangleLeft,
        rectR = rectangleRight,
        speed = data.Door.speed,
        status = 'close',
        hitboxLeft = Hitbox:new(rectangleLeft:left(), rectangleLeft:up(), rectangleLeft:right(), rectangleLeft:down()),
        hitboxRight = Hitbox:new(rectangleRight:left(), rectangleRight:up(), rectangleRight:right(), rectangleRight:down()),
    }

    setmetatable(object1, self)
    self.__index = self
    return object1
end

-- Вызывается управляющим рычагом 😄
function Door:statusUpdate(leverStatus)
    if leverStatus == 'off' then
        self.status = 'close'
    elseif leverStatus == 'on' then
        self.status = 'open'
    end
end

function Door:_colliding()
    --if self:willCollideAfter(0,0) then 0x0
    if self.hitboxLeft:collide(game.player.hitbox) and self.hitboxRight:collide(game.player.hitbox) then
        game.player:die()
    elseif self.hitboxLeft:collide(game.player.hitbox) and math.inRangeNotIncl(game.player.y, self.hitboxLeft.y1, self.hitboxLeft.y2) then
        game.player:move(self.speed, 0)
    elseif self.hitboxRight:collide(game.player.hitbox) and math.inRangeNotIncl(game.player.y, self.hitboxRight.y1, self.hitboxRight.y2) then
        game.player:move(-self.speed, 0)
    end

    for _, collider in ipairs(game.enemies) do
        if self.hitboxLeft:collide(collider.hitbox) and self.hitboxRight:collide(collider.hitbox) then
            collider:die()
        elseif self.hitboxLeft:collide(collider.hitbox) and math.inRangeNotIncl(collider.y, self.hitboxLeft.y1, self.hitboxLeft.y2) then
            collider:move(self.speed, 0)
        elseif self.hitboxRight:collide(collider.hitbox) and math.inRangeNotIncl(collider.y, self.hitboxRight.y1, self.hitboxRight.y2) then
            collider:move(-self.speed, 0)
        end
    end
end

function Door:_closing()
    self:_colliding()
    if not (self.hitboxLeft.x2 >= self.x + self.rectL.w) then
        self.rectL:move(self.speed, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    end
    if not (self.hitboxRight.x1 <= self.x + self.rectR.w) then
        self.rectR:move(-self.speed, 0)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    end
<<<<<<< Updated upstream

=======
    self.speed = self.speed + data.Door.closingAcceleration
>>>>>>> Stashed changes
end

function Door:_opening() -- whers ending, i like it more!
    if not (self.hitboxLeft.x2 <= self.x) then
        self.rectL:move(-self.speed, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
        
    end
    if not (self.hitboxRight.x1 >= self.x + 2 * self.rectL.w) then
        self.rectR:move(self.speed, 0)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
        
    end
end

local UpperLeftTileX2 = data.Door.spriteTiles.upperLeft -- отсюда рисуем на два тайла вперёд!
local UpperRightTile = data.Door.spriteTiles.upperRight
local BottomRightTile = data.Door.spriteTiles.bottomRight

function Door:draw()
    local xleft = math.floor(self.rectL:left() - gm.x*8 + gm.sx)
    local yup = self.rectL:up() - gm.y*8 + gm.sy
    local xright = math.floor(self.rectR:left() - gm.x*8 + gm.sx)
    local ydownHalf = self.rectR:down() - self.rectR.w / 1.5 - gm.y*8 + gm.sy
    local w = 2 * self.rectL.w
    local h = self.rectL.h

    --LeftUpSide
    spr(UpperLeftTileX2, xleft, yup, C0, 1, 0, 0, 2, 2)
    spr(UpperRightTile, xleft + w // 3, yup, C0, 1, 0, 0, 1, 1)
    spr(BottomRightTile, xleft + w // 3, yup + (h // 2 - 8), C0, 1, 0, 0, 1, 1)
    --LeftLowSide
    spr(UpperLeftTileX2, xleft, ydownHalf, C0, 1, 2, 0, 2, 2)
    spr(BottomRightTile, xleft + w // 3, ydownHalf, C0, 1, 2, 0, 1, 1)
    spr(UpperRightTile, xleft + w // 3, ydownHalf + 8 * 1, C0, 1, 2, 0, 1, 1)
    --RightUpSide
    spr(UpperLeftTileX2, xright + w // 6, yup, C0, 1, 1, 0, 2, 2)
    spr(UpperRightTile, xright, yup, C0, 1, 1, 0, 1, 1)
    spr(BottomRightTile, xright, yup + (h // 2 - 8), C0, 1, 1, 0, 1, 1)
    --RightLowSide
    spr(UpperLeftTileX2, xright + w // 6, ydownHalf, C0, 1, 3, 0, 2, 2)
    spr(BottomRightTile, xright, ydownHalf, C0, 1, 3, 0, 1, 1)
    spr(UpperRightTile, xright, ydownHalf + 8 * 1, C0, 1, 3, 0, 1, 1)
    --self.rectL:drawDebug()
    --self.rectR:drawDebug()
    
    --self.hitboxLeft:draw(1)
    --self.hitboxRight:draw(2)
end

function Door:update()
    self:draw()
    if self.status == 'close' then
        self:_closing()
    elseif self.status == 'open'then
        self:_opening()
    end
end
