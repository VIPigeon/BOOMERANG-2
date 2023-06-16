DoorAndLever = {}

function DoorAndLever.addLevers()
    res = {}
    for x = 0, 239 do
        for y = 0, 135 do
            if mget(x, y) == 1 then
                mset(x, y, 0)
                table.insert(res, Lever:new(x * 8, y * 8))
            end
        end
    end
    return res
end

function DoorAndLever.addDoors()
    res = {}
    for x = 0, 239 do
        for y = 0, 135 do
            if mget(x, y) == 46 then
                mset(x, y, 0)
                mset(x + 1, y, 0)
                mset(x, y + 1, 0)
                mset(x + 1, y + 1, 0)
                table.insert(res, Door:new(x * 8, y * 8))
            end
        end
    end
    return res
end

local doorsAndLevers = {
}

local doorLeverPair = {
    door = nil,
    lever = nil,
    wires = {},
}

-- (0 o 0) Use a function for this later
local doorIds = {
    [41] = {x = 0, y = 0},
    [42] = {x = -1, y = 0},
    [41 + 16] = {x = 0, y = -1},
    [42 + 16] = {x = -1, y = -1},
}

local leverIds = {
    [1] = 0
}

function DoorAndLever.findWires()
    for x = 0, 239 do
        for y = 0, 135 do
            local tileType = gm.get_tile_type8(x, y)
            if tileType == TileType.TurnedOnWire then
                DoorAndLever.walkWire(x, y)

                if doorLeverPair.door == nil or doorLeverPair.lever == nil then
                    trace("ERROR!! Couldn't find lever or door for wire at " .. x .. " " .. y)
                else
                    table.insert(doorsAndLevers, doorLeverPair)
                end
            end
        end
    end
end

function DoorAndLever.walkWire(x, y)
    local tileType = gm.get_tile_type8(x, y)

    if tileType == TileType.Door then
        doorLeverPair.door = { x=x, y=y, id=mget(x, y) }
    end

    if tileType == TileType.Lever then
        doorLeverPair.lever = { x=x, y=y }
    end

    if tileType ~= TileType.TurnedOnWire then
        return
    end

    local turnedOffWire = MC.turnedOnWires[mget(x, y)]
    table.insert(doorLeverPair.wires, {id = turnedOffWire, x = x, y = y })
    mset(x, y, turnedOffWire)

    DoorAndLever.walkWire(x + 1, y)
    DoorAndLever.walkWire(x - 1, y)
    DoorAndLever.walkWire(x, y + 1)
    DoorAndLever.walkWire(x, y - 1)
end

function DoorAndLever.doorOffset(door)
    local offset = doorIds[door.id]
    return offset
end

function DoorAndLever:new()
    DoorAndLever.findWires()
    local doors = {}
    local levers = {}
    for i, pair in ipairs(doorsAndLevers) do
        mset(pair.lever.x, pair.lever.y, 0)

        local doorOffset = DoorAndLever.doorOffset(pair.door)
        local doorx = pair.door.x + doorOffset.x
        local doory = pair.door.y + doorOffset.y

        mset(doorx, doory, 0)
        mset(doorx + 1, doory, 0)
        mset(doorx, doory + 1, 0)
        mset(doorx + 1, doory + 1, 0)

        local door = Door:new(doorx * 8, doory * 8)
        local lever = Lever:new(pair.lever.x * 8, pair.lever.y * 8, door, pair.wires)

        table.insert(doors, door)
        table.insert(levers, lever)
    end

    obj = {
        doors = doors,
        levers = levers
    }

    setmetatable(obj, self)
    self.__index = self;
    return obj
end

return DoorAndLever
