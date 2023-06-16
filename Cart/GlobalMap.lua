gm = {}

gm.x = 0  -- global map X
gm.y = 0  -- glabal map Y
gm.sx = 0 -- start map X 0w0
gm.sy = 0 -- start map Y >:(

TEST_BLOCK_TYPE = 4

function gm.isTurnedOnWire(tileX, tileY)
end

function gm.isTurnedOffWire(tileX, tileY)
end

TileType = {
    Void = 0,
    Block = 1,
    TurnedOffWire = 2,
    TurnedOnWire = 3,
    Door = 4,
    Lever = 5,
    Decoration = 6,
}

function gm.get_tile_type(x, y)
    x = x % (240 * 8)
    y = y % (136 * 8)
    
    x = x // 8
    y = y // 8

    return gm.get_tile_type8(x, y)
end

function gm.get_tile_type8(x, y)  -- x, y даются как координаты тайла на глобальной карте
    local tileId = mget(x, y)

    if tileId == TEST_BLOCK_TYPE then
        return TileType.Block
    elseif MC.turnedOffWires[tileId] ~= nil then
        return TileType.TurnedOffWire
    elseif MC.turnedOnWires[tileId] ~= nil then
        return TileType.TurnedOnWire
    elseif MC.doorIds[tileId] ~= nil then
        return TileType.Door
    elseif MC.leverIds[tileId] ~= nil then
        return TileType.Lever
    else
        return TileType.Void
    end
end

function gm.check(x, y)
    -- аргументы -- глобальные координаты пикселя
    -- x = x % (240 * 8)
    -- y = y % (136 * 8)
    local res = {x = 0, y = 0}
    if gm.x * 8 > x then
        res.x = -1
    elseif (gm.x+30) * 8 < x then
        res.x = 1
    end
    if gm.y * 8 > y then
        res.y = -1
    elseif (gm.y+17) * 8 < y then
        res.y = 1
    end
    return res
end


function gm.is_ghost(tile)
    return (229 <= tile and tile <= 255) or
            tile == 144 or tile == 128 or tile == 192 or tile == 108 or tile == 110
end


-- function gm.get_coords(x, y)
--     return {x = math.round(x // 240), y = math.round(y // 136)}
-- end


function gm.in_one_screen(obj1, obj2)
    local x1 = obj1.x
    local y1 = obj1.y
    local x2 = obj2.x
    local y2 = obj2.y
    return math.round(x1 // 240) == math.round(x2 // 240) and
            math.round(y1 // 136) == math.round(y2 // 136)
end


gm.tilemap = Tilemap:new()


return gm
