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
        }
    }

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


-- function Game:debug_paletteChange()
--     if not self.debug_counter then
--         self.debug_counter = 0
--         self.current_debug_color = 0
--     end
--     self.debug_counter = self.debug_counter + 1
--     if self.debug_counter > 80 then
--         self.debug_counter = 0
--         self.current_debug_color = self.current_debug_color + 1
--     end

--     palette.colorChange(self.current_debug_color, 70, 70, 70)

--     rect_side = 16
--     for i = 1, 15 do
--         rect((i-1)*rect_side, 0, rect_side, rect_side, i)
--         print(i, (i-1)*rect_side + 1, 1, 0)
--     end
-- end


decoration_ids = {
    100,
    101,
    102,
    103,
    104
}
ANIMATE_OFFSET = 16

function Game.initialize_decoration_animations(metronome)
    -- palette.colorChange(0, 70, 70, 70)

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
    -- self:debug_paletteChange()
    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy)

    for i, lever in ipairs(self.doorlever.levers) do
        lever:draw()
    end

    for i, door in ipairs(self.doorlever.doors) do
        door:draw()
    end

    for i, enemy in ipairs(self.enemies) do
        enemy:draw()
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
end


return Game
