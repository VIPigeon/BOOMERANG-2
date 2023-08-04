game = {}

local function createMetronome()
    return Metronome:new(GAME_BPM)
end

local function createCheckpoints()
    local checkpoints = {}

    for x = 0, MAP_WIDTH do
        for y = 0, MAP_HEIGHT do
            if mget(x, y) == data.Checkpoint.flagTile then
                local checkpoint = Checkpoint:new(x * 8, y * 8)
                table.insert(checkpoints, checkpoint)
            end
        end
    end

    return checkpoints
end

local function createCamera(player)
    local cameraRect = Rect:new(
        player.x - 16,
        player.y - 6,
        CAMERA_WINDOW_WIDTH,
        CAMERA_WINDOW_HEIGHT
    )

    camera = CameraWindow:new(
        cameraRect,
        player,
        8,
        8
    )

    return camera
end

local function createLevers()
    local levers = {}
    local leverTiles = {}

    for x = 0, 239 do
        for y = 0, 135 do
            local tileType = gm.getTileId(x, y)
            if table.contains(data.mapConstants.leverIds, tileType) then
                mset(x, y, 0)
                table.insert(leverTiles, {x=x, y=y})
                local lwr = Lever:new(x * 8, y * 8)

                local doorWiresLever = DoorMechanic.findConnection(x, y) -- подыщем провода и коорды двери

                lwr.wires = doorWiresLever.wires
                lwr.door = doorWiresLever.door -- временные координаты, в создании дверей заменится на настоящую дверь

                table.insert(levers, lwr)
            end
        end
    end

    for _, lever in ipairs(levers) do
        trace('L-V '..lever.x..' '..lever.y)
        trace('D-R '..lever.door.x..' '..lever.door.y)
    end

    return levers
end

local function createDoors(levers)
    local doors = {}
    local doorTiles = {}

    for x = 0, 239 do
        for y = 0, 135 do
            local tileType = gm.getTileId(x, y)
            if table.contains(data.mapConstants.doorIds, tileType) then -- what is 204? 2004 maybe?
                mset(x, y, 0)

                for _, lever in ipairs(levers) do -- подыскиваем рычаг для двери
                    if lever.door.x == x and lever.door.y == y then
                        local door = Door:new(x * 8, y * 8)
                        lever.door = door

                        table.insert(doorTiles, {x=x, y=y})
                        table.insert(doors, door)
                        break
                    end
                end
            end
        end
    end

    return doors
end

enemyRespawnTiles = {}
local function createEnemies()
    if #enemyRespawnTiles == 0 then
        for x = 0, MAP_WIDTH do
            for y = 0, MAP_HEIGHT do
                if mget(x, y) == data.Enemy.defaultEnemyFlagTile then
                    table.insert(enemyRespawnTiles, {x=x, y=y, tileid = mget(x, y), type='enemy'})
                    mset(x, y, C0)
                end
            end
        end
        for x = 0, MAP_WIDTH do
            for y = 0, MAP_HEIGHT do
                if table.contains(data.Rose.spawnTiles, mget(x, y)) then
                    table.insert(enemyRespawnTiles, {x=x, y=y, tileid = mget(x, y), type='rose'})
                    mset(x, y, C0)
                end
            end
        end
        for x = 0, MAP_WIDTH do
            for y = 0, MAP_HEIGHT do
                if table.contains(data.BulletHell.spawnTiles, mget(x, y)) then
                    table.insert(enemyRespawnTiles, {x=x, y=y, tileid = mget(x, y), type='bullethell'})
                    mset(x, y, C0)
                end
            end
        end
    end

    function getDirection(spawnTileId)
        return spawnTileId - data.Rose.spawnTiles[1]
    end

    enemem = {}
    for _, respawnTile in ipairs(enemyRespawnTiles) do
        local enemy
        if respawnTile.type == 'enemy' then
            enemy = Enemy:new(8 * respawnTile.x, 8 * respawnTile.y)
        elseif respawnTile.type == 'rose' then
            enemy = Rose:new(8 * respawnTile.x, 8 * respawnTile.y, getDirection(respawnTile.tileid))
        elseif respawnTile.type == 'bullethell' then
            local type = respawnTile.tileid - data.BulletHell.spawnTiles[1] + 1
            enemy = BulletHell:new(8 * respawnTile.x, 8 * respawnTile.y, type)
        end
        table.insert(enemem, enemy)
    end

    return enemem
