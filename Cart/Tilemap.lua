
Tilemap = {}


function Tilemap:new()
    obj = {
        is_change_plr_pos = false
    }
    for x = 1, 240 do
        local buf = {}
        for y = 1, 136 do
            table.insert(buf, gm.get_tile_type8(x - 1, y - 1))
        end
        table.insert(obj, table.copy(buf))
    end
    obj.mirror = {}  -- for debug only
    for x = 1, 240 do
        local buf = {}
        for y = 1, 136 do
            table.insert(buf, gm.get_tile_type8(x - 1, y - 1))
        end
        table.insert(obj.mirror, table.copy(buf))
    end

    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end


function Tilemap:clear()
    -- чистит карту в рамках экрана
    for x = gm.x + 1, gm.x + 30 do
        for y = gm.y + 1, gm.y + 17 do
            self[x][y] = gm.get_tile_type8(x - 1, y - 1)
        end
    end
end


function Tilemap:print()
    trace('------------------------------')
    for y = gm.y + 1, gm.y + 17 do
        local s = ''
        for x = gm.x + 1, gm.x + 30 do
            if self.mirror[x][y] == 'step' then
                s = s..' * '
                goto continue
            elseif self.mirror[x][y] == 'self' then
                s = s..' @ '
                goto continue
            end

            if self[x][y] == 'block' then
                s = s..' # '
            elseif self[x][y] == 'player' then
                s = s..' P '
            elseif self[x][y] == 'box' then
                s = s..' O '
            elseif self[x][y] == 'void' then
                s = s..' . '
            end
            ::continue::
        end
        trace(s)
    end
    trace('------------------------------')
end


function Tilemap:change_plr_pos(plr)
    -- возвращает, изменилось положение игрока или нет

    self.is_change_plr_pos = true
    local center = plr.hitbox:get_center()
    local x = center.x // 8 + 1
    local y = center.y // 8 + 1
    if self[x][y] == 'player' then
        -- также задает значение соответствующего поля
        self.is_change_plr_pos = false
        return false
    end
    assert(self[x][y] ~= 'block', "player in the wall")
    self:clear()

    local steps = {
        {x=x+1, y=y},
        {x=x-1, y=y},
        {x=x, y=y-1},
        {x=x, y=y+1},
        {x=x+1, y=y+1},
        {x=x+1, y=y-1},
        {x=x-1, y=y+1},
        {x=x-1, y=y-1}
    }
    for _, s in ipairs(steps) do
        if self[s.x][s.y] == 'player' then
            self[s.x][s.y] = 'void'
            break
        end
    end
    self[x][y] = 'player'
    return true
end


function Tilemap:print_with_path(enemy)
    -- подразумевается, что игрок и противник находятся в одном экране

    self.mirror = {}  -- for debug only
    for x = 1, 240 do
        local buf = {}
        for y = 1, 136 do
            table.insert(buf, gm.get_tile_type8(x - 1, y - 1))
        end
        table.insert(self.mirror, table.copy(buf))
    end

    for i, s in ipairs(enemy.path) do
        -- trace(self[s.x][s.y])
        assert(self[s.x][s.y] ~= 'block', "path through the wall")
        if 0 < s.x - gm.x and s.x - gm.x <= 30 and
                0 < s.y - gm.y and s.y - gm.y <= 17 then
            self.mirror[s.x][s.y] = 'step'
            if i == 1 then
                self.mirror[s.x][s.y] = 'self'
            elseif i == #enemy.path then
                self.mirror[s.x][s.y] = 'player'
            end
        end
    end
    self:print()
end


function Tilemap:get_new_direction(enemy)
    if #enemy.path < 2 then
        return
    end
    local x = enemy.path[1].x
    local y = enemy.path[1].y
    local nx = enemy.path[2].x
    local ny = enemy.path[2].y
    if nx < x then
        return 'left'
    elseif nx > x then
        return 'right'
    elseif ny < y then
        return 'up'
    elseif ny > y then
        return 'down'
    end
    trace(x)
    trace(y)
    trace(nx)
    trace(ny)
    assert(false, "bug in Tilemap:get_new_direction")
end


return Tilemap
