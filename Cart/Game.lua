game = {}

local function createMetronome()
    return Metronome:new(GAME_BPM)
end

local function createCheckpoints()
    checkpoints = {
        Checkpoint:new(),
        Checkpoint:new(),
    }
    return checkpoints
end

local function createLevers()
    levers = {
        Lever:new(50, 10),
        Lever:new(40, 40),
    }
    return levers
end

local function createDoors()
    doors = {
        Door:new(6, 8),
    }
    return doors
end

local function createEnemies()
    enemies = {
        Enemy:new(25, 25),
        Enemy:new(40, 30),
    }
    return enemies
end

local function createBoomerang()
    return Boomerang:new(PLAYER_START_X, PLAYER_START_Y, 0, 0)
end

local function createPlayer(boomerang)
    return Player:new(PLAYER_START_X, PLAYER_START_Y, boomerang)
end

local function createBullets()
    bullets = {
        Bullet:new(0, 0),
        Bullet:new(20, 20),
    }
    return bullets
end

game.drawables = {}
game.updatables = {}

local metronome = createMetronome()
local checkpoints = createCheckpoints()
local levers = createLevers()
local doors = createDoors()
local enemies = createEnemies()
local boomerang = createBoomerang()
local player = createPlayer(boomerang)
local bullets = createBullets()

table.insert(game.updatables, metronome)
table.concatTable(game.updatables, checkpoints)
table.insert(game.updatables, player)
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

game.mode = 'action'
game.player = player

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
