--😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣
  SpecialTaraxacum = table.copy(StaticTaraxacum) -- 😣😣😣😣😣😣😣😣😣😣😣
--😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣

function SpecialTaraxacum:new(x, y, radius, bodyLength, shiftX, shiftY)
    local object = {
        x = x,
        y = y,
        w = 0,
        h = bodyLength,
        shiftX = shiftX,
        shiftY = shiftY,
        radius = radius,
        hitbox = HitCircle:new(x, y, 2 * radius),
        dead = false,
        status = 'needReload',
        timer = 0,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function SpecialTaraxacum:move(x, y)
    -- 😣😣😣
    self.x = x + self.shiftX -- + data.Snowman.specialTaraxacum.radius - 1 
    self.y = y + self.shiftY -- - data.Snowman.specialTaraxacum.radius - 1
    self.hitbox:set_xy(self.x, self.y)
end

function SpecialTaraxacum:_drawline(start, ending)
	line(start.x, start.y, ending.x, ending.y, data.Snowman.specialTaraxacum.bodyColor)
end

function SpecialTaraxacum:_reloadAnimation()
	if self.timer == data.Snowman.specialTaraxacum.reloadAnimationTime then
		self.status = 'ready'
	elseif self.timer <= data.Snowman.specialTaraxacum.reloadAnimationTime // 3 then
		circ(self.x + self.radius - 1 - gm.x*8 + gm.sx, self.y + 2- gm.y*8 + gm.sy, 0, data.Snowman.specialTaraxacum.color)
		self.timer = self.timer + 1
	elseif self.timer <= 2 * data.Snowman.specialTaraxacum.reloadAnimationTime // 3 then
		circ(self.x + self.radius - 1 - gm.x*8 + gm.sx, self.y + 2 - gm.y*8 + gm.sy, 1, data.Snowman.specialTaraxacum.color)
		self.timer = self.timer + 1
	elseif self.timer < data.Snowman.specialTaraxacum.reloadAnimationTime then
		circ(self.x + self.radius - 1 - gm.x*8 + gm.sx, self.y + 2 - gm.y*8 + gm.sy, 2, data.Snowman.specialTaraxacum.color)
		self.timer = self.timer + 1
	end
end

function SpecialTaraxacum:draw()
    local x = self.radius + self.x - gm.x*8 + gm.sx - 1
    local y = self.radius + self.y - gm.y*8 + gm.sy - 1
    local start = {x = x, y = y}
    local ending = {x = x - data.Snowman.specialTaraxacum.bodyLength, y = y + data.Snowman.specialTaraxacum.bodyLength}

    self:_drawline(start, ending)
    if not self.dead then
    	if self.status == 'needReload' then
        	self:_reloadAnimation()
        else
        	self.hitbox:draw(data.Taraxacum.color)
        	self.timer = 0
    	end
    end
end