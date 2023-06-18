Door = table.copy(Body)

Door.SizeTiles = 2

Door.spriteClosed = Sprite:new({41}, Door.SizeTiles)
Door.spriteOpened = Sprite:new({46}, Door.SizeTiles)

function Door:new(x, y)
    obj = {
    	sprite = Door.spriteClosed,
    	x = x,  y = y,
    	hitbox = Hitbox:new(x, y, x + 8 * Door.SizeTiles, y + 8 * Door.SizeTiles),
        state = false
    }

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self;
    return obj
end

function Door:changeState()
	if self.state then
        self.state = false
        self.sprite = self.spriteClosed
    else
        self.state = true
        self.sprite = self.spriteOpened
    end
end

return Door