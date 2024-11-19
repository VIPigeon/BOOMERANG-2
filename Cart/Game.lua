game = {}

function game.key(id)
    if key(id) then
        return true
    end
    local z = 26
    local x = 24
    if key(z) or key(x) then
        return false
    end
    if btn(KEY_to_btn[id]) and not key(KEY_UP)
            and not key(KEY_DOWN) and not key(KEY_LEFT) and not key(KEY_RIGHT)
            and not key(KEY_A) and not key(KEY_S) and not key(KEY_D)
            and not key(KEY_W)
            then
        return true
    end
    return false
end
function game.keyp(id)
    if keyp(id) then
        return true
    end
    return false
    --if btnp(KEY_to_btn[id]) and not key(KEY_UP)
    --        and not key(KEY_DOWN) and not key(KEY_LEFT) and not key(KEY_RIGHT)
    --        and not key(KEY_A) and not key(KEY_S) and not key(KEY_D)
    --        and not key(KEY_W)
    --        then
    --    return true
    --end
end


local function createMetronome()
    return Metronome4_4:new(GAME_BPM)
end

Decorations.init()

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
                lwr.door = doorWiresLever.door  -- временные координаты, в создании дверей заменится на настоящую дверь
                
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

game.enemyRespawn = {}
local function createEnemies()
    local enemies = {}
    if #game.enemyRespawn == 0 then
        for x = 0, MAP_WIDTH do
            for y = 0, MAP_HEIGHT do
                local id = mget(x, y)
                if data.EnemyConfig[id] == nil then
                    goto continue
                end
                
                mset(x, y, C0)
                table.insert(game.enemyRespawn, {x=x, y=y, id=id})
                
                ::continue::
            end
        end
    end
    
    for _, enemyInfo in ipairs(game.enemyRespawn) do
        local enemy, additionalInfo = enemyFactory.create(
        enemyInfo.x, enemyInfo.y, enemyInfo.id
        )
        if additionalInfo and additionalInfo.noCollisions then
            table.insert(game.drawables, enemy)
            table.insert(game.updatables, enemy)
            goto continue
        end
        
        table.insert(enemies, enemy)
        ::continue::
    end
    
    return enemies
end

function game.updateActiveEnemies()
    local plarea = game.playerArea

    if game.playerAreaLast and game.playerAreaLast ~= -2147483648 then
        for _, enemy in ipairs(AreaToEnemies[game.playerAreaLast]) do
            enemy.isActive = false
        end
    end
    
    for _, enemy in ipairs(AreaToEnemies[plarea]) do
        if enemy.isActive ~= nil then
            enemy.isActive = true
        end
    end
end

function game.updatePlayerArea()
    if game.playerAreaLast then
        if game.playerAreaLast == game.playerArea then
            return
        else
            game.updateActiveEnemies()
            game.playerAreaLast = game.playerArea
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

local YOUFORGOTYOURBIKEHERE = {-1, -1}

local function createBike(my_bike_was_here)
    local bikex = my_bike_was_here.x
    local bikey = my_bike_was_here.y
    local numbikes = 0
    
    for x = 0, 239 do
        for y = 0, 135 do
            local tileType = gm.getTileId(x, y)
            if data.mapConstants.bikeTiles['comparader'] == tileType then
                --из этого кода следует, что байк сам осободит пространство для своего водителя
                mset(x, y, 0)
                mset(x + 1, y, 0)
                mset(x, y + 1, 0)
                mset(x + 1, y + 1, 0)
                --для кого костыль, для меня, лично, оптимизация
                bikex = (x) * 8
                bikey = (y - 1) * 8
                numbikes = numbikes + 1
            end
        end
    end
    if numbikes > 1 then
        return nil
    end
    YOUFORGOTYOURBIKEHERE = {x = bikex, y = bikey}
    return Bike:new(bikex, bikey)
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
game.doors = createDoors(levers)
local settingLevers = createSettingLevers()
game.fruits = createFruits()
fruitsCollection.needed = #game.fruits

