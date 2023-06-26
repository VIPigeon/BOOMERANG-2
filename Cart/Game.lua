Game = {}

function Game:new()
    obj = {
        mode = 'action',
        plr = Player:new(10,10),
        doorlever = DoorAndLever:new(),
		camera = CameraWindow:new(-30, -20, 30, 20),
        metronome = Metronome:new(60),
        enemies = {
            Enemy:new(15, 15),
            Enemy:new(200, 100),
            Enemy:new(35, 80),
            Enemy:new(120, 10),
        },
        roses = {
            Rose:new(70, 80, 0),
            Rose:new(150, 70, 1),
            Rose:new(30, 100, 2),
            Rose:new(220, 15, 3),
        },
    }

    for _, rose in ipairs(obj.roses) do
        obj.metronome:add_beat_callback(function() rose:on_beat() end)
        rose.metronome = obj.metronome
    end

    obj.camera:move()
    Game.initialize_decoration_animations(obj.metronome)

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self;
    return obj
end

function Game:checkCollisions()
    if not self.plr.boomerang then
        return
    end

    for i, enemy in ipairs(self.enemies) do
        if enemy.hitbox:collide(self.plr.boomerang.hitbox) then
            local damage = math.round(self.plr.boomerang.damage_per_ms * Time.dt())
            enemy:take_damage(damage)

            if enemy:is_dead() then
                enemy:die()
                table.remove(self.enemies, i)
            end
        end
    end
    
    for i, lever in ipairs(self.doorlever.levers) do
        if not lever.isJustTurned and lever.hitbox:collide(self.plr.boomerang.hitbox) then
            lever:turn()
            lever.isJustTurned = true
        elseif lever.isJustTurned and not lever.hitbox:collide(self.plr.boomerang.hitbox) then
            lever.isJustTurned = false
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
    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy)

    for _, lever in ipairs(self.doorlever.levers) do
        lever:draw()
    end

    for _, door in ipairs(self.doorlever.doors) do
        door:draw()
    end

    for _, enemy in ipairs(self.enemies) do
        enemy:draw()
    end

    for _, rose in ipairs(self.roses) do
        rose:draw()
    end

    self.plr:draw()
end

function Game:update()
    Time.update()

    self:draw()
    self:checkCollisions()

    self.metronome:update()
    self.plr:update()
    self.camera:tryMove(self.plr.x, self.plr.y)
    self.camera:update()

    for _, enemy in ipairs(self.enemies) do
        enemy:update()
    end

    for _, rose in ipairs(self.roses) do
        rose:update(rose)
    end
end


return Game
