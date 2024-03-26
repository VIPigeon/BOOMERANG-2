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
        status = 'closedFromStart',
        shakeTimer = 1,
        hitboxLeft = Hitbox:new(rectangleLeft:left(), rectangleLeft:up(), rectangleLeft:right(), rectangleLeft:down()),
        hitboxRight = Hitbox:new(rectangleRight:left(), rectangleRight:up(), rectangleRight:right(), rectangleRight:down()),

        solidTilesSpawned = true,
    }

    --shit code
    for addX = 0, data.Door.widthTiles - 1 do
        for addY = 0, data.Door.heightTiles - 1 do
            mset(x // 8 + addX, y // 8 + addY, data.Door.solidTileId)
        end
    end

    setmetatable(object1, self)
    self.__index = self
    return object1
end

-- Вызывается управляющим рычагом 😄
function Door:statusUpdate(leverStatus)
    if leverStatus == 'off' then
        self.status = 'close'
        self:_spawnBlockingTiles()
    elseif leverStatus == 'on' then
        self.status = 'open'
        self:_despawnBlockingTiles()
    end
end

local crutch = false;
local Crutch = false;

function Door:_colliding()
    if self.hitboxLeft:collide(game.player.hitbox) and self.hitboxRight:collide(game.player.hitbox) then
        game.player:die()
    elseif self.hitboxLeft:collide(game.player.hitbox) and math.inRangeNotIncl(game.player.y, self.hitboxLeft.y1, self.hitboxLeft.y2) then
        game.player:move(self.speed, 0)
    elseif self.hitboxRight:collide(game.player.hitbox) and math.inRangeNotIncl(game.player.y, self.hitboxRight.y1, self.hitboxRight.y2) then
        game.player:move(-self.speed, 0)
    end

    local boarderLeft = self.rectL.x + self.rectL.w
    local boarderRight = self.rectR.x
    if boarderRight - boarderLeft < 0.01 then
        -- 🔊🤯
        if not crutch then
            local sound = data.Player.sfx.closeDoor
            sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
            crutch = true
        end
        return
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

    local boarderLeft = self.x + self.rectL.w
    local boarderRight = self.x + self.rectR.w

    if math.floor(self.hitboxLeft.x2) < boarderLeft then
        self.rectL:moveLeftTo(self.rectL:left() + self.speed, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    elseif math.floor(self.hitboxLeft.x2) > boarderLeft then
        self.rectL:moveLeftTo(self.x, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    end

    if self.hitboxRight.x1 > boarderRight then
        self.rectR:move(-self.speed, 0)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    elseif self.hitboxRight.x1 < boarderRight then
        self.rectR:moveLeftTo(boarderRight)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    end

    if not (self.status == 'closedFromStart') then
        if self.hitboxLeft:collide(self.hitboxRight) then
            if self.shakeTimer >= data.Door.shakeTimeTics then
                game.camera:shakeByDoorStop()
            else
                game.camera:shakeByDoor(0.7)
                self.shakeTimer = self.shakeTimer + 1
            end
        end
    end

    self.speed = self.speed + data.Door.closingAcceleration
end

function Door:_opening() -- whers ending, i like it more!
    crutch = false
    self.speed = data.Door.speed
    self.shakeTimer = 1
    game.camera:shakeByDoorStop()

    local boarderLeft = self.x + data.Door.closedGapInPixels
    local boarderRight = self.x + 2 * self.rectR.w - data.Door.closedGapInPixels

    if math.floor(self.hitboxLeft.x2) > boarderLeft then
        self.rectL:move(-self.speed, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    elseif math.floor(self.hitboxLeft.x2) < boarderLeft then
        self.rectL:moveRightTo(boarderLeft, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    end

    if self.hitboxRight.x1 < boarderRight then
        self.rectR:move(self.speed, 0)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    elseif self.hitboxRight.x1 > boarderRight then
        self.rectR:moveLeftTo(boarderRight)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    end
end

local UpperLeftTileX2 = data.Door.spriteTiles.upperLeft -- отсюда рисуем на два тайла вперёд!
local UpperRightTile = data.Door.spriteTiles.upperRight
local BottomRightTile = data.Door.spriteTiles.bottomRight

function Door:drawUpdate()
    local xleft = (self.rectL:left() - gm.x*8 + gm.sx)
    local yup = self.rectL:up() - gm.y*8 + gm.sy
    local xright = (self.rectR:left() - gm.x*8 + gm.sx)
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
end

function Door:draw()

end

function Door:_spawnBlockingTiles()
    if not self.solidTilesSpawned then
        for addX = 0, data.Door.widthTiles - 1 do
            for addY = 0, data.Door.heightTiles - 1 do
                mset(self.x // 8 + addX, self.y // 8 + addY, data.Door.solidTileId)
            end
        end
        self.solidTilesSpawned = true
    end
end

function Door:_despawnBlockingTiles()
    if self.solidTilesSpawned then
        for addX = 0, data.Door.widthTiles - 1 do
            for addY = 0, data.Door.heightTiles - 1 do
                mset(self.x // 8 + addX, self.y // 8 + addY, 0)
            end
        end
        self.solidTilesSpawned = false
    end
end

function Door:update()
    self:drawUpdate()
    if self.status == 'close' then
        self:_closing()
        --self:_spawnBlockingTiles()
    elseif self.status == 'open'then
        self:_opening()
        --self:_despawnBlockingTiles()
    end
end
