gm = {}

gm.x = 0  -- global map X
gm.y = 0  -- glabal map Y
gm.sx = 0 -- start map X 0w0
gm.sy = 0 -- start map Y >:(

TileType = {
    Void = 0,
    Solid = 1,
    Enemy = 2,
}

function gm.getTileId(x,y)
    return mget(x, y)
end

function gm.getTileType(x, y)
    x = x % (240 * 8)
    y = y % (136 * 8)

    x = x // 8
    y = y // 8

    return gm.getTileType8(x, y)
end

function gm.getTileType8(x, y)  -- x, y даются как координаты тайла на глобальной карте
    local tileId = mget(x, y)

    if table.contains(data.solidTiles, tileId) then --двери не твердые 🙈
        return TileType.Solid
    end
    return TileType.Void
end

function gm.isBlockingBfs(x, y)
    local tileId = mget(x, y)

    if table.contains(data.solidTiles, tileId) then --двери не твердые 🙈 😎😎😎😎
        return true
    elseif table.contains(data.bfs.solidTiles, tileId) then
        return true
    else
        for _, entile in ipairs(game.enemyRespawnTiles) do -- проверяем на столкновение с врагами.（づ￣3￣）づ╭(они тоже твердые)～
            --trace(entile.x..' '..entile.y..' '..x..' '..y..' ')
            if (entile.x == x) and (entile.y == y) then
                return true
            end
        end
    end

    return false
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

function gm.in_one_screen(obj1, obj2)
    local x1 = obj1.x
    local y1 = obj1.y
    local x2 = obj2.x
    local y2 = obj2.y
    return math.round(x1 // 240) == math.round(x2 // 240) and
            math.round(y1 // 136) == math.round(y2 // 136)
end

return gm
