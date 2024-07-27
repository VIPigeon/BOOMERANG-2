MapAreas = {}

AreaToEnemies = {}

function MapAreas.generate()
    local areas = {}
    local transitionTiles = {}
    local visitedTiles = {}

    local function ind(x, y)
        return y * MAP_WIDTH + x
    end

    local function isdoor(x, y)
        local id = mget(x, y)
        local doorIds = data.mapConstants.doorIds
        return table.contains(doorIds, id)
    end

    local function iswall(x, y)
        local id = mget(x, y)
        local wallIds = data.Map.WallTileIds
        return table.contains(wallIds, id)
    end

    local function isborder(x, y)
        return iswall(x, y) or isdoor(x, y)
    end

    local function areabfs(x, y)
        local area = {}
        local queue = Queue:new()
        queue:enqueue({x=x, y=y})
        while queue:count() > 0 do
            local tile = queue:dequeue()
            local x, y = tile.x, tile.y

            if visitedTiles[ind(x, y)] or iswall(x, y) then
                goto continue
            elseif isdoor(x, y) then
                table.insert(transitionTiles, {x=x, y=y, area=(#areas + 1)})
                goto continue
            end


            table.insert(area, tile)
            visitedTiles[ind(x, y)] = true

            if x > 0 then
                queue:enqueue({x=x-1, y=y})
            end
            if x < MAP_WIDTH then
                queue:enqueue({x=x+1, y=y})
            end
            if y > 0 then
                queue:enqueue({x=x, y=y-1})
            end
            if y < MAP_HEIGHT then
                queue:enqueue({x=x, y=y+1})
            end

            ::continue::
        end

        return area
    end

    for x = 0, MAP_WIDTH do
        for y = 0, MAP_HEIGHT do
            if visitedTiles[ind(x, y)] or isborder(x, y) then
                goto continue
            end

            local area = areabfs(x, y)
            table.insert(areas, area)
            ::continue::
        end
    end

    return areas, transitionTiles
end

function MapAreas.CookEnemies()
    for i, area in ipairs(game.areas) do
        AreaToEnemies[i] = {}
    end

    for _, enemy in ipairs(game.enemies) do
        local enemyLocation = MapAreas.findAreaWithTile(enemy.x // 8, enemy.y // 8)
        table.insert(AreaToEnemies[enemyLocation], enemy)
    end
end

function MapAreas.findAreaWithTile(tilex, tiley)
    for i, area in ipairs(game.areas) do
        for _, tile in ipairs(area) do
            if tile.x == tilex and tile.y == tiley then
                return i
            end
        end
    end
end
