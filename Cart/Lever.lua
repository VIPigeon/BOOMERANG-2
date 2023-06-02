Lever = table.copy(Body)

Lever.sPriteOff = Sprite:new({2},1)
Lever.sPriteOn = Sprite:new({3},1)

function Lever:new(x, y)
    obj = {
        sprite = Lever.sPriteOff,
        x = x, y = y,
        hitbox = Hitbox:new(x, y, x+8, y+8),
        status = false,
        isJustTurned = false,
        collidesNow = false
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Lever:turn(turner)
	--trace(self.isJustTurned)
	if not self.isJustTurned then
		if not self.status then
			self.sprite = Lever.sPriteOn
			self.status = true
			self.isJustTurned = true
			self.collidesNow = true
			return
		else
			self.sprite = Lever.sPriteOff
			self.status = false
			self.isJustTurned = true
			self.collidesNow = true
			return
		end
	end
	self.isJustTurned = self.hitbox:collide(turner)

end

return Lever