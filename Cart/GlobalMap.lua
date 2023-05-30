
gm = {}

gm.x = 0  -- global map X
gm.y = 0  -- glabal map Y


function gm.get_tile_type(x, y)
    -- local tile = mget(math.round(x/8), math.round(y/8))
    x = x % (240 * 8)
    y = y % (136 * 8)
    local tile = mget(x//8, y//8)
    -- trace(tile)
    if tile == 16 or
            (10 <= tile and tile <= 12) or 
            (26 <= tile and tile <= 28) or
            tile == 135 or
            tile == 151 or
            tile == 192 then
        return 'block'
    end
    return 'void'
end


function gm.get_tile_type8(x, y)  -- x, y даются как координаты тайла на глобальной карте
    local tile = mget(x, y)
    if tile == 16 or
            (10 <= tile and tile <= 12) or 
            (26 <= tile and tile <= 28) or
            tile == 135 or
            tile == 151 or
            tile == 192 then
        return 'block'
    end
    return 'void'
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
