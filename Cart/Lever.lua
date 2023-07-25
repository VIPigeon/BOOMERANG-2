Lever = table.copy(Body)

Lever.spriteOff = data.Lever.sprites.off -- is default
Lever.spriteOn = data.Lever.sprites.on

function Lever:new(x, y)
    local obj = {
        x = x,
        y = y,
        wires = {},
        door = nil,
        sprite = Lever.spriteOff:copy(),
        hitbox = Hitbox:new(x, y, x+8, y+8),
        status = 'off'
    }

    --если мы хотим сделать плавное переключение проводов, нужно их сортировать

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Lever:_toogleWires()
    for _, wire in ipairs(self.wires) do
        local turnedOnWire = data.mapConstants.turnedOffWires[wire.id]
        local turnedOffWire = data.mapConstants.turnedOnWires[wire.id]

        if turnedOnWire ~= nil then
            wire.id = turnedOnWire
            mset(wire.x, wire.y, turnedOnWire)
        elseif turnedOffWire ~= nil then
            wire.id = turnedOffWire
            mset(wire.x, wire.y, turnedOffWire)
        end
    end
end

function Lever:_turn()
    if self.status == 'off' then
        self.sprite = Lever.spriteOn
        self.status = 'justOn'

        self:_toogleWires()

        return
    elseif self.status == 'on' then
        self.sprite = Lever.spriteOff
        self.status = 'justOff'

        self:_toogleWires()

        return
    end
end

function Lever:update()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_turn()
    else
        if self.status == 'justOff' then
            self.status = 'off'
        elseif self.status == 'justOn' then
            self.status = 'on'
        end
    end

    self.door:statusUpdate(self.status)
end
