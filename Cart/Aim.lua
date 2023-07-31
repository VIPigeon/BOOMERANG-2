
aim = {}

function aim.compute(x, y, fx, fy, v)
    if fx == x then
        fx = fx + 0.0000001
    end

    local d = math.abs(fy - y) / math.abs(fx - x)
    local dx = v / math.sqrt(1 + d*d)
    local dy = dx * d

    local kx = 1
    local ky = 1
    if fx < x then
        kx = -1
    end
    if fy < y then
        ky = -1
    end

    if math.sq_distance(x, y, fx, fy) < math.sq_distance(x + kx*dx, y + ky*dy, fx, fy) then
        trace(kx * dx)
        trace(ky * dy)
    end

    return {x = kx * dx,
        y = ky * dy}
end


function aim.get_random_point_of_the_screen_border()
    local ball = math.random(0, 240*2 + 136*2 - 5)
    if ball < 239 then
        return {x = ball, y = 0}
    end
    ball = ball - 239
    if ball < 135 then
        return {x = 239, y = ball}
    end
    ball = ball - 135
    if ball < 239 then
        return {x = 239 - ball, y = 135}
    end
    ball = ball - 239
    return {x = 0, y = 135 - ball}
end

function aim.get_random_point_of_the_screen_border(a,b)
    local ball = math.random(a,b)
    if ball < 239 then
        return {x = ball, y = 0}
    end
    ball = ball - 239
    if ball < 135 then
        return {x = 239, y = ball}
    end
    ball = ball - 135
    if ball < 239 then
        return {x = 239 - ball, y = 135}
    end
    ball = ball - 239
    return {x = 0, y = 135 - ball}
end

function aim.bfs(startPos)
    local steps = {
        {x = 0, y = 1},
        {x = 0, y =-1},
            {x = 1, y =-1},
        {x = 1, y = 0},    
            {x = 1, y = 1},
            {x =-1, y =-1},
        {x =-1, y = 0},
            {x =-1, y = 1},
    }

    local px = game.player:getPositionTile().x
    local py = game.player:getPositionTile().y

    local queue = Queue:new()
    queue:enqueue({x = startPos.x, y = startPos.y, path = { {x = startPos.x, y = startPos.y} }})

    local visited = {}
    for x = 0, 239 do
        visited[x] = {}
    end

    while queue:count() > 0 do
        local cur = queue:dequeue()

        for _, step in ipairs(steps) do
            local x = cur.x + step.x
            local y = cur.y + step.y

            if (x < 0) or (x > 240) then
                break
            end
            if (y < 0) or (y > 135) then
                break
            end
            
            if (x == px) and (y == py) then
                trace('I chased you 🤗'..' '..x..' '..y..' !!') -- 🤗
                table.insert(cur.path, {x = x, y = y})
                return cur.path
            elseif not visited[x][y] then --🤗
                --trace('enq '..x..' '..y) --🤭
                
                local newPath = table.copy(cur.path)
                --trace(newPath)
                table.insert(newPath, {x = x, y = y})

                queue:enqueue({x = x, y = y, path = newPath})
                visited[x][y] = true
            end
        end
    end

    error("findn't the way")
end

function aim.visualizePath(path)
    for _, tile in ipairs(path) do
        --trace(tile.x..' '..tile.y)
        rect(8 * tile.x - gm.x*8 + gm.sx, 8 * tile.y - gm.y*8 + gm.sy, 8, 8, 7)
    end
end

function aim.bfsMapAdapted(startPos)
    local steps = {
        {x = 0, y = 1},
        {x = 0, y =-1},
            {x = 1, y =-1},
        {x = 1, y = 0},    
            {x = 1, y = 1},
            {x =-1, y =-1},
        {x =-1, y = 0},
            {x =-1, y = 1},
    }

    local px = game.player:getPositionTile().x
    local py = game.player:getPositionTile().y

    local queue = Queue:new()
    queue:enqueue({x = startPos.x, y = startPos.y, path = { {x = startPos.x, y = startPos.y} }})

    local visited = {}
    for x = 0, 239 do
        visited[x] = {}
    end

    while queue:count() > 0 do
        local cur = queue:dequeue()

        for _, step in ipairs(steps) do
            local x = cur.x + step.x
            local y = cur.y + step.y

            if (x < 0) or (x > 240) then
                break
            end
            if (y < 0) or (y > 135) then
                break
            end
            
            trace(gm.getTileType8(x,y))

            if gm.getTileType8(x, y) == 1 then
                visited[x][y] = true
                goto continue
            end

            if (x == px) and (y == py) then
                trace('I chased you 🤗'..' '..x..' '..y..' !!') -- 🤗
                table.insert(cur.path, {x = x, y = y})
                return cur.path
            elseif not visited[x][y] then --🤗
                --trace('enq '..x..' '..y) --🤭
                
                local newPath = table.copy(cur.path)
                --trace(newPath)
                table.insert(newPath, {x = x, y = y})

                queue:enqueue({x = x, y = y, path = newPath})
                visited[x][y] = true
            end

            ::continue::
        end
    end

    error("findn't the way")
end

-- function aim.bfs(path)
--     local steps = {
--         {x=0, y=1},
--         {x=0, y=-1},
--         {x=1, y=0},
--         {x=-1, y=0}
--         -- {x=1, y=1},
--         -- {x=1, y=-1},
--         -- {x=-1, y=1},
--         -- {x=-1, y=-1}
--     }
--     -- trace(#path)
--     local cx = path[#path].x
--     local cy = path[#path].y
--     local queue = {
--         {x=cx, y=cy, path=path}
--     }
--     local cash = Enemy.get_empty_tilemap()
--     cash[cx][cy] = true
--     while #queue > 0 do
--         local v = table.remove(queue, 1)
--         for _, s in ipairs(steps) do
--             local x = v.x + s.x
--             local y = v.y + s.y
--             if cash[x][y] then
--                 goto continue
--             end
--             if gm.tilemap[x][y] == 'void' then
--                 -- trace(v.path)
--                 local new_path = table.copy(v.path)
--                 table.insert(new_path, {x=x, y=y})
--                 assert(not cash[x][y], "cash[v.x][v.y] is true")
--                 -- trace(v.y)
--                 cash[x][y] = true
--                 -- trace(new_path)
--                 table.insert(queue, {x=x, y=y, path=table.copy(new_path)})
--             end
--             if gm.tilemap[x][y] == 'player' then
--                 -- trace(v.path)
--                 local res = table.copy(v.path)
--                 table.insert(res, {x=x, y=y})
--                 -- cash[v.x][v.y] = true
--                 -- table.insert(queue, {x=v.x, y=v.y, path=table.copy(new_path)})
--                 return res
--             end
--             ::continue::
--         end
--     end
--     -- trace(#cash)
--     local debug_score = 0
--     for x = 1, 240 do
--         for y = 1, 136 do
--             if cash[x][y] then
--                 debug_score = debug_score + 1
--             end
--         end
--     end
--     trace(debug_score)
--     assert(false, "can't find a player")
-- end


return aim
