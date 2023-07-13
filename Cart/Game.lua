game = {}

local function createPlayer()
    return Player:new(PLAYER_START_X, PLAYER_START_Y)
end

local function createBoomerang()
    return Boomerang:new(PLAYER_START_X, PLAYER_START_Y, 0, 0)
end

local function createBullets()
    bullets = {
        Bullet:new(0, 0),
        Bullet:new(20, 20),
    }
    return bullets
end

local function createCheckpoints()
    checkpoints = {
        Checkpoint:new(),
        Checkpoint:new(),
    }
    return checkpoints
end

game.drawables = {}
game.updatables = {}

local player = createPlayer()
local boomerang = createBoomerang()
local bullets = createBullets()
local checkpoints = createCheckpoints()

table.concatTable(game.drawables, checkpoints)
table.insert(game.drawables, player)
table.insert(game.drawables, boomerang)
table.concatTable(game.drawables, bullets)

table.concatTable(game.updatables, checkpoints)
table.insert(game.updatables, player)
table.insert(game.updatables, boomerang)
table.concatTable(game.updatables, bullets)

game.mode = 'action'
game.player = player

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
