game = {}

local function createCamera()
    local camera = CameraWindow:new(
        CAMERA_WINDOW_START_X,
        CAMERA_WINDOW_START_Y,
        CAMERA_WINDOW_START_X + CAMERA_WINDOW_WIDTH,
        CAMERA_WINDOW_START_Y + CAMERA_WINDOW_HEIGHT
    )
    camera:move()
    return camera
end

local function createMetronome()
    return Metronome:new(GAME_BPM)
end

local function createPlayer()
    return Player:new(PLAYER_START_X, PLAYER_START_Y)
end

local function createTestEnemies()
    local enemies = {
        Enemy:new(15, 15),
        Enemy:new(200, 100),
        Enemy:new(35, 80),
        Enemy:new(120, 10),
    }
    return enemies
end

local function createEnemies()
    local enemies = {}
    local testEnemies = createTestEnemies()

    table.concatTable(enemies, testEnemies)

    return enemies
end

local function createDoorLever()
    return DoorAndLever:new()
end

game.drawables = {}
game.updatables = {}

local metronome = createMetronome()
local player = createPlayer()
local camera = createCamera()
local enemies = createEnemies()
local doorlever = createDoorLever()

table.concatTable(game.drawables, doorlever.levers)
table.concatTable(game.drawables, enemies)
table.insert(game.drawables, player)
table.concatTable(game.drawables, doorlever.doors)

table.insert(game.updatables, metronome)
table.insert(game.updatables, player)
table.insert(game.updatables, camera)
table.concatTable(game.updatables, enemies)
table.concatTable(game.updatables, doorlever.doors)

game.mode = 'action'
game.camera = camera
game.metronome = metronome
game.player = player
game.enemies = enemies
game.doorlever = doorlever

function game.draw()
    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy, C0)

    for _, drawable in ipairs(game.drawables) do
        drawable:draw()
    end
end

function game.update()
    game.draw()

    for _, updatable in ipairs(game.updatables) do
        updatable:update()
    end
end

return game
