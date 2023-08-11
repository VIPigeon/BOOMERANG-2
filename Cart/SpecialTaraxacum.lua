--😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣
SpecialTaraxacum = table.copy(StaticTaraxacum) -- 😣😣😣😣😣😣😣😣😣😣😣
--😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣

function SpecialTaraxacum:new(x, y, radius, bodyLength, shiftX, shiftY)
    local speed = data.StaticTaraxacum.speed
    local count = data.StaticTaraxacum.deathBulletCount
    local countSlow = data.StaticTaraxacum.deathBulletSlowCount
    local countFast = data.StaticTaraxacum.deathBulletFastCount
    local spread = data.StaticTaraxacum.deathBulletSpread

    local object = {
        x = x,
        y = y,
        w = 0,
        h = bodyLength,
        shiftX = shiftX + 1,
        shiftY = shiftY - 1,
        radius = radius,
        hitbox = HitCircle:new(x, y, 2 * radius),
        dead = false,
        status = 'needReload',
        timer = 0,

        speed = speed,
        count = count,
        countSlow = countSlow,
        countFast = countFast,
        spread = spread,
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
    -- local arm = self.h / 4
    -- local shift = self.h / 4
    -- local dir = aim.compute(start.x, start.y, ending.x, ending.y, 1)
    -- local white = data.Snowman.specialTaraxacum.color

    -- line(1 + start.x + shift*dir.x, start.y + shift*dir.y, 1 + start.x + arm*dir.x, start.y + arm*dir.y, white)
    -- line(-1 + ending.x - shift*dir.x, ending.y - shift*dir.y, -1 + ending.x - (shift+arm)*dir.x, ending.y - (shift+arm)*dir.y, white)
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

    -- ARMS
    local armLength = data.Snowman.specialTaraxacum.bodyLength / 4
    local sx = self.snowman.hitbox:get_center().x - gm.x*8 + gm.sx
    local sy = self.snowman.hitbox:get_center().y - gm.y*8 + gm.sy
    local leftArmStart = {x = sx - 2, y = sy - 2}
    local rightArmStart = {x = sx + 2, y = sy - 1}
    local leftArmEnd = {x = leftArmStart.x - armLength + 1, y = leftArmStart.y + armLength,}
    local rightArmEnd = {x = rightArmStart.x + armLength - 2, y = rightArmStart.y - armLength - 1,}

    -- ARMS DRAAAAAAAAAAW
    line(leftArmStart.x, leftArmStart.y, leftArmEnd.x, leftArmEnd.y, data.Snowman.color)
    line(rightArmStart.x, rightArmStart.y, rightArmEnd.x, rightArmEnd.y, data.Snowman.color)

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
