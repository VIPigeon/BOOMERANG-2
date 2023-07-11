game = {}

local function createPlayer()
    return Player:new(PLAYER_START_X, PLAYER_START_Y)
end

game.drawables = {}
game.updatables = {}

local player = createPlayer()

table.insert(game.drawables, player)

table.insert(game.updatables, player)

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