end

function game.updateActiveEnemies()
    local plarea = game.playerArea

    for _, enemy in ipairs(game.enemies) do
        if enemy.isActive ~= nil then
            local enemyLocation = MapAreas.findAreaWithTile(enemy.x, enemy.y)
            enemy.isActive = plarea == enemyLocation
        end
    end
end

function game.updatePlayerArea()
    if game.playerAreaLast then
        if game.playerAreaLast == game.playerArea then
            return
        else
            game.playerAreaLast = game.playerArea
            game.updateActiveEnemies()
        end
    else
        game.playerAreaLast = 0
    end
end

local function createBoomerang(x, y)
    return Boomerang:new(x, y, 0, 0)
end

local function createPlayer(x, y, boomerang)
    local tilex = x // 8
    local tiley = y // 8
    game.playerArea = MapAreas.findAreaWithTile(tilex, tiley)
    trace('Player is in area ' .. game.playerArea)

    return Player:new(x, y, boomerang)
end

local checkpoints = createCheckpoints()
game.startingCheckpoint = {x = PLAYER_START_X, y = PLAYER_START_Y}
game.checkpoints = checkpoints
game.lastUsedCheckpoint = nil
game.checkpointStack = Stack:new()

function game.save(checkpoint)
    if game.lastUsedCheckpoint ~= nil then
        game.lastUsedCheckpoint:enable()
        game.checkpointStack:push(game.lastUsedCheckpoint)
        game.lastUsedCheckpoint = nil
    end

    game.checkpointStack:push(checkpoint)
end

function game.load()
    if game.lastUsedCheckpoint ~= nil then
        game.lastUsedCheckpoint:disable()
        game.lastUsedCheckpoint = nil
    end

    if game.checkpointStack:count() == 0 then
        return game.startingCheckpoint
    end

    local checkpoint = game.checkpointStack:pop()
    checkpoint:use()

    game.lastUsedCheckpoint = checkpoint

    return checkpoint
end

-- Глобальные элементы игры, которые не
-- меняются от сохранений (если игрок
-- респавнится на чекпоинте, штуки снизу
-- не изменятся)
game.areas, game.transitionTiles = MapAreas.generate()
-- for _, tile in ipairs(game.transitionTiles) do
--     trace(tile.x .. ' ' .. tile.y .. ' ' .. tile.area)
-- end
local levers = createLevers()
local doors = createDoors(levers)

-- Все элементы игры, которые появляются 
-- заново после смерти игрока.
function game.restart()
    local spawnpoint = game.load()

    game.drawables = {}
    game.updatables = {}
    game.collideables = {}

    game.bullets = {}

    local metronome = createMetronome()
    local enemies = createEnemies()
    local boomerang = createBoomerang(spawnpoint.x, spawnpoint.y)
    local player = createPlayer(spawnpoint.x, spawnpoint.y - 1, boomerang)
    local camera = createCamera(player)

    table.insert(game.updatables, metronome)
    table.concatTable(game.updatables, checkpoints)
    table.insert(game.updatables, player)
    table.insert(game.updatables, camera)
    table.insert(game.updatables, boomerang)
    table.concatTable(game.updatables, enemies)
    table.concatTable(game.updatables, levers)
    table.concatTable(game.updatables, doors)

    table.concatTable(game.drawables, checkpoints)
    table.concatTable(game.drawables, levers)
    table.concatTable(game.drawables, enemies)
    table.insert(game.drawables, player)
    table.insert(game.drawables, boomerang)
    table.concatTable(game.drawables, doors)

    table.concatTable(game.collideables, enemies)
    table.concatTable(game.collideables, doors)

    game.mode = 'action' -- Зачем это? :|
    game.metronome = metronome
    game.player = player
    game.boomer = boomerang
    game.camera = camera
    game.enemies = enemies
end

game.restart()

function game.draw()
    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy, C0)

    for _, drawable in ipairs(game.drawables) do
        drawable:draw()
    end
end

function game.update()
    for _, updatable in ipairs(game.updatables) do
        updatable:update()
    end

    game.updatePlayerArea()

    Time.update()

    game.draw()
end

return game
