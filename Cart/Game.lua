game = {}

local function createMetronome()
    return Metronome:new(GAME_BPM)
end

local function createCheckpoints()
    checkpoints = {}

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

                local doorWiresLever = DoorMechanic.findConnection(x - 1, y - 1) -- подыщем провода и коорды двери

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

    for x = 0, 139 do
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
            -- TODO: Move to data
            CIRCLE_DIAMETER = 4
            BULLET_SPREAD = 4
            BULLET_COUNT = 8
            local bullets = {}
            for i = 1, BULLET_COUNT do
                bullets[i] = Bullet:new(0, 0)
            end
            enemy = BulletHell:new(8 * respawnTile.x, 8 * respawnTile.y, CIRCLE_DIAMETER, BULLET_SPREAD, bullets)
        end
        table.insert(enemem, enemy)
    end

    return enemem
end

local function createBoomerang(x, y)
    return Boomerang:new(x, y, 0, 0)
end

local function createPlayer(x, y, boomerang)
    return Player:new(x, y, boomerang)
end

local function createBullets()
    bullets = {
    }
    return bullets
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

local levers = createLevers()
local doors = createDoors(levers)

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
    local bullets = createBullets()

    table.insert(game.updatables, metronome)
    table.concatTable(game.updatables, checkpoints)
    table.insert(game.updatables, player)
    table.insert(game.updatables, camera)
    table.insert(game.updatables, boomerang)
    table.concatTable(game.updatables, enemies)
    table.concatTable(game.updatables, levers)
    table.concatTable(game.updatables, doors)
    table.concatTable(game.updatables, bullets)

    table.concatTable(game.drawables, checkpoints)
    table.concatTable(game.drawables, levers)
    table.concatTable(game.drawables, enemies)
    table.insert(game.drawables, player)
    table.insert(game.drawables, boomerang)
    table.concatTable(game.drawables, bullets)
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

    Time.update()

    game.draw()
end

return game
