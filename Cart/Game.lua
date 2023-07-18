Game = {}

function Game:new()
    local roses = {
        Rose:new(70, 80, 0),
        Rose:new(150, 70, 1),
        Rose:new(30, 100, 2),
        Rose:new(220, 15, 3),
    }

    local boom = Boomerang:new(0,0,0,0)

    object = {
        mode = 'action',
        plr = Player:new(10,10),
        boomer = boom,
        doorlever = DoorAndLever:new(),
		camera = CameraWindow:new(-30, -20, 30, 20),
        metronome = Metronome:new(60),
        enemies = {
            Enemy:new(15, 15),
            --Enemy:new(200, 100),
            --Enemy:new(35, 80),
            --Enemy:new(120, 10),
        },
    }

    trace(object)

    local enemem = {}
    for x = 0, 239 do
        for y = 0, 135 do
            if mget(x, y) == data.Enemy.defaultEnemyFlagTile then
                mset(x, y, C0)
                local enemy = Enemy:new(x * 8, y * 8)
                table.insert(enemem, enemy)
            end
        end
    end

    object.enemies = enemem

    trace(object)

    for _, rose in ipairs(roses) do
        table.insert(object.enemies, rose)

        object.metronome:add_beat_callback(function() rose:on_beat() end)
        rose.metronome = object.metronome
    end

    trace(obj)

    object['plr'].boomerang = boom

    object.camera:move()
    Game.initialize_decoration_animations(object.metronome)

    
    
    --Game.generateEnemies()

    -- чистая магия!
    setmetatable(object, self)
    self.__index = self;
    return object
end

function Game.generateEnemies()
    
end

function Game:enemiesUpdate()
    for i, enemy in ipairs(self.enemies) do
        if enemy:isDeadCheck() then
            table.remove(self.enemies, i)
        else
            enemy:update()
        end
    end
end

function Game:checkCollisions()
    
    for i, door in ipairs(self.doorlever.doors) do
        local damage = 1

        if door:checkCollision(self.plr) then
            -- TODO gm.shakeEffect()

            self.plr:take_damage(damage)
            if self.plr:is_dead() then
                self.plr:death()
            end
        end

        for i, enemy in ipairs(self.enemies) do
            if door:checkCollision(enemy) then
                enemy:take_damage(damage)
                if enemy:is_dead() then
                    enemy:die()
                    table.remove(self.enemies, i)
                end
            end
        end
    end

    if self.plr.boomerang then
        for i, lever in ipairs(self.doorlever.levers) do
            if not lever.isJustTurned and lever.hitbox:collide(self.plr.boomerang.hitbox) then
                lever:turn()
                lever.isJustTurned = true
            elseif lever.isJustTurned and not lever.hitbox:collide(self.plr.boomerang.hitbox) then
                lever.isJustTurned = false
            end
        end
    end
end

decoration_ids = {
    100,
    101,
    102,
    103,
    104
}
ANIMATE_OFFSET = 16

function Game.initialize_decoration_animations(metronome)
    for x = 0, 239 do
        for y = 0, 135 do
            for _, decoration in ipairs(decoration_ids) do
                if mget(x, y) == decoration then

                    animate_function = function()
                        if (mget(x, y) == decoration) then
                            mset(x, y, decoration + ANIMATE_OFFSET)
                        elseif mget(x, y) == decoration + ANIMATE_OFFSET then
                            mset(x, y, decoration)
                        end
                    end

                    metronome:add_beat_callback(animate_function)
                end
            end
        end
    end
end

function Game:draw()
    for i, door in ipairs(self.doorlever.doors) do
       door:draw()
    end

    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy, C0)

    for _, lever in ipairs(self.doorlever.levers) do
        lever:draw()
    end

    for _, door in ipairs(self.doorlever.doors) do
        door:draw()
    end

    if self.enemies ~= nil then
        for _, enemy in ipairs(self.enemies) do
            enemy:draw()
        end
    end

    self.plr:draw()
end

function Game:update()
    Time.update()

    self:draw()

    self.plr:update()

    if self.plr.boomerangActive then
        self.boomer:update()
    end

    self:checkCollisions()

    for _, door in ipairs(self.doorlever.doors) do
        door:update()
    end

    self.metronome:update()

    self.camera:tryMove(self.plr.x, self.plr.y)
    self.camera:update()

    self:enemiesUpdate()
end

return Game
