-->door->wire->lever-->

DoorMechanic = {}

-- local doorWiresLever = {
--         door = nil, --{x = 1000000, y = 1000000, id = 'crutch'},
--         lever = nil,
--         wires = {},
--     }


function DoorMechanic.findConnection(startX, startY) -- where we start searching
    local doorWiresLever = {
        door = nil, --{x = 1000000, y = 1000000, id = 'crutch'},
        lever = nil,
        wires = {},
    }

    doorWiresLever.lever = {x = startX, y = startY}
    for x = startX - 1, startX + 1 do -- будем искать только вокруг рычага
        for y = startY - 1, startY + 1 do
            local tileType = gm.getTileId(x, y)
            if table.contains(data.mapConstants.turnedOnWires, tileType) then
                DoorMechanic._walkWire(x, y, doorWiresLever)
                --trace(doorWiresLever.door)
                --trace(' * '..doorWiresLever.door.x..' ' ..doorWiresLever..door.y)
                if doorWiresLever.door == nil or doorWiresLever.lever == nil then
                    trace("ERROR!! Couldn't find lever or door for wire at " .. x .. " " .. y)
                    return doorWiresLever
                else
                    --trace('succlol')
                    return doorWiresLever
                end
            end
        end
    end
end

function DoorMechanic._walkWire(x, y, doorWiresLever) -- _walkWireWhileDoor to be honest
    local tileType = gm.getTileId(x, y)
    if table.contains(data.mapConstants.doorIds, tileType) then
        if (doorWiresLever.door == nil) or ((x <= doorWiresLever.door.x) and (y <= doorWiresLever.door.y)) then
            doorWiresLever.door = { x = x, y = y, id = mget(x, y) }
            --trace('dr'..x..' '..y)
        end
    end

    if table.contains(data.mapConstants.leverIds, tileType) then
        doorWiresLever.lever = { x = x, y = y }
    end

    if not (table.contains(data.mapConstants.turnedOnWires, tileType) or table.contains(data.mapConstants.doorIds, tileType)) then
        return
    end

    local turnedOffWire = data.mapConstants.turnedOffWires[mget(x, y)]
    
    if table.contains(data.mapConstants.turnedOnWires, tileType) then
        table.insert(doorWiresLever.wires, {id = turnedOffWire, x = x, y = y })
        mset(x, y, turnedOffWire)
        DoorMechanic._walkWire(x + 1, y, doorWiresLever)
        DoorMechanic._walkWire(x - 1, y, doorWiresLever)
        DoorMechanic._walkWire(x, y + 1, doorWiresLever)
        DoorMechanic._walkWire(x, y - 1, doorWiresLever)
        return
    end

    DoorMechanic._walkWire(x - 1, y, doorWiresLever)
    DoorMechanic._walkWire(x, y - 1, doorWiresLever)
end

function DoorMechanic.doorOffset(door)
    local offset = data.mapConstants.doorOffsetsIds[door.id]
    return offset
end

-- function DoorMechanic:new()
--     DoorMechanic.findWires()
--     local doors = {}
--     local levers = {}

--     for i, pair in ipairs(doorWiresLever) do
--         mset(pair.lever.x, pair.lever.y, 0)

--         local doorOffset = DoorMechanic.doorOffset(pair.door)
--         local doorx = pair.door.x + doorOffset.x
--         local doory = pair.door.y + doorOffset.y

--         mset(doorx, doory, 0)
--         mset(doorx + 1, doory, 0)
--         mset(doorx, doory + 1, 0)
--         mset(doorx + 1, doory + 1, 0)

--         -- Сдвиг, потому что калитка ОГРОМНАЯ ༼ つ ◕_◕ ༽つ
--         doorx = doorx
--         doory = doory - 2

--         -- Дверь смотрит на то, включен ли рычаг
--         -- и сама себя переключает (?? (￣﹃￣))
--         local lever = Lever:new(pair.lever.x * 8, pair.lever.y * 8, nil, pair.wires)
--         local door = Door:new(doorx * 8, doory * 8, lever)

--         table.insert(doors, door)
--         table.insert(levers, lever)
--     end

--     local obj = {
--         doors = doors,
--         levers = levers
--     }

--     setmetatable(obj, self)
--     self.__index = self;
--     return obj
-- end

return DoorMechanic
