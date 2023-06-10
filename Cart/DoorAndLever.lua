DoorAndLever = {}

function DoorAndLever.addLevers()
    res = {}
    for x = 0, 239 do
        for y = 0, 135 do
            if mget(x, y) == 1 then
                mset(x, y, 0)
                table.insert(res, Lever:new(x * 8, y * 8))

                --trace(mget(x,y))
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
                --mset(x, y, 41)
                table.insert(res, Door:new(x * 8, y * 8))

                --trace(mget(x,y))
            end
        end
    end
    return res
end

function DoorAndLever:new()
    obj = {
        levers = DoorAndLever.addLevers(),
        doors = DoorAndLever.addDoors()
    }

    for id = 1, 1 do
    	obj.levers[id].door = obj.doors[id]
    	trace(obj.levers[id].door)
    end

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self;
    return obj
end

return DoorAndLever