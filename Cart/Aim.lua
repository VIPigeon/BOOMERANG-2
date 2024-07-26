
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

    local px = self.x // 8
    local py = self.y // 8

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
                local newPath = table.copy(cur.path)
                table.insert(newPath, {x = x, y = y})

                queue:enqueue({x = x, y = y, path = newPath})
                visited[x][y] = true
            end
        end
    end

    error("findn't the way")
end

function aim.visualizePath(path)
    if path then
        for _, tile in ipairs(path) do
            rect(8 * tile.x - gm.x*8 + gm.sx, 8 * tile.y - gm.y*8 + gm.sy, 8, 8, 7)
        end
    end
end

function aim.bfsMapAdaptedV2x2(startPos)
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

    local px = game.player.hitbox:get_center().x // 8
    local py = game.player.hitbox:get_center().y // 8

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

            if (x < 0) or (x > 240 - 1) then
                break
            end
            if (y < 0) or (y > 135 - 1) then
                break
            end

            if gm.isBlockingBfs(x, y) then --двери не твердые 🙈 потому что на карте их нет
                visited[x][y] = true
                goto continue
            end
            if gm.isBlockingBfs(x + 1, y) then
                visited[x + 1][y] = true
                goto continue
            end
            if gm.isBlockingBfs(x, y + 1) then
                visited[x][y + 1] = true
                goto continue
            end
            if gm.isBlockingBfs(x + 1, y + 1) then
                visited[x + 1][y + 1] = true
                goto continue
            end


            if math.inRangeIncl(x, px - 1, px + 1) and math.inRangeIncl(y, py - 1, py + 1) then
                table.insert(cur.path, {x = x, y = y})
                return cur.path
            elseif not visited[x][y] then --🤗
                local newPath = table.copy(cur.path)
                table.insert(newPath, {x = x, y = y})

                queue:enqueue({x = x, y = y, path = newPath})
                visited[x][y] = true
            end

            ::continue::
        end
    end

    -- if math.inRangeIncl(cur.x, px - 1, px + 1) and math.inRangeIncl(cur.y, py - 1, py + 1) then
    --     trace('woooow')
    --     return cur.path
    -- end

    --error("findn't the way") -- when player snuggled to the wall
end


function aim.astar_2x2(startPos)
    local MAX_PATH_LENGTH = 4

    local steps = {
        {x = 1, y =-1},
        {x = 1, y = 1},
        {x =-1, y =-1},
        {x =-1, y = 1},
        {x = 0, y = 1},
        {x = 0, y =-1},
        {x = 1, y = 0},
        {x =-1, y = 0},
    }
    global_px = game.player.hitbox:get_center().x // 8
    global_py = game.player.hitbox:get_center().y // 8
    local px = global_px
    local py = global_py

    local visited = {}
    -- for x = 0, 239 do
    --     visited[x] = {}
    -- end
    for y = 0, 134 do
        visited[y] = {}
    end

    local heap = Heap:new({Heap.Node:new({x = startPos.x, y = startPos.y, path = { {x = startPos.x, y = startPos.y} }})})
    heap.compare = function(node1, node2)
        return #node1.key.path + aim.getShortestKingPath(node1.key.x, node1.key.y, global_px, global_py) > #node2.key.path + aim.getShortestKingPath(node2.key.x, node2.key.y, global_px, global_py);
    end

    while not heap:empty() do
        -- trace(heap:empty())
        local cur = heap:pull()
        -- trace(cur.x.." "..cur.y)

        for _, step in ipairs(steps) do
            local x = cur.x + step.x
            local y = cur.y + step.y

            if (x < 0) or (x > 240 - 1) or (y < 0) or (y > 135 - 1) then
                goto continue
            end

            if gm.isBlockingBfs(x, y) then -- двери не твердые, потому что на карте их нет
                visited[y][x] = true
                goto continue
            end
            if gm.isBlockingBfs(x + 1, y) then
                visited[y][x + 1] = true
                goto continue
            end
            if gm.isBlockingBfs(x, y + 1) then
                visited[y + 1][x] = true
                goto continue
            end
            if gm.isBlockingBfs(x + 1, y + 1) then
                visited[y + 1][x + 1] = true
                goto continue
            end


            if math.inRangeIncl(x, px - 1, px + 1) and math.inRangeIncl(y, py - 1, py + 1) then
                table.insert(cur.path, {x = x, y = y})
                -- trace(#cur.path)
                return cur.path
            elseif not visited[y][x] then --🤗
                local newPath = table.copy(cur.path)
                table.insert(newPath, {x = x, y = y})

                heap:push(Heap.Node:new({x = x, y = y, path = newPath}))
                visited[y][x] = true
            end

            if #cur.path > MAX_PATH_LENGTH then
                return cur.path
            end

            ::continue::
        end
    end
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


function aim.getShortestKingPath(startX, startY, targetX, targetY)
    -- returns length of the shortest path that a chess king can take (board is empty)
    local dx = math.abs(startX - targetX)
    local dy = math.abs(startY - targetY)
    return math.min(dx, dy) + math.abs(dx - dy)
end


return aim