-- Все элементы игры, которые появляются 
-- заново после смерти игрока.
function game.restart()
    local spawnpoint = game.load()
    -- \/ аналогично спавнпоинту, а если вы захотите мне что-то сказать: @^_^@ - в наушниках
    local terminationpoint = {x = PLAYER_END_X, y = PLAYER_END_Y}
    -- если вас волнует неиспользуемая переменная, то идите и жалуйтесь своему ( ﹁ ﹁ ) ~→ Михалковичу 
    
    game.drawables = {}
    game.updatables = {}
    game.collideables = {}
    
    local metronome = createMetronome()
    local enemies = createEnemies()
    local boomerang = createBoomerang(spawnpoint.x, spawnpoint.y)
    local player = createPlayer(spawnpoint.x, spawnpoint.y - 1, boomerang)
    local bike = createBike(YOUFORGOTYOURBIKEHERE)
    local camera = createCamera(player)
    local fruitPopup = FruitPopup
    
    -- table.insert(game.updatables, metronome)
    table.concatTable(game.updatables, checkpoints)
    table.insert(game.updatables, player)
    table.insert(game.updatables, bike)
    table.insert(game.updatables, camera)
    table.insert(game.updatables, boomerang)
    table.concatTable(game.updatables, enemies)
    table.concatTable(game.updatables, levers)
    table.concatTable(game.updatables, game.doors)
    table.concatTable(game.updatables, settingLevers)
    table.concatTable(game.updatables, game.fruits)
    table.insert(game.updatables, Decorations)
    
    table.concatTable(game.drawables, checkpoints)
    table.concatTable(game.drawables, levers)
    table.concatTable(game.drawables, settingLevers)
    table.concatTable(game.drawables, enemies)
    table.concatTable(game.drawables, game.fruits)
    table.insert(game.drawables, player)
    table.insert(game.drawables, bike)
    table.insert(game.drawables, boomerang)
    table.concatTable(game.drawables, game.doors)
    table.insert(game.drawables, fruitPopup)
    
    table.concatTable(game.collideables, enemies)
    table.concatTable(game.collideables, game.doors)
    
    game.mode = 'action' -- Зачем это? :|  -- это было для меню и создания паузы
    game.metronome = metronome
    game.player = player
    game.bike = bike
    game.boomer = boomerang
    game.camera = camera
    game.enemies = enemies

    MapAreas.CookEnemies()
    game.updateActiveEnemies()
end

game.restart()

function get_time_str()
    local ms = math.floor(Time.t)
    local s = math.floor(ms / 1000)
    local m = math.floor(s / 60)
    local mss = math.floor(Time.t * 100) % 100
    local s_str = string.format("%02d", s % 60)
    local m_str = string.format("%02d", m)
    local mss_str = string.format("%02d", mss)
    return s_str, m_str, mss_str
end

function game.draw()
    -- map(gm.x, gm.y , 30, 17, gm.sx, gm.sy, C0)
    map(gm.x, gm.y , 31, 18, gm.sx, gm.sy, C0)
    
    for _, drawable in ipairs(game.drawables) do
        drawable:draw()
    end

    local s_str, m_str = get_time_str()
    -- Включить чтобы была тень 🕶
    -- print(m_str .. ':' .. s_str .. '\n', 0, 1, 6, true, 1, true)
    -- Рамка
    rect(0, 0, 22, 7, 6)
    print(m_str .. ':' .. s_str .. '\n', 1, 0, 8, true, 1, true)
end

game.deleteSchedule = {}

-- Такого костыля мир ещё не видывал - 👴
-- И его, слава богу, пока что не будет
-- game.soundsQueue = Queue:new()

function game.update()
    if game.ended then
        game.drawGameEndScreen()
        return
    end

    game.metronome:update()
    Time.update()
    GameTimers.update()
    for _, updatable in ipairs(game.updatables) do
        updatable:update()
    end

    if #game.deleteSchedule > 0 then
        table.removeElements(game.updatables, game.deleteSchedule)
        table.removeElements(game.drawables, game.deleteSchedule)
        game.deleteSchedule = {}
    end

    game.updatePlayerArea()

    local draw_start = time()
    game.draw()
    local draw_elapsed = time() - draw_start
end

function game.finish()
    game.completionTimeSeconds = Time.t / 1000.0
    game.ended = true
end

local textYs = {20, 100, 130}

function game.drawGameEndScreen()
    local backgroundColor = 0
    local textColor = 8
    local textX = 4
    
    local scrollAmount = 10
    local minScroll = 20 - 4 * scrollAmount
    local maxScroll = 130
    
    -- if key(KEY_W) and textYs[3] + scrollAmount <= maxScroll then
    --     for i = 1, 3 do
    --         textYs[i] = textYs[i] + scrollAmount
    --     end
    -- end
    -- if key(KEY_S) and textYs[1] - scrollAmount >= minScroll then
    --     for i = 1, 3 do
    --         textYs[i] = textYs[i] - scrollAmount
    --     end
    -- end
    
    
    -- rect(0, 0, MAP_WIDTH, MAP_HEIGHT, backgroundColor)
    game.draw()
    print(
    -- '              Thank you for playing!',
    'Thank you for playing!',
    textX, textYs[1] - 2,
    textColor,
    false,
    2
    )
    local SHIFT_X = 120
    local SHIFT_Y = 28

    print(
    'Fruits collected:\n\n       ' .. fruitsCollection.collected .. ' / ' .. fruitsCollection.needed,
    textX, textYs[1] + SHIFT_Y,
    textColor,
    false,
    1
    )

    local s_str, m_str, ms_str = get_time_str()
    print(
    'Your time: ' .. s_str .. ':' .. m_str .. '.' .. ms_str .. '\n\n' .. 'Dev time: ' .. 288 .. 's',
    textX + SHIFT_X, textYs[1] + SHIFT_Y,
    textColor,
    false,
    1
    )
    -- print(
    -- 'Dev time: ' .. 100 .. 's',
    -- textX, textYs[3],
    -- textColor,
    -- false,
    -- 1
    -- )
end

return game
