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

local function createSettingLevers()
    local slevers = {}
    local leverTiles = {}

    for x = 0, 239 do
        for y = 0, 135 do
            local tileType = gm.getTileId(x, y)
            if table.contains(data.mapConstants.settingLeverIds, tileType) then
                mset(x, y, 0)
                table.insert(leverTiles, {x=x, y=y})
                local lwr = SettingLever:new(x * 8, y * 8)
                
                local doorWiresLever = DoorMechanic.findConnectionWithoutDoor(x, y) -- подыщем провода и коорды недвери
                
                lwr.wires = doorWiresLever.wires

                table.insert(slevers, lwr)
            end
        end
    end

    if table.length(slevers) ~= table.length(settings) then
        error('wheres no connection betw settings and togglers '..#slevers..' '..table.length(settings))
    end

    for i, set in ipairs(settings) do
        --trace(set.name)
        slevers[i].setting = set
    end

    return slevers
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

game.enemyRespawnTiles = {}
local function createEnemies()
    if #game.enemyRespawnTiles == 0 then
        for x = 0, MAP_WIDTH do
            for y = 0, MAP_HEIGHT do
                local id = mget(x, y)

                if id == data.Enemy.defaultEnemyFlagTile then
                    table.insert(game.enemyRespawnTiles, {x=x, y=y, tileid = id, type='enemy'})
                    mset(x, y, C0)
                elseif table.contains(data.Rose.spawnTiles, id) then
                    table.insert(game.enemyRespawnTiles, {x=x, y=y, tileid = id, type='rose'})
                    mset(x, y, C0)
                elseif table.contains(data.BulletHell.spawnTiles, id) then
                    table.insert(game.enemyRespawnTiles, {x=x, y=y, tileid = id, type='bullethell'})
                    mset(x, y, C0)
                elseif table.contains(data.AutoBulletHell.spawnTiles, id) then
                    table.insert(game.enemyRespawnTiles, {x=x, y=y, tileid = id, type='autobullethell'})
                    mset(x, y, C0)
                elseif table.contains(data.Taraxacum.staticTaraxacumSpawnTile, id) then
                    table.insert(game.enemyRespawnTiles, {x=x, y=y, tileid = id, type='taraxacum'})
                    mset(x, y, C0)
                elseif table.contains(data.Snowman.spawnTiles, id) then
                    table.insert(game.enemyRespawnTiles, {x=x, y=y, tileid = id, type='snowman'})
                    mset(x, y, C0)
                elseif table.contains(data.LongRose.spawnTiles, id) then
                    local tile = {x=x, y=y, tileid=id, type='longrose'}
                    table.insert(game.enemyRespawnTiles, tile)
                    mset(x, y, C0)
                end
            end
        end
    end

    function getDirection(spawnTileId, type)
        if type == 'rose' then
            return spawnTileId - data.Rose.spawnTiles[1]
        elseif type == 'longrose' then
            return spawnTileId - data.LongRose.spawnTiles[1]
        end
    end

    local enemem = {}
    for _, respawnTile in ipairs(game.enemyRespawnTiles) do
        local enemy
        if respawnTile.type == 'enemy' then
            enemy = Enemy:new(8 * respawnTile.x, 8 * respawnTile.y)
        elseif respawnTile.type == 'rose' then
            enemy = Rose:new(8 * respawnTile.x, 8 * respawnTile.y, getDirection(respawnTile.tileid, respawnTile.type))
        elseif respawnTile.type == 'longrose' then
            enemy = LongRose:new(8 * respawnTile.x, 8 * respawnTile.y, getDirection(respawnTile.tileid, respawnTile.type))
        elseif respawnTile.type == 'bullethell' then
            local type = respawnTile.tileid - data.BulletHell.spawnTiles[1] + 1
            enemy = BulletHell:new(8 * respawnTile.x, 8 * respawnTile.y, type)
        elseif respawnTile.type == 'autobullethell' then
            enemy = AutoBulletHell:new(8 * respawnTile.x, 8 * respawnTile.y, 1, 13, Sprite:new({379}, 1))
        elseif respawnTile.type == 'taraxacum' then
            local radius = data.Taraxacum.staticRadius
            local bodyLength = data.Taraxacum.staticBodyLength
            -- Это чудо костыль, чтобы одуванчик не попадал в collideables (нельзя) 🙄🙄 \😯/
            local taraxacum = StaticTaraxacum:new(8 * respawnTile.x, 8 * respawnTile.y, radius, bodyLength)
            table.insert(game.updatables, taraxacum)
            table.insert(game.drawables, taraxacum)
        elseif respawnTile.type == 'snowman' then
            local snowmanBox = SnowmanBox:new(8 * respawnTile.x, 8 * respawnTile.y)
            table.insert(game.updatables, snowmanBox)
            table.insert(game.drawables, snowmanBox)
        end

        if enemy then
            table.insert(enemem, enemy)
        end
    end

    return enemem
end

function game.updateActiveEnemies()
    local plarea = game.playerArea

    for _, enemy in ipairs(game.enemies) do
        if enemy.isActive ~= nil then
            -- TODO: OPTIMIZE PRIME
            local enemyLocation = MapAreas.findAreaWithTile(enemy.x // 8, enemy.y // 8)
            enemy.isActive = plarea == enemyLocation
            
            --debug
            local lol = -1
            if enemy.isActive then
                lol = 1
            else
                lol = 0
            end
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
        game.playerAreaLast = -2147483648
    end
end

local function createBoomerang(x, y)
    return Boomerang:new(x, y, 0, 0)
end

local function createPlayer(x, y, boomerang)
    local tilex = x // 8
    local tiley = y // 8
    game.playerArea = MapAreas.findAreaWithTile(tilex, tiley)

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

local levers = createLevers()
local doors = createDoors(levers)
local settingLevers = createSettingLevers()

-- Все элементы игры, которые появляются 
-- заново после смерти игрока.
function game.restart()
    local spawnpoint = game.load()

    game.drawables = {}
    game.updatables = {}
    game.collideables = {}

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
    table.concatTable(game.updatables, settingLevers)

    table.concatTable(game.drawables, checkpoints)
    table.concatTable(game.drawables, levers)
    table.concatTable(game.drawables, settingLevers)
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

    game.updateActiveEnemies()
end

game.restart()

function game.draw()
    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy, C0)

    for _, drawable in ipairs(game.drawables) do
        drawable:draw()
    end
end

game.deleteSchedule = {}

function game.update()
    for _, updatable in ipairs(game.updatables) do
        updatable:update()
    end

    if #game.deleteSchedule > 0 then
        table.removeElements(game.updatables, game.deleteSchedule)
        table.removeElements(game.drawables, game.deleteSchedule)
        game.deleteSchedule = {}
    end

    game.updatePlayerArea()

    Time.update()

    game.draw()

    --debug
    -- for i, tile in ipairs(game.transitionTiles) do
    --     rect(8 * tile.x - gm.x*8 + gm.sx, 8 * tile.y - gm.y*8 + gm.sy, 8, 8, 1)
    -- end
end

return game
