Game = {}


function Game:new()
    obj = {
        mode = 'action',
        plr = Player:new(10,10),
        doorlever = DoorAndLever:new(),
		camera = CameraWindow:new(-30, -20, 30, 20),
    }

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

<<<<<<< Updated upstream
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

    trace('AHHAHA LEVERS')

    return res
end

=======
>>>>>>> Stashed changes
function Game:checkLever()
    if not self.plr.boomerang then
        return
    end
    
    for i, lever in ipairs(self.doorlever.levers) do
        if not lever.isJustTurned and lever.hitbox:collide(self.plr.boomerang.hitbox) then
            --trace(22)
            lever:turn()
            lever.isJustTurned = true
        elseif lever.isJustTurned and not lever.hitbox:collide(self.plr.boomerang.hitbox) then
            lever.isJustTurned = false
        end
        
        --trace(lever:collide(self.plr.boomerang.hitbox))
    end

end

function Game:draw()
    map(gm.x, gm.y , 30, 17, gm.sx, gm.sy)

    for i, lever in ipairs(self.doorlever.levers) do
        lever:draw()
    end

    for i, door in ipairs(self.doorlever.doors) do
        door:draw()
    end

    self.plr:draw()
end

function Game:update()
    self:draw()
    
    self:checkLever()
    self.plr:update()
    self.camera:tryMove(self.plr.x, self.plr.y)
    self.camera:update()
end


return Game
