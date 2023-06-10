Game = {}


function Game:new()
    obj = {
        mode = 'action',
        plr = Player:new(10,10),
        levers = Game.addLevers(),
		camera = CameraWindow:new(-30, -20, 30, 20),
        metronome = Metronome:new(60),
    }

    obj.camera:move()

    Game.initialize_decoration_animations(obj.metronome)

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self;
    return obj
end

function Game.addLevers()
    res = {}
    for x = 0, 239 do
        for y = 0, 135 do
            if mget(x, y) == 1 then
                mset(x, y, 0)
                table.insert(res, Lever:new(x * 8, y * 8))

                --trace(mget(x,y))
            end
        end
    end
    return res
end

function Game:checkLever()
    if not self.plr.boomerang then
        return
    end
    
    for i, lever in ipairs(self.levers) do
        if not lever.isJustTurned and lever.hitbox:collide(self.plr.boomerang.hitbox) then
            lever:turn()
            lever.isJustTurned = true
        elseif lever.isJustTurned and not lever.hitbox:collide(self.plr.boomerang.hitbox) then
            lever.isJustTurned = false
        end
        
        --trace(lever:collide(self.plr.boomerang.hitbox))
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

    for i, lever in ipairs(self.levers) do
        lever:draw()
    end

    self.plr:draw()
end

function Game:update()
    Time.update()

    self:draw()
    self:checkLever()

    self.metronome:update()
    self.plr:update()
    self.camera:tryMove(self.plr.x, self.plr.y)
    self.camera:update()
end


return Game
