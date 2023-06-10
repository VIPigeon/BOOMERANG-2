Lever = table.copy(Body)

Lever.sPriteOff = Sprite:new({2},1)
Lever.sPriteOn = Sprite:new({3},1)

function Lever:new(x, y, door)
    obj = {
        sprite = Lever.sPriteOff,
        x = x, y = y,
        door = door,
        hitbox = Hitbox:new(x, y, x+8, y+8),
        status = false,
        isJustTurned = false
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Lever:turn()
	--trace(11)
	if not self.status then
		self.sprite = Lever.sPriteOn
		self.status = true
		self.isJustTurned = true
		self.door:changeState()
		trace(self.door.state)
		return
	else
		self.sprite = Lever.sPriteOff
		self.status = false
		self.isJustTurned = true
		self.door:changeState()
		trace(self.door.state)
		return
	end

end

return Lever