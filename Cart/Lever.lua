Lever = table.copy(Body)

Lever.sPriteOff = Sprite:new({2},1)
Lever.sPriteOn = Sprite:new({3},1)

function Lever:new(x, y, door, wires)
    obj = {
        sprite = Lever.sPriteOff,
        x = x, y = y,
        door = door,
        wires = wires,
        hitbox = Hitbox:new(x, y, x+8, y+8),
        status = false,
        isJustTurned = false
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end

function Lever:toogleWires()
    for _, wire in ipairs(self.wires) do
        local turnedOnWire = MC.turnedOffWires[wire.id]
        local turnedOffWire = MC.turnedOnWires[wire.id]

        if turnedOnWire ~= nil then
            wire.id = turnedOnWire
            mset(wire.x, wire.y, turnedOnWire)
        elseif turnedOffWire ~= nil then
            wire.id = turnedOffWire
            mset(wire.x, wire.y, turnedOffWire)
        end
    end
end

function Lever:turn()
	if not self.status then
		self.sprite = Lever.sPriteOn
		self.status = true
		self.isJustTurned = true
		--self.door:changeState()
        self:toogleWires()
		return
	else
		self.sprite = Lever.sPriteOff
		self.status = false
		self.isJustTurned = true
		--self.door:changeState()
        self:toogleWires()
		return
	end

end

return Lever
