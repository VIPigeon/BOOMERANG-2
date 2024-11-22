-- title:  BOOMERANG 2: RETURN
-- author: V. Crocodile
-- desc:   A little game about killing flowers.
-- script: lua
C0 = 0  -- прозрачный цвет

-- Heap.lua
Heap = {}
Heap.Node = {}

function Heap.Node:new(key)
    local obj = {
        key = key,
        i = nil
    }
    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Heap.Node:write()
    io.write("Node\tkey="..self.key.."\ti="..self.i.."\n")
end

-- function Heap.compare(node1, node2)
--     return node1.key > node2.key
-- end

function Heap:new(content)
    local obj = {
        tree = content,
        size = #content + 1,
        compare = function(node1, node2)
            return node1.key > node2.key;
        end,
    }
    setmetatable(obj, self)
    self.__index = self
    return obj
end


function Heap:buildHeap()
    for i, node in ipairs(self.tree) do
        node.i = i  -- установление начальных индексов
    end
    for i = self.size // 2, 1, -1 do
        self:heapify(i)
    end
end

function Heap:heapify(i)
    local left = 2 * i
    local right = 2 * i + 1
    local largest = i
    if left < self.size and not self.compare(self.tree[left], self.tree[largest]) then
        largest = left
    end
    if right < self.size and not self.compare(self.tree[right], self.tree[largest]) then
        largest = right
    end

    if largest == i then
        return
    end

    local swapVar = self.tree[largest]
    self.tree[largest] = self.tree[i]
    self.tree[i] = swapVar
    self.tree[i].i = i; self.tree[largest].i = largest;

    self:heapify(largest)
end

function Heap:push(node)
    self.tree[self.size] = node
    self.size = self.size + 1;
    node.i = self.size - 1
    self:increaseKey(node.i, node.key);
end

function Heap:increaseKey(i, key)
    self.tree[i].key = key
    -- io.write(self.tree[i].key.." ")
    while i > 1 and not self.compare(self.tree[i], self.tree[i // 2]) do
    -- while i > 0 and not (self.tree[i].key > self.tree[i // 2].key) do
        local swapVar = self.tree[i]
        self.tree[i] = self.tree[i // 2]
        self.tree[i // 2] = swapVar
        self.tree[i].i = i; self.tree[i//2].i = i//2;
        i = i // 2
    end
end

function Heap:pull()
    local res = self.tree[1];
    self.size = self.size - 1;
    self.tree[1] = self.tree[self.size];
    table.remove(self.tree, nil)  -- remove last element
    self:heapify(1);
    return res.key;
end

function Heap:print()
    for i, e in ipairs(self.tree) do
        e:write()
    end
    io.write("\n")
end

function Heap:empty()
    return #self.tree == 0;
end

--[[
-- Ссылочная структура работает. Вот пруфы:
node1 = Heap.Node:new(1)
node2 = Heap.Node:new(2)
node3 = Heap.Node:new(3)
t = {node1, node2, node3}
print(t[1].key .." ".. t[2].key)
tmp = t[1]
t[1] = t[2]
t[2] = tmp
print(t[1].key .." ".. t[2].key)
t[2].key = 5
print(node1.key .." ".. node2.key)
--]]

--[[
-- Отладка
node = Heap.Node:new(70)
h = Heap:new{Heap.Node:new(1),
Heap.Node:new(2),
Heap.Node:new(4),
Heap.Node:new(-5),
Heap.Node:new(6),
Heap.Node:new(8),
Heap.Node:new(9),
node
}
h:buildHeap()
h:print()
io.write(h:pull().."\n")
io.write(h:pull().."\n")
io.write(h:pull().."\n")
io.write(h:pull().."\n")
io.write(h:pull().."\n")
h:push(Heap.Node:new(-48))
h:push(Heap.Node:new(8))
h:push(Heap.Node:new(4))
h:push(Heap.Node:new(50))
h:push(Heap.Node:new(23))
h:print()
h:increaseKey(node.i, 2)
h:print()
--]]

-- Aim.lua

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
    local MAX_PATH_LENGTH = math.random(4, 9)

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


-- return aim

-- Math.lua

function math.isObtuse(x1,y1,x2,y2,x3,y3)
    return (x1-x2)*(x3-x2)+(y1-y2)*(y3-y2)>0
end


function math.fence(x, left, right)
    if x < left then
        return left
    end
    if x > right then
        return right
    end
    return x
end


function math.round(x)
    return x >= 0 and math.floor(x + 0.5) or math.ceil(x - 0.5)
end

function math.sqr(x)
    return x * x
end

function math.vecLength(vec)
    return math.sqrt(math.sqr(vec.x) + math.sqr(vec.y))
end

function math.vecNormalize(vec)
    local len = math.vecLength(vec)
    return {x = vec.x / len, y = vec.y / len}
end

function math.sign(x)
    if x<0 then
        return -1
    end
    if x>0 then
        return 1
    end
    return 0
end

function math.distance(x1, y1, x2, y2)
    -- возвращает квадрат расстояния между точками
    return math.sqrt((x1 - x2)^2 + (y1 - y2)^2)
end

function math.sq_distance(x1, y1, x2, y2)
    -- возвращает квадрат расстояния между точками
    return math.abs(x1 - x2)^2 + math.abs(y1 - y2)^2
end


function math.sq_point_ortsegment_distance(x, y, x1, y1, x2, y2)
    -- отрезок ортогональный
    if (x == x1 and x == x2) or (y == y1 and y == y2) then
        return 0
    end
    if x1 <= x and x <= x2 then
        return math.min(math.sq_distance(x, y, x1, y1), math.sq_distance(x, y, x2, y2), math.sq_distance(x, y, x, y1))
    end
    if y1 <= y and y <= y2 then
        return math.min(math.sq_distance(x, y, x1, y1), math.sq_distance(x, y, x2, y2), math.sq_distance(x, y, x1, y))
    end
    return math.min(math.sq_distance(x, y, x1, y1), math.sq_distance(x, y, x2, y2))
end


function math.inRangeNotIncl(num, leftBoarder, rightBoarder)
    return num > leftBoarder and num < rightBoarder
end

function math.inRangeIncl(num, leftBoarder, rightBoarder)
    return num >= leftBoarder and num <= rightBoarder
end

-- function math.sq_distance( ... )
--     -- body
-- end


-- return math

-- Animation.lua

anim = {}

function anim.gen(t, n)
    res = {}
    for _, e in ipairs(t) do
        for i = 1, n do
            table.insert(res, e)
        end
    end
    return res
end


function anim.gen60(t)
    -- #t -- делитель 60
    res = {}
    for _, pict in ipairs(t) do
        for i=1, 60 // (#t) do
            table.insert(res, pict)
        end
    end
    return res
end

-- return anim

-- AnimeParticles.lua
-- title:  pslib
-- author: Viza
-- desc:   An advenced particle system library for the VIC-80
-- script: lua


--==================================================================================--
-- INTRO/DOCS ======================================================================--
--==================================================================================--

--[[

Hi!
First of all, don't be intimidated by the size of the source, it is very 
straightforward to understand (hopefully :) )

pslib is:
- data driven: to create a particle system you fill out a couple of tables, then handle it to pslib
- modular: You only need to include the modules you use in your cart
- easily extendable: Can't achieve the particle system behaviour you imagined? Just write a simple new module

So how it works?

A particle system is consist of 4 main parts:
- emit timer(s) dictate WHEN to emit a particle
- emitter(s) define WHERE to create the particle, and the initial SPEED
- drawfunc(s) know how to DRAW a particle
- affector(s) know how to MOVE a particle

To create a particle system, call make_psystem, and then fill the emittimers, emitters,
drawfuncs, and affectors tables with your parameters. See the SAMPLE PARTICLE SYSTEMS section
below for examples.

After that you need to call update_psystems in your TIC function to... uhm... update the 
particle systems, and draw_ps or draw_psystems to draw them.

These are the basics, but actually there are not much more to it. :)
You can find more information below in the comments about the main functions or modules.

If you have questions, feel free to contact me at:
email: viza@ccatgames, twitter: @viza, web: blog.ccatgames.com

--]]



--==================================================================================--
-- PARTICLE SYSTEM LIBRARY =========================================================--
--==================================================================================--

particle_systems = {}

-- Call this, to create an empty particle system, and then fill the emittimers, emitters,
-- drawfuncs, and affectors tables with your parameters.
function make_psystem(minlife, maxlife, minstartsize, maxstartsize, minendsize, maxendsize)
	local ps = {
	-- global particle system params

	-- if true, automatically deletes the particle system if all of it's particles died
	autoremove = true,

	minlife = minlife,
	maxlife = maxlife,

	minstartsize = minstartsize,
	maxstartsize = maxstartsize,
	minendsize = minendsize,
	maxendsize = maxendsize,

	-- container for the particles
	particles = {},

	-- emittimers dictate when a particle should start
	-- they called every frame, and call emit_particle when they see fit
	-- they should return false if no longer need to be updated
	emittimers = {},

	-- emitters must initialize p.x, p.y, p.vx, p.vy
	emitters = {},

	-- every ps needs a drawfunc
	drawfuncs = {},

	-- affectors affect the movement of the particles
	affectors = {},
	}

	table.insert(particle_systems, ps)

	return ps
end

-- Call this to update all particle systems
function update_psystems()
	local timenow = time()
	for key,ps in pairs(particle_systems) do
		update_ps(ps, timenow)
	end
end

-- updates individual particle systems
-- most of the time, you don't have to deal with this, the above function is sufficient
-- but you can call this if you want (for example fast forwarding a particle system before first draw)
function update_ps(ps, timenow)
	--trace("updting~")
	for key,et in pairs(ps.emittimers) do
		local keep = et.timerfunc(ps, et.params)
		if (keep==false) then
			table.remove(ps.emittimers, key)
		end
	end

	for key,p in pairs(ps.particles) do
		p.phase = (timenow-p.starttime)/(p.deathtime-p.starttime)

		for key,a in pairs(ps.affectors) do
			a.affectfunc(p, a.params)
		end

		p.x = p.x + p.vx
		p.y = p.y + p.vy

		local dead = false
		if (p.x<0 or p.x>240 or p.y<0 or p.y>136) then
			dead = true
		end

		if (timenow>=p.deathtime) then
			dead = true
		end

		if (dead==true) then
			table.remove(ps.particles, key)
		end
	end

	if (ps.autoremove==true and #ps.particles<=0) then
		local psidx = -1
		for pskey,pps in pairs(particle_systems) do
			if pps==ps then
				table.remove(particle_systems, pskey)
				return
			end
		end
	end
end

-- draw a single particle system
function draw_ps(ps, params)
	for key,df in pairs(ps.drawfuncs) do
		df.drawfunc(ps, df.params)
	end
end

-- draws all particle system
-- This is just a convinience function, you probably want to draw the individual particles,
-- if you want to control the draw order in relation to the other game objects for example
function draw_psystems()
	--trace("bib")
	for key,ps in pairs(particle_systems) do
		draw_ps(ps)
	end
end

-- This need to be called from emitttimers, when they decide it is time to emit a particle
function emit_particle(psystem)
	local p = {}

	local ecount = nil
	local e = psystem.emitters[math.random(#psystem.emitters)]
	e.emitfunc(p, e.params)

	p.phase = 0
	p.starttime = time()
	p.deathtime = time()+frnd(psystem.maxlife-psystem.minlife)+psystem.minlife

	p.startsize = frnd(psystem.maxstartsize-psystem.minstartsize)+psystem.minstartsize
	p.endsize = frnd(psystem.maxendsize-psystem.minendsize)+psystem.minendsize

	table.insert(psystem.particles, p)
end

function frnd(max)
	return math.random()*max
end


--================================================================--
-- MODULES =======================================================--
--================================================================--

-- You only need to copy the modules you actually use to your program


-- EMIT TIMERS ==================================================--

-- Spawns a bunch of particles at the same time, then removes itself
-- params:
-- num - the number of particle to spawn
function emittimer_burst(ps, params)
	for i=1,params.num do
		emit_particle(ps)
	end
	return false
end

-- Emits a particle every "speed" time
-- params:
-- speed - time between particle emits
function emittimer_constant(ps, params)
	if (params.nextemittime<=time()) then
		emit_particle(ps)
		params.nextemittime = params.nextemittime + params.speed
	end
	return true
end

-- EMITTERS =====================================================--

-- Emits particles from a single point
-- params:
-- x,y - the coordinates of the point
-- minstartvx, minstartvy and maxstartvx, maxstartvy - the start velocity is randomly chosen between these values
function emitter_point(p, params)
	p.x = params.x
	p.y = params.y

	p.vx = frnd(params.maxstartvx-params.minstartvx)+params.minstartvx
	p.vy = frnd(params.maxstartvy-params.minstartvy)+params.minstartvy
end

-- Emits particles from the surface of a rectangle
-- params:
-- minx,miny and maxx, maxy - the corners of the rectangle
-- minstartvx, minstartvy and maxstartvx, maxstartvy - the start velocity is randomly chosen between these values
function emitter_box(p, params)
	p.x = frnd(params.maxx-params.minx)+params.minx
	p.y = frnd(params.maxy-params.miny)+params.miny

	p.vx = frnd(params.maxstartvx-params.minstartvx)+params.minstartvx
	p.vy = frnd(params.maxstartvy-params.minstartvy)+params.minstartvy
end

-- AFFECTORS ====================================================--

-- Constant force applied to the particle troughout it's life
-- Think gravity, or wind
-- params: 
-- fx and fy - the force vector
function affect_force(p, params)
	p.vx = p.vx + params.fx
	p.vy = p.vy + params.fy
end

-- A rectangular region, if a particle happens to be in it, apply a constant force to it
-- params: 
-- zoneminx, zoneminy and zonemaxx, zonemaxy - the corners of the rectangular area
-- fx and fy - the force vector
function affect_forcezone(p, params)
	if (p.x>=params.zoneminx and p.x<=params.zonemaxx and p.y>=params.zoneminy and p.y<=params.zonemaxy) then
		p.vx = p.vx + params.fx
		p.vy = p.vy + params.fy
	end
end

-- A rectangular region, if a particle happens to be in it, the particle stops
-- params: 
-- zoneminx, zoneminy and zonemaxx, zonemaxy - the corners of the rectangular area
function affect_stopzone(p, params)
	if (p.x>=params.zoneminx and p.x<=params.zonemaxx and p.y>=params.zoneminy and p.y<=params.zonemaxy) then
		p.vx = 0
		p.vy = 0
	end
end

-- A rectangular region, if a particle cames in contact with it, it bounces back
-- params: 
-- zoneminx, zoneminy and zonemaxx, zonemaxy - the corners of the rectangular area
-- damping - the velocity loss on contact
function affect_bouncezone(p, params)
	if (p.x>=params.zoneminx and p.x<=params.zonemaxx and p.y>=params.zoneminy and p.y<=params.zonemaxy) then
		p.vx = -p.vx*params.damping
		p.vy = -p.vy*params.damping
	end
end

-- A point in space which pulls (or pushes) particles in a specified radius around it
-- params:
-- x,y - the coordinates of the affector
-- radius - the size of the affector
-- strength - push/pull force - proportional with the particle distance to the affector coordinates
function affect_attract(p, params)
	if (math.abs(p.x-params.x)+math.abs(p.y-params.y)<params.mradius) then
		p.vx = p.vx + (p.x-params.x)*params.strength
		p.vy = p.vy + (p.y-params.y)*params.strength
	end
end

-- Moves particles around in a sin/cos wave or circulary. Directly modifies the particle position
-- params:
-- speed - the effect speed
-- xstrength, ystrength - the amplituse around the x and y axes
function affect_orbit(p, params)
	params.phase = params.phase + params.speed
	p.x = p.x + math.sin(params.phase)*params.xstrength
	p.y = p.y + math.cos(params.phase)*params.ystrength
end

-- DRAW FUNCS ===================================================--

-- Filled circle particle drawer, the particle animates it's size and color trough it's life
-- params:
-- colors array - indexes to the palette, the particle goes trough these in order trough it's lifetime
-- startsize and endsize is coming from the particle system parameters, not the draw func params!
function draw_ps_fillcirc(ps, params)
	for key,p in pairs(ps.particles) do
		c = math.floor(p.phase*#params.colors)+1
		r = (1-p.phase)*p.startsize+p.phase*p.endsize
		circ(p.x,p.y,r,params.colors[c])
	end
end

-- Single pixel particle, which animates trough the given colors
-- params:
-- colors array - indexes to the palette, the particle goes trough these in order trough it's lifetime
function draw_ps_pixel(ps, params)
	for key,p in pairs(ps.particles) do
		c = math.floor(p.phase*#params.colors)+1
		pix(p.x,p.y,params.colors[c])
	end
end

-- Draws a line between the particle's previous and current position, kind of "motion blur" effect
-- params:
-- colors array - indexes to the palette, the particle goes trough these in order trough it's lifetime
function draw_ps_streak(ps, params)
	for key,p in pairs(ps.particles) do
		c = math.floor(p.phase*#params.colors)+1
		line(p.x,p.y,p.x-p.vx,p.y-p.vy,params.colors[c])
	end
end

-- Animates trough the given frames with the given speed
-- params:
-- frames array - indexes to sprite tiles
function draw_ps_animspr(ps, params)
	params.currframe = params.currframe + params.speed
	if (params.currframe>#params.frames) then
		params.currframe = 1
	end
	for key,p in pairs(ps.particles) do
		-- pal(7,params.colors[math.floor(p.endsize)])
		spr(params.frames[math.floor(params.currframe+p.startsize)%#params.frames],p.x,p.y,0)
	end
	-- pal()
end

-- Maps the given frames to the life of the particle
-- params:
-- frames array - indexes to sprite tiles
function draw_ps_agespr(ps, params)
	for key,p in pairs(ps.particles) do
		local f = math.floor(p.phase*#params.frames)+1
		spr(params.frames[f],p.x,p.y,0)
	end
end

-- Each particle is randomly chosen from the given frames
-- params:
-- frames array - indexes to sprite tiles
function draw_ps_rndspr(ps, params)
	for key,p in pairs(ps.particles) do
		-- pal(7,params.colors[math.floor(p.endsize)])
		spr(params.frames[math.floor(p.startsize)],p.x,p.y,0)
	end
	-- pal()
end


--==================================================================================--
-- SAMPLES PARTICLE SYSTEMS ========================================================--
--==================================================================================--

function make_explosparks_ps(ex,ey)
	local ps = make_psystem(300,700, 1,2,0.5,0.5)
	
	table.insert(ps.emittimers,
		{
			timerfunc = emittimer_burst,
			params = { num = 10}
		}
	)
	table.insert(ps.emitters, 
		{
			emitfunc = emitter_point,
			params = { x = ex, y = ey, minstartvx = -1.5, maxstartvx = 1.5, minstartvy = -1.5, maxstartvy=1.5 }
		}
	)
	table.insert(ps.drawfuncs,
		{
			drawfunc = draw_ps_pixel,
			params = { colors = {12,10,1,4,1,2} }
		}
	)
	table.insert(ps.affectors,
		{ 
			affectfunc = affect_force,
			params = { fx = 0, fy = 0.1 }
		}
	)

    return ps
end
--100,500, 9,14,1,3
function make_explosion_ps(ex,ey, min_time, max_time, min_start_size, max_start_size, min_end_size, max_end_size)
	local ps = make_psystem(min_time, max_time, min_start_size, max_start_size, min_end_size, max_end_size)
	
	table.insert(ps.emittimers,
		{
			timerfunc = emittimer_burst,
			params = { num = 4 }
		}
	)
	table.insert(ps.emitters, 
		{
			emitfunc = emitter_box,
			params = { minx = ex-4, maxx = ex+4, miny = ey-4, maxy= ey+4, minstartvx = 0, maxstartvx = 0, minstartvy = 0, maxstartvy=0 }
		}
	)
	table.insert(ps.drawfuncs,
		{
			drawfunc = draw_ps_fillcirc,
			params = { colors = {15,0,14,9,9,4} }
		}
	)

    return ps
end
--200, 2000, 1, 2, 2, 3
function make_smoke_ps(ex,ey, min_time, max_time, min_start_size, max_start_size, min_end_size, max_end_size)
	local ps = make_psystem(min_time, max_time, min_start_size, max_start_size, min_end_size, max_end_size)
	
	ps.autoremove = false

	table.insert(ps.emittimers,
		{
			timerfunc = emittimer_constant,
			params = {nextemittime = time(), speed = 200}
		}
	)
	table.insert(ps.emitters, 
		{
			emitfunc = emitter_box,
			--params = { minx = ex-4, maxx = ex+4, miny = ey, maxy= ey+2, minstartvx = 0, maxstartvx = 0, minstartvy = 0, maxstartvy=0 }
			params = { minx = ex-2, maxx = ex+2, miny = ey, maxy= ey+2, minstartvx = 0, maxstartvx = 0, minstartvy = 0, maxstartvy=0 }
		}
	)
	table.insert(ps.drawfuncs,
		{
			drawfunc = draw_ps_fillcirc,
			params = { colors = {1,3,2} }
		}
	)
	table.insert(ps.affectors,
		{ 
			affectfunc = affect_force,
			params = { fx = data.Cutscene.smoke_dx, fy = data.Cutscene.smoke_dy }
		}
	)

    return ps
end

function make_explosmoke_ps(ex,ey)
	local ps = make_psystem(1500,2000, 5,8, 17,18)

	table.insert(ps.emittimers,
		{
			timerfunc = emittimer_burst,
			params = { num = 1 }
		}
	)
	table.insert(ps.emitters, 
		{
			emitfunc = emitter_point,
			params = { x = ex, y = ey, minstartvx = 0, maxstartvx = 0, minstartvy = 0, maxstartvy=0 }
		}
	)
	table.insert(ps.drawfuncs,
		{
			drawfunc = draw_ps_fillcirc,
			params = { colors = {2} }
		}
	)
	table.insert(ps.affectors,
		{ 
			affectfunc = affect_force,
			params = { fx = 0.003, fy = -0.01 }
		}
	)

    return ps
end


-- CutScene.lua
CutScene = {}

function CutScene:new(plr, bk)
	local obj = {
        player = plr,
        bike = bk,
        x = (game.bike.x) - gm.x*8 + gm.sx,
        y = (game.bike.y) + 8 - gm.y*8 + gm.sy,
        status = '0xDEADC0DE',
        TIMERCRUTCH = true,
        THENBIKEGOAWAY = false,
        bike_speed = 0.005,
        bike_acceleration = 0.001,
        bike_dx = 1,
        bike_dy = 0,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function CutScene:beef_preparation()
    game.player.sprite = Sprite:new(anim.gen60({0}), 1)
    game.player.like_0xDEADBEEF = true
end

function CutScene:updateGMXGMSXGMYGMSY()
	self.x = (game.bike.x) - gm.x*8 + gm.sx
    self.y = (game.bike.y) + 8 - gm.y*8 + gm.sy
end
--todo сделать дымок, заволакивающий глаза и весь экран в конце
--сделать дым больше
--подключить таймер
function CutScene:make_smokkkkk()
	self.crutchy = make_smoke_ps(self.x, self.y, 200, 2000, 1, 2, 2, 3)
	self.cringy = make_explosion_ps(self.x, self.y, 200,500, 9,14,1,3) --100, 500
    self.crutchy.autoremove = true;
    self.cringy.autoremove = true;
end

function table.clear(t)
    for k in pairs (t) do
        t [k] = nil
    end
end

local cccrutch = 0

function CutScene:go_away()
    if self.lol then
        table.clear(self.lol.emittimers)
    else
        table.clear(self.crutchy.emittimers)
        table.clear(self.cringy.emittimers)
    end

    local x = (game.bike.x) - gm.x*8 + gm.sx
    local y = (game.bike.y) + 8 - gm.y*8 + gm.sy

    cccrutch = cccrutch + 1
    if cccrutch == data.Cutscene.smoke_frequency then
        self.lol = make_smoke_ps(x, y,
            data.Cutscene.smoke_minlifetime,
            data.Cutscene.smoke_maxlifetime, 1, 7, 4, 6
        )
        self.lol.autoremove = true
        cccrutch = 0
    end

    self.bike_speed = self.bike_speed + self.bike_acceleration
    local ddx = self.bike_speed * self.bike_dx
    local ddy = self.bike_speed * self.bike_dy
    self.bike:moveUnclamped(ddx, ddy)
end

function CutScene:init()
	self:beef_preparation()
end

function CutScene:draw()
	draw_psystems()
end

function CutScene:update()
    -- trace(self.bike_speed)
    if self.bike_speed > 0.54 then
        game.finish()
        return
    end
	update_psystems()
end

-- Body.lua
Body = {}

function Body:new(sprite, x, y)
    local obj = {
        sprite = sprite,
        hitbox = 'nil',
        flip = 0,
        rotate = 0,
        x = x, y = y,
        isDead = false,  -- в этой игре не нужно понятие здоровья
        born_flag = true
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end

function Body:willCollideAfter(dx, dy)
    local oldX = self.x
    local oldY = self.y

    self:move(dx, dy)
    -- если враги будут уметь двигаться, то будет ошибка из-за проверки с самим собой
    for _, collideable in ipairs(game.collideables) do
        if collideable.hitbox == nil then
            if collideable.hitboxLeft:collide(self.hitbox) or
                collideable.hitboxRight:collide(self.hitbox) then
                    self:set_position(oldX, oldY)
                    return true
            end
        elseif collideable.hitbox:collide(self.hitbox) then
            self:set_position(oldX, oldY)
            return true
        end
    end
    local will_collide = not self.hitbox:mapCheck()

    self:set_position(oldX, oldY)
    return will_collide
end

function Body:moveUnclamped(dx, dy)
    local newX = self.x + dx * Time.dt()
    local newY = self.y + dy * Time.dt()

    self.x = newX
    self.y = newY

    self.hitbox:set_xy(self.x, self.y)
end

function Body:move(dx, dy)
    local newX = self.x + dx
    local newY = self.y + dy

    self.x = newX
    self.y = newY

    --self.x = math.fence(newX, 0, 240 - 8)
    --self.y = math.fence(newY, 0, 136 - 8)

    self.hitbox:set_xy(self.x, self.y)
end

function Body:stay_in_borders()
    self.x = math.fence(newX, 0, 240 - 8)
    self.y = math.fence(newY, 0, 136 - 8)

    self.hitbox:set_xy(self.x, self.y)
end

function Body:set_position(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function Body:draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
end

function Body:born_update()
    self:draw()
    if self.sprite:animationEnd() then
        self.born_flag = false
        return false
    end
    self.sprite:nextFrame()
    return true
end

-- return Body

-- Table.lua
function table.copy(t)
  local t2 = {}
  for k,v in pairs(t) do
    t2[k] = v
  end
  return t2
end

function table.equals(t1, t2)
    for i, value in ipairs(t1) do
        if value ~= t2[i] then
            return false
        end
    end
    return true
end

function table.concatTable(destination, source)
    for _, element in ipairs(source) do
        table.insert(destination, element)
    end
end

function table.contains_table(t, element)
    for _, value in pairs(t) do
        if table.equals(value, element) then
            return true
        end
    end
    return false
end

function table.contains(t, element)
    for _, value in pairs(t) do
        if value == element then
            return true
        end
    end
    return false
end

function table.removeElement(t, element)
    ind = 0
    for i, value in ipairs(t) do
        if value == element then
            ind = i
            break
        end
    end

    if ind > 0 and ind <= #t then -- 😁😁😁😁 Тут был '<' я его полтора часа исправлял на '<='
        table.remove(t, ind)
    end
end

function table.removeElements(t, removed)
    for i, value in ipairs(t) do
        if table.contains(removed, value) then
            table.remove(t, i)
        end
    end
end

function table.reversed(t)
    res = {}
    for i = #t, 1, -1 do
        table.insert(res, t[i])
    end
    return res
end

function table.length(t) -- 🤓
    local counter = 0
    for _ in pairs(t) do
        counter = counter + 1
    end
    return counter
end

function table.chooseRandomElement(t)
    local rand = math.random(table.length(t))
    local ind = 1
    local choosen = nil 
    for _, elem in pairs(t) do
        if ind == rand then
            choosen = elem
        end
        ind = ind + 1
    end
    return choosen
end

-- return table

-- Hitbox.lua
--Hitbox = table.copy(Rect)
Hitbox = {}

function Hitbox:new(x1, y1, x2, y2)
    local obj = {
        x1 = x1,
        y1 = y1,
        x2 = x2,
        y2 = y2,
        shiftX = 0,
        shiftY = 0,
        type = 'hitbox',
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end


function Hitbox:new_with_shift(x1, y1, x2, y2, shiftX, shiftY)
   local obj = {
        x1 = x1, y1 = y1,
        x2 = x2, y2 = y2,
        shiftX = shiftX,
        shiftY = shiftY
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self
    return obj
end


function Hitbox:collide(hb)
    if hb.type == 'hitcircle' then
        return hb:collide(self)
    end
    if math.floor(hb.x1) > math.floor(self.x2) or
        math.floor(self.x1) > math.floor(hb.x2) or
        math.floor(hb.y1) > math.floor(self.y2) or
        math.floor(self.y1) > math.floor(hb.y2) then
        return false
    end
    return true
end


function Hitbox:mapCheck()
    return gm.getTileType(self.x1, self.y1) == TileType.Void
        and gm.getTileType(self.x1, self.y2) == TileType.Void
        and gm.getTileType(self.x2, self.y1) == TileType.Void
        and gm.getTileType(self.x2, self.y2) == TileType.Void
end


function Hitbox:set_xy(x, y)
    x = x + self.shiftX
    y = y + self.shiftY
    local dx = x - self.x1
    local dy = y - self.y1
    self.x1 = x
    self.y1 = y
    self.x2 = self.x2 + dx
    self.y2 = self.y2 + dy
end


function Hitbox:draw(color)
    local x1 = self.x1 - gm.x*8 + gm.sx
    local y1 = self.y1 - gm.y*8 + gm.sy
    local w = (self.x2 - self.x1)
    local h = (self.y2 - self.y1)
    rect(x1, y1, w, h, color)
end


function Hitbox:get_center()
    local x1 = self.x1
    local x2 = self.x2
    local y1 = self.y1
    local y2 = self.y2
    return {
        x = x1 + (x2 - x1) / 2,
        y = y1 + (y2 - y1) / 2
    }
end

function Hitbox:getWidth()
    return self.x2 - self.x1
end

function Hitbox:getHeight()
    return self.y2 - self.y1
end

-- return Hitbox

-- HitCircle.lua
HitCircle = table.copy(Hitbox)


function HitCircle:new(x, y, d)
    local obj = {
        x = x, y = y,  -- left top pixel
        d = d,  -- diameter
        hb = Hitbox:new(x, y, x+d, y+d),  -- для упрощения расчетов
        type = 'hitcircle',
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self
    return obj
end

function HitCircle:collide(hb)
    if not self.hb:collide(hb) then
        return false
    end
    local d = self.d
    -- is center in hb
    if hb.x1 <= self.x + d/2 and self.x + d/2 <= hb.x2 and
            hb.y1 <= self.y + d/2 and self.y + d/2 <= hb.y2 then
        return true
    end
    -- is hb side collide circle
    if math.sq_point_ortsegment_distance(self.x + d/2, self.y + d/2, hb.x1, hb.y1, hb.x1, hb.y2) <= d^2 / 4 then
        return true
    end
    if math.sq_point_ortsegment_distance(self.x + d/2, self.y + d/2, hb.x2, hb.y1, hb.x2, hb.y2) <= d^2 / 4 then
        return true
    end
    if math.sq_point_ortsegment_distance(self.x + d/2, self.y + d/2, hb.x1, hb.y1, hb.x2, hb.y1) <= d^2 / 4 then
        return true
    end
    if math.sq_point_ortsegment_distance(self.x + d/2, self.y + d/2, hb.x1, hb.y2, hb.x2, hb.y2) <= d^2 / 4 then
        return true
    end
    return false
end

function HitCircle:mapCheck()
    return self.hb:mapCheck()
end

function HitCircle:set_xy(x, y)
    self.x = x
    self.y = y
    self.hb:set_xy(x, y)
end

function HitCircle:drawOutline(color)
    local radius = math.floor(self.d/2)
    -- circb(radius + self.x - 8*gm.x + gm.sx, radius + self.y - 8*gm.y + gm.sy, (self.d/2), color)
    circb(radius + self.x - 8*gm.x + gm.sx - 1, radius + self.y - 8*gm.y + gm.sy - 1, (self.d/2), color)
end

function HitCircle:draw(color)
    local radius = math.floor(self.d/2)
    -- circ(radius + self.x - 8*gm.x + gm.sx, radius + self.y - 8*gm.y + gm.sy, self.d/2, color)
    circ(radius + self.x - 8*gm.x + gm.sx - 1, radius + self.y - 8*gm.y + gm.sy - 1, self.d/2, color)
end

function HitCircle:get_center()
    local x1 = self.x
    local x2 = self.x + self.d
    local y1 = self.y
    local y2 = self.y + self.d
    return {
        x = x1 + (x2 - x1) / 2,
        y = y1 + (y2 - y1) / 2
    }
end

function HitCircle:getWidth()
    return self.d
end

function HitCircle:getHeight()
    return self.d
end

-- return HitCircle

-- Sprite.lua

Sprite = {}


function Sprite:new(animation, size)
    local obj = {
        animation = animation,
        frame = 1,  -- номер кадра
        size = size  -- размер спрайта
    }
    -- чистая магия!
    setmetatable(obj, self)
    self.__index = self; return obj
end

function Sprite:getFrame()
    return self.frame
end

function Sprite:setFrame(frame)
    self.frame = math.round(frame)
end

function Sprite:nextFrame()
    self.frame = self.frame % #self.animation + 1
end

function Sprite:draw(x, y, flip, rotate)
    spr(self.animation[self.frame], x, y, C0, 1, flip, rotate, self.size, self.size)
end

function Sprite:animationEnd()
    return self.frame == #self.animation
end


function Sprite:copy()
    return Sprite:new(self.animation, self.size)
end


StaticSprite = {}
function StaticSprite:new(sprite, size)
    local obj = {
        sprite = sprite,
        size = size
    }
    setmetatable(obj, self)
    self.__index = self; return obj
end

function StaticSprite:copy()
    return self
end

function StaticSprite:draw(x, y, flip, rotate)
    spr(self.sprite, x, y, C0, 1, flip, rotate, self.size, self.size)
end

function StaticSprite:animationEnd()
    -- Страница специально оставлена пустой для литературного эффекта. Спасибо ООП!
end
function StaticSprite:nextFrame()
    -- Страница специально оставлена пустой для литературного эффекта. Спасибо ООП!
end
function StaticSprite:getFrame()
    -- Страница специально оставлена пустой для литературного эффекта. Спасибо ООП!
end
function StaticSprite:setFrame(frame)
    -- Страница специально оставлена пустой для литературного эффекта. Спасибо ООП!
end
function StaticSprite:nextFrame()
    -- Страница специально оставлена пустой для литературного эффекта. Спасибо ООП!
end



-- return Sprite


-- Drums.lua

--[[
Содержит в себе описание ритма и музыки для пулеметов

В качестве ключа drums содержит id spawn спрайта
]]

drums = {
    [48] = {beatMap = {0,0,0,0, 0,0,0,1, 1,0,0,0, 0,0,0,0,},
    sfxMap = {
        {2, 'C#3', -1, 1, 4, 0},
        {1, 'B-6', -1, 1, 6, 0},
        }
    },
    [49] = {beatMap = {0,1, 0,1, 0,1, 0,1,},
    sfxMap = {
        {2, 'C#3', -1, 2, 4, 0},
        {1, 'B-6', -1, 2, 6, 0},
        }
    },
}
-- BassLine.lua

--[[
Содержит в себе описание ритма и музыки для роз
]]

bassLine = {}

bassLine.rose = {}
bassLine.rose.D2 = {
    beatMap = {1,0,0,0,0,0,0,0},
    sfxMap = {
        {0, 'D-3', -1, 0, 10, 0},
        {0, 'C#3', -1, 0, 10, 0}
    }
}

bassLine.rose.Fd2 = {
    beatMap = {0,0,1,0,0,0,1,0},
    sfxMap = {{0, 'F#3', -1, 0, 10, 0}}
}

bassLine.rose.Gd2 = {
    beatMap = {0,0,0,0,1,0,0,0},
    sfxMap = {{0, 'G#3', -1, 0, 12, 0}}   
}

-- Data.lua
math.randomseed(12412)

--Эпиграф: 

        --"-- Я дурак 😫"

data = {}

-- 14, 15, 30, 31 - Резервные тайлы (почему бы и нет)

GAME_BPM = 160

C0 = 0

KEY_W = 23
KEY_A = 01
KEY_S = 19
KEY_D = 04
KEY_R = 18
KEY_UP = 58
KEY_DOWN = 59
KEY_LEFT = 60
KEY_RIGHT = 61

KEY_to_btn = {
    [KEY_W] = 0,
    [KEY_S] = 1,
    [KEY_A] = 2,
    [KEY_D] = 3,
    [KEY_UP] = 7,
    [KEY_DOWN] = 4,
    [KEY_LEFT] = 6,
    [KEY_RIGHT] = 5,
}


KEY_B = 02 -- Что это?? Это круто. 🙂 ЁЯЩа<😎>

MAP_WIDTH = 239
MAP_HEIGHT = 135

PLAYER_START_Y = 76 * 8 -- 128 * 8 -- 😋😋
PLAYER_START_X = 105 * 8 -- 42 * 8  -- 😲😲
-- PLAYER_START_X = 8* 141
-- PLAYER_START_Y = 8* 79

-- PLAYER_END_Y = 89 * 8 -- BYKE 😎😎
-- PLAYER_END_X = 118 * 8 -- G🤠T🤠 BYKE

DECORATION_IDS = {
    100,
    101,
    102,
    103,
    104
}
DECORATION_ANIMATION_OFFSET = 16

CAMERA_WINDOW_WIDTH = 40
CAMERA_WINDOW_HEIGHT = 20
CAMERA_WINDOW_START_X = PLAYER_START_X - CAMERA_WINDOW_WIDTH / 2
CAMERA_WINDOW_START_Y = PLAYER_START_Y - CAMERA_WINDOW_HEIGHT / 2
CAMERA_SPEED = 0.3

MAP_WIDTH = 239
MAP_HEIGHT = 135

M44 = 24  -- константа для Metronome4_4

data.fruitSFX = {
    [144] = {63, 'B-5', -1, 3, 5, 0},
    [160] = {63, 'D-6', -1, 3, 5, 0},
    [176] = {63, 'E-6', -1, 3, 5, 0},
    [192] = {63, 'F-6', -1, 3, 5, 0},
}

data.Player = {
    movementNormalizerStraight = 1,
    movementNormalizerDiagonal = 0.7,
    speed = 1.03,
    -- speed = 0.1,
    deathParticleSprite = StaticSprite:new(377, 1),
    deathAnimationDurationMs = 1000,
    deathParticleCountMin = 10,
    deathParticleCountMax = 20,
    deathAnimationParticleSpeed = 0.4,

    sfx = {
        -- leverOn = {56, 'E-6', -1, 3, 1, -2},
        leverOn = {57, 'E-6', -1, 3, 5, 0},
        leverOff = {57, 'E-5', -1, 3, 5, 0},
        closeDoor = {58, 'D-2', -1, 3, 8, 1},
        checkpoint = {59, 'E-5', -1, 3, 2, -1},
    }
}

function plr_death_anim()
    res = {}
    for i = 272, 278 do
        for _ = 1, 8 do
            table.insert(res, i)
        end
    end
    for _ = 1, 4 do
        table.insert(res, 279)
    end
    return res
end

data.Player.sprites = {
    stayFront = Sprite:new({257}, 1),
    runFront = Sprite:new(anim.gen60({256, 257, 258, 259, 256, 257, 258, 259, 256, 257, 258, 259}), 1),
    death = Sprite:new({452, 453, 454}, 1),
    hat = Sprite:new(anim.gen60({279}), 1),
    stayBack = Sprite:new({465}, 1),
    runBack = Sprite:new(anim.gen60({464, 465, 466, 467, 464, 465, 466, 467, 464, 465, 466, 467}), 1),
}

data.Boomerang = {
    flightNormalizerStraight = 1,
    flightNormalizerDiagonal = 1 / math.sqrt(2),
    speed = 0.1,
    decelerationConstant = 80, -- in context: CurentSpeed -= (StartSpeed / this)
    damagePerMillisecond = 0.1,
}
data.Boomerang.sprites = {
    spinning = Sprite:new(anim.gen60({264, 265, 266, 264, 265, 266, 264, 265, 266, 264, 265, 266}), 1),
    hurtingHorizontal = Sprite:new(anim.gen60({473, 474, 475, 476, 477, 478, 479}), 1),
    hurtingVertical = Sprite:new(anim.gen60({473 + 16, 474 + 16, 475 + 16, 476 + 16, 477 + 16, 478 + 16, 479 + 16}), 1),
}

data.Bike = {}

data.Bike.sprites = {
    waitingForHero = StaticSprite:new(138,2),
    himAgain = StaticSprite:new(140, 2),
    sparklualCycleModifier = 10,
}
data.Bike.sprites.animations = {
    sparkingWhileWaitingMyBoy = Sprite:new(anim.gen({505, 506, 507, 508, 509, 510}, 6), 1),
    notSparklingBecauseSandnessComeAgain = StaticSprite:new(0, 1),
    -- notSparklingBecauseSandnessCameAgain = StaticSprite:new({0}, 1),
    notSparklingBecauseBoring = StaticSprite:new(0, 1),
    -- notSparkling = Sprite:new({0}, 1),
    -- notSparklingAgain = Sprite:new({0}, 1),
    -- notSparklingAndAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAndAgain = Sprite:new({0}, 1),
    sparklingWhileExhaustedWaitingMyBoy = Sprite:new(anim.gen({457, 458, 459, 460, 461, 462, 463}, 6), 1),
    -- notSparklingAgainAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAndAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAgainAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAgainAgainAgainAgina = Sprite:new({0}, 1),
}

--Map и mapConstants должны быть уничтожены

data.Map = {}

data.Map.WallTileIds = {
    208, 209, 210, 224, 225, 226, 240, 241, 242, 142, 143, 158, 159
}

data.mapConstants = {}

--🤣😂😅😓😥😪🤤
data.mapConstants.bikeTiles = {
    --['comparator'] = 138, 
    --['comparaptor'] = 139,
    ['comparader'] = 138 + 16,
    ['comparactor'] = 139 + 16,
}
--🥶😱😨😰😭😢🤤

-- (0 o 0) Use a function for this later
-- Turned off wire id --> Turned on wire id
data.mapConstants.turnedOffWires = {
    [146] = 146 + 32,
    [147] = 147 + 32,
    [148] = 148 + 32,
    [146 + 16] = 146 + 16 + 32,
    [147 + 16] = 147 + 16 + 32,
    [148 + 16] = 148 + 16 + 32,
}

-- Turned on wire id --> Turned off wire id
data.mapConstants.turnedOnWires = {
    [146 + 32] = 146,
    [147 + 32] = 147,
    [148 + 32] = 148,
    [146 + 16 + 32] = 146 + 16,
    [147 + 16 + 32] = 147 + 16,
    [148 + 16 + 32] = 148 + 16,
}

-- Door tile id --> Offset from left top tile
data.mapConstants.doorOffsetsIds = {
    [41] = {x = 0, y = 0},
    [42] = {x = -1, y = 0},
    [41 + 16] = {x = 0, y = -1},
    [42 + 16] = {x = -1, y = -1},
}

data.mapConstants.doorIds = {
    [204] = 204,
    [205] = 205,
    [206] = 206,
    [204 + 16] = 204 + 16,
    [205 + 16] = 205 + 16,
    [206 + 16] = 206 + 16,
}


data.mapConstants.leverIds = {
    [1] = 1,
    [2] = 2,
    [3] = 3,
}

data.mapConstants.settingLeverIds = {
    [1] = 4,
    [2] = 5,
    [3] = 6,
}

data.Door = {
    speed = 0.1,
    closingAcceleration = 0.01,
    widthTiles = 6,
    heightTiles = 4,
    shakeTimeTics = 20,
    closedGapInPixels = 4,
    solidTileId = 207,
}
data.Door.spriteTiles = {
    upperLeft = 204,
    upperMid = 205,
    upperRight = 206,
    bottomLeft = 204 + 16,
    bottomMid = 205 + 16,
    bottomRight = 206 + 16,
}
data.Door.sprite = {
    leftPart = -1,
    rightPart = -1,
}

data.Taraxacum = {
    color = 12,
    speed = 2,

    radius = 2,
    staticRadius = 3,
    bodyColor = 10,
    staticBodyLength = 10,
    staticTaraxacumSpawnTile = { 97 },

    deathBulletCount = 6,
    deathBulletSlowCount = 3,
    deathBulletFastCount = 3,

    deathBulletSpeed = 0.37,
    deathSlowBulletSpeed = 0.2,
    deathFastBulletSpeed = 0.5,

    deathBulletSpread = 2.5,

    deathBulletSprite = StaticSprite:new(378, 1),
}

data.StaticTaraxacum = {
    bodyColor = 9,
    -- radius = 2,
    -- speed = 2,
    -- deathBulletCount = 6,
    -- deathBulletSlowCount = 3,
    -- deathBulletFastCount = 3,
    -- deathBulletSpread = 2,
}

local turnOnAnimationFrames = {}
for i = 213, 217 do
    table.insert(turnOnAnimationFrames, i)
end
for i = 213 + 16, 217 + 16 do
    table.insert(turnOnAnimationFrames, i)
end
for i = 213 + 32, 217 + 32 - 1 do
    table.insert(turnOnAnimationFrames, i)
end

data.Checkpoint =  {
    width = 8,
    height = 8,
    flagTile = 211,
    turnedOffSprite = StaticSprite:new(0, 1),
    turnedOnSprite = StaticSprite:new(248, 1),
    justUsedSprite = StaticSprite:new(249, 1),
    turnOnAnimation = Sprite:new(anim.gen(turnOnAnimationFrames, 3), 1),
}

data.solidTiles = {
    1, 2, 3,
    208, 209, 210,
    224, 225, 226,
    240, 241, 242,
}

-- table.concatTable(data.solidTiles,) --> (ノ｀Дa почему??)ノ - да потому!
-- for i, t in ipairs(data.solidTiles) do
--     trace(t..' ')
-- end

data.bfs = {'😎'}

data.bfs.solidTiles = {
    207, -- special tile for door to make it fit SOLID principles
}

data.Lever = {
    hitboxShiftX = 2,
    hitboxShiftY =2,
    hitboxWidth = 2,
    hitboxHeight = 4,
}
data.Lever.sprites = {
    on = StaticSprite:new(3,1),
    off = StaticSprite:new(2,1),
}

data.SettingLever ={}
data.SettingLever.sprites = {
    on = StaticSprite:new(6, 1),
    off = StaticSprite:new(5, 1),
}

data.EnemyDeathSounds = {  -- i cancel it :-<
    WeakRose = {1, 'A-5', -1, 3, 0, 3},
    Rose = {1, 'B-5', -1, 3, 0, 3},
    BulletHell = {1, 'D-5', -1, 3, 0, 0},
    Snowman = {1, 'E-5', -1, 1, 0, 0},
}
data.EnemyDamageSounds = {
    WeakRose = {62, 'A-4', 8, 3, 8, 0},
    Rose = {62, 'B-4', -1, 3, 8, 0},
    BulletHell = { 62, 'D-4', -1, 3, 8, 0  },
    Snowman = { 62, 'E-4', -1, 3, 8, 0  },
}

RoseHP = {weak=15, strong=200}
BulletHellHP = {small=25, medium=50, big=100}

-- EnemyConfig look in SuperConfig

data.BulletHell = {
    -- circleDiameter = {5, 8, 16},
    -- bulletSpeadRadius = {5, 8, 11},
    -- bulletRotationSpeed = {1,1,1},
    -- bulletCount = {8, 12, 16},
    -- bulletSpeed = {0.8, 0.7, 0.8},
    -- deathBulletSpeed = {0.3, 0.2, 0.1},
    -- hp = {12, 25, 40},
    deathTimeMs = 1000,
}

-- data.BulletHell.spawnTiles = {48, 49, 50}
data.BulletHell.sprites = {
    defaultSprite = 999,
}

data.AutoBulletHell = {
    -- spawnTiles = {32,33,34},

    -- circleDiameter = {5, 8, 16},
    -- bulletSpeadRadius = {5, 8, 11},
    -- bulletRotationSpeed = {1,1,1},
    -- bulletCount = {8, 12, 16},
    -- bulletSpeed = {0.8, 0.7, 0.8},
    -- deathBulletSpeed = {0.3, 0.2, 0.1},
    -- hp = {12, 25, 40},
    deathTimeMs = 1000,
}

data.Bullet = {
    defaultSpeed = 0.5,
    defaultSprite = StaticSprite:new(373, 1),
    reloadAnimation = Sprite:new(anim.gen({373, 0, 374, 375, 376}, 4), 1),
}

data.Enemy = {
    defaultHP = 5,
    defaultEnemyFlagTile = 98,
}
data.Enemy.sprites = {
    defaultSprite = StaticSprite:new(403, 1),
    --ahegaoDeath = Sprite:new({386, 387, 388, 389, 390}, 1)
}
data.Enemy.sprites.hurtEffect = {
    hurtingHorizontal = Sprite:new(anim.gen({473, 474, 475, 476, 477, 478, 479}, 3), 1),
    hurtingVertical = Sprite:new(anim.gen({473 + 16, 474 + 16, 475 + 16, 476 + 16, 477 + 16, 478 + 16, 479 + 16}, 3), 1),
    hurtingNull0 = StaticSprite:new(0, 1),
    hurtingNull1 = StaticSprite:new(0, 1),
    hurtingNull2 = StaticSprite:new(0, 1),
    hurtingNull3 = StaticSprite:new(0, 1),
}

data.Rose = {
    startingHealth = 50,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
}

data.LongRose = {}
data.LongRose.spawnTiles = {166, 167, 168, 169}

data.MusicRose = {}
data.MusicRose.spawnTiles = {
    D2 = {182, 183, 184, 185},
    Fd2 = {170, 171, 172, 173},
    Gd2 = {186, 187, 188, 190},
}

data.Rose.spawnTiles = {150, 151, 152, 153}
data.Rose.anotherRoseFlagTile = 15
data.Rose.sprites = {
    transition = Sprite:new({389, 391, 393, 395, 397, 421}, 2),
    death = Sprite:new(anim.gen60({423, 425, 427, 429}), 2),
    idle = StaticSprite:new(389, 2),
    shooting = StaticSprite:new(391, 2),
}
data.Rose.animation_frame_duration_ms = 16
data.Rose.rose_animation_duration_ms = data.Rose.animation_frame_duration_ms * #data.Rose.sprites.transition.animation

data.WeakRose = {}
data.WeakRose.sprites = {
    death = Sprite:new(anim.gen60({277, 279, 281, 283}), 2),
    idle = StaticSprite:new(393, 2),
    shooting = StaticSprite:new(395, 2),
}

data.Snowman = {}

data.Snowman.whirl = {
    fadeTimeMs = 150, -- Время до исчезания частички вихря
    sprite = StaticSprite:new(350, 1),
    rotationSpeed = 0.012, -- Скорость вращения палки. Так мало, потому что миллисекунды 😏
    particleEmitDelayMs = 4, -- Задержка между спавном частиц вихря
    taraxacum = {
        radius = 7, -- Радиус одуванчика на палке при вращении

        deathBulletCount = 12, -- Количество пуль после смерти одуванчика
        deathSlowBulletCount = 6,
        deathFastBulletCount = 6,
    },
    endTaraxacumSpeed = 1.5, -- Скорость одуванчика, который запускается после конца атаки.
}

-- Выделил 😎
    data.Snowman.specialTaraxacum = {
        radius = 3,
        bodyLength = 15,
        shiftForCenterX = 12,
        shiftForCenterY = -3,
        startStickX = 0,
        startStickY = 0,
        bodyColor = 10,
        color = 12,
        reloadAnimationTime = 18, -- in tics should divide by 3
    }

data.SnowmanBox = {}
data.SnowmanBox.playerCheckFrequencyMs = 1000
data.SnowmanBox.wakeUpDistanceToPlayer = 48
data.SnowmanBox.sleepSprite = StaticSprite:new(485, 2)
data.SnowmanBox.wokeupSprite = StaticSprite:new(487, 2)


data.Cutscene = {
    smoke_dx = -0.012,
    smoke_dy = -0.018,
    -- smoke_frequency_ms = 3,
    smoke_minlifetime = 300,
    smoke_maxlifetime = 5000,
    smoke_frequency = 3, -- More - less particles
}   

-- return data

-- SuperConfig.lua

-- Я добавил фабричный метод, чтобы ты мог делать конфиги, пока делаешь конфиги

RoseHP = {weak=20, strong=120}
BulletHellHP = {small=32, medium=64, big=128}

silence = {
    beatMap = {0, 0, 0, 0},
    sfxMap = {{0, 'E-3', -1, 0, 10, 0}}
}

strongrose = {
    name = 'MusicRose',
    startingHealth = RoseHP.strong,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
    direction = 0,
    isWeak = false,
}

verystrongrose = {
    name = 'MusicRose',
    startingHealth = RoseHP.strong*3,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
    direction = 0,
    isWeak = false,
}
weakrose = {
    name = 'MusicWeakRose',
    startingHealth = RoseHP.weak,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
    direction = 0,
    isWeak = true,
}

common = {
    small = {
        name = 'MusicBulletHell',
        circleDiameter = 5,
        bulletSpreadRadius = 5,
        bulletRotationSpeed = 0.002,
        bulletCount = 8,
        bulletSpeed = 0.98,
        deathBulletSpeed = 0.18,
        color = 14,
        hp = BulletHellHP.small,
    },
    medium = {
        name = 'MusicBulletHell',
        circleDiameter = 8,
        bulletSpreadRadius = 8,
        bulletRotationSpeed = 0.0009,
        bulletCount = 12,
        bulletSpeed = 1.13,
        deathBulletSpeed = 0.1,
        color = 14,
        hp = BulletHellHP.medium,
    },
    big = {
        name = 'MusicBulletHell',
        circleDiameter = 16,
        bulletSpreadRadius = 11,
        bulletRotationSpeed = 1,
        bulletCount = 16,
        bulletSpeed = 1.3,
        deathBulletSpeed = 0.1,
        color = 14,
        hp = BulletHellHP.big,
    },
}

autobullethellprefab = {
    small = {
        name = 'MusicAutoBulletHell',
        circleDiameter = 5,
        bulletSpreadRadius = 5,
        bulletRotationSpeed = 0.002,
        bulletCount = 8,
        bulletSpeed = 2,
        deathBulletSpeed = 0.1,
        color = 13,
        hp = BulletHellHP.small,
    },
    medium = {
        name = 'MusicAutoBulletHell',
        circleDiameter = 8,
        bulletSpreadRadius = 8,
        bulletRotationSpeed = 0.0009,
        bulletCount = 12,
        bulletSpeed = 2.3,
        deathBulletSpeed = 0.03,
        color = 13,
        hp = BulletHellHP.medium,
    },
    big = {
        name = 'MusicAutoBulletHell',
        circleDiameter = 16,
        bulletSpreadRadius = 11,
        bulletRotationSpeed = 1,
        bulletCount = 16,
        bulletSpeed = 2.5,
        deathBulletSpeed = 0.03,
        color = 13,
        hp = BulletHellHP.big,
    },
}

-- prefab contains common parameters, like name, hp, graphics, etc.
function data.add_enemy(id, prefab, music)
    if not (prefab.name == "MusicRose" or prefab.name == "MusicWeakRose") then
        data.EnemyConfig[id] = table.copy(prefab)
        data.EnemyConfig[id].music = music
        return
    end
    for i = 0, 3 do
        local rose = table.copy(prefab)
        rose.music = music
        rose.direction = i
        data.EnemyConfig[id + i] = rose
    end
end

function data.add_all_bullethell_sizes(id, music)
    data.EnemyConfig[id] = table.copy(common.small)
    data.EnemyConfig[id+1] = table.copy(common.medium)
    data.EnemyConfig[id+2] = table.copy(common.big)
    data.EnemyConfig[id].music = music
    data.EnemyConfig[id+1].music = music
    data.EnemyConfig[id+2].music = music
end


function data.add_all_autobullethell_sizes(id, music)
    data.EnemyConfig[id] = table.copy(autobullethellprefab.small)
    data.EnemyConfig[id+1] = table.copy(autobullethellprefab.medium)
    data.EnemyConfig[id+2] = table.copy(autobullethellprefab.big)
    data.EnemyConfig[id].music = music
    data.EnemyConfig[id+1].music = music
    data.EnemyConfig[id+2].music = music
end


--IEnemyable
data.EnemyConfig = {
    -- dict: [tileId : EnemyConfigLol]
    [65] = {
        name = 'Snowman',
        color = 12,
        speed = 15, -- data.Player.speed - 0.41,
        speedWithWhirl = 0.8, --data.Player.speed - 0.61,
        hp = 150,
        prepareJumpTime = 20,
        sleepDistanceToPlayer = 320,
        --jumpTime = 20,
        resetJumpTime = 24,

        deathParticleCountMin = 100,
        deathParticleCountMax = 300,
        deathAnimationParticleSpeed = 1,
        deathAnimationParticleSpeedNormalizer = 0.4,
        deathParticleMinSpeed = 1,
        deathParticleSprite = StaticSprite:new(378, 1),

        specialTaraxacum = {
            radius = 3,
            bodyLength = 15,
            shiftForCenterX = 12,
            shiftForCenterY = -3,
            startStickX = 0,
            startStickY = 0,
            bodyColor = 10,
            color = 12,
            reloadAnimationTime = 18, -- in tics should divide by 3
        },

        music = {
            altBeatMap = {0, 0, 0, 0, 0, 0, 0, 0,},
            sfxMap = {
                -- {4, 'A-2', 16, 0, 4, -1},
                -- {4, 'C-3', 16, 0, 4, -1},
                -- {42, 'A-5', -1, 2, 1, 0},
                -- {42, 'A-5', -1, 2, 10, 0},
                {42, 'A-5', -1, 2, 10, 0},
                {42, 'G-5', -1, 2, 10, 0},
                {42, 'A-5', -1, 2, 10, 0},
                {42, 'G-5', -1, 2, 10, 0},
            },
            beatMap = {0,0,0,0, 1, 1, 1, 1},
        },

        sprites = {
            chill = StaticSprite:new(312, 2),
            prepareJump = Sprite:new({312, 344}, 2),
            flyJump = Sprite:new(anim.gen60({346,348,346}), 2),
            resetJump = Sprite:new({348,344,312}, 2),
            death = Sprite:new(anim.gen60({312,314,312,314,312}), 2)
        },
    },

    -- [66] = {
    --     name = 'Snowman',
    --     color = 12,
    --     speed = 15, -- data.Player.speed - 0.41,
    --     speedWithWhirl = 0.8, --data.Player.speed - 0.61,
    --     hp = 150,
    --     prepareJumpTime = 20,
    --     --jumpTime = 20,
    --     resetJumpTime = 24,

    --     deathParticleCountMin = 100,
    --     deathParticleCountMax = 300,
    --     deathAnimationParticleSpeed = 1,
    --     deathAnimationParticleSpeedNormalizer = 0.4,
    --     deathParticleMinSpeed = 1,
    --     deathParticleSprite = StaticSprite:new(378, 1),

    --     specialTaraxacum = {
    --         radius = 3,
    --         bodyLength = 15,
    --         shiftForCenterX = 12,
    --         shiftForCenterY = -3,
    --         startStickX = 0,
    --         startStickY = 0,
    --         bodyColor = 10,
    --         color = 12,
    --         reloadAnimationTime = 18, -- in tics should divide by 3
    --     },

    --     music = {
    --         beatMap = {0, 0, 0, 0, 0, 0, 0, 0,},
    --         sfxMap = {
    --             -- {4, 'A-2', 16, 0, 4, -1},
    --             -- {4, 'C-3', 16, 0, 4, -1},
    --             {1, 'A-4', -1, 2, 15, 0},
    --             {1, 'G-4', -1, 2, 15, 0},
    --             {1, 'A-4', -1, 2, 15, 0},
    --             {1, 'G-4', -1, 2, 15, 0},
    --         },
    --         altBeatMap = {0,0,0,0, 1, 1, 1, 1}
    --     },

    --     sprites = {
    --         chill = StaticSprite:new(312, 2),
    --         prepareJump = Sprite:new({312, 344}, 2),
    --         flyJump = Sprite:new(anim.gen60({346,348,346}), 2),
    --         resetJump = Sprite:new({348,344,312}, 2),
    --         death = Sprite:new(anim.gen60({312,314,312,314,312}), 2)
    --     },
    -- },
    [97] = {
        name = 'StaticTaraxacum',
        speed = 2,
        color = 12,

        radius = 2,
        staticRadius = 3,
        bodyLength = 10,
        staticTaraxacumSpawnTile = { 97 },

        deathBulletCount = 6,
        deathBulletSlowCount = 3,
        deathBulletFastCount = 3,

        deathBulletSpeed = 0.37,
        deathSlowBulletSpeed = 0.2,
        deathFastBulletSpeed = 0.5,

        deathBulletSpread = 2,

        deathBulletSprite = StaticSprite:new(378, 1),
    }, -- mb static idk
}

data.add_all_autobullethell_sizes(
    80,
    {
        beatMap = {1,0,0,0,0,0,0,0},
        sfxMap = {
            {16, 'B-2', 50, 0, 15, 0},
            {16, 'A-2', 50, 0, 10, 0},
            {16, 'F#2', 50, 0, 10, 0},
            {16, 'G#2', 50, 0, 10, 0},
            {16, 'A-2', 50, 0, 10, 0},
            {16, 'B-2', 50, 0, 15, 0},
            {16, 'A-2', 50, 0, 10, 0},
            {16, 'F#2', 50, 0, 10, 0},
        },
        intro = silence,
    }
)
-- drum theme --------------------------------------

data.add_all_bullethell_sizes(
    112,
    {
        beatMap = {
            0,0,1,0,
            0,1,0,0,
            1,0,0,1,
            0,0,1,1,
        },
        sfxMap = {
            {20, 'A-8', -1, 1, 9, 0},
            {20, 'A-8', -1, 1, 9, 0},
            {20, 'A-8', -1, 1, 9, 0},
            {20, 'E-8', -1, 1, 9, 0},
            {20, 'A-8', -1, 1, 9, 0},
        },
        -- intro = silence,
    }
)

data.add_all_bullethell_sizes(
    131,
    {
        beatMap = {
            1,0,1,0,
            1,0,1,0,
            1,0,1,0,
            1,0,1,0,
        },
        sfxMap = {
            {17, 'B-8', -1, 2, 6, 0},{17, 'B-8', -1, 2, 8, 0},{17, 'B-8', -1, 2, 10, 0},{17, 'B-8', -1, 2, 12, 0},
            {19, 'B-8', -1, 2, 14, 0},{17, 'B-8', -1, 2, 12, 0},{17, 'B-8', -1, 2, 10, 0},{17, 'B-8', -1, 2, 8, 0},
        },
    }
)

data.add_all_bullethell_sizes(
    128,
    {
        beatMap = {
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,
        },
        sfxMap = {
            {17, 'B-8', -1, 2, 5, 0},
        },
    }
)
-----------------------------------------------------

-- main theme ------------------------------------------------------------------------------------------------------------------------------------------------------------------
data.add_enemy(
    182,
    strongrose,
    {
        beatMap = {1,0,0,0,0,0,0,0},
        sfxMap = {
            {31, 'D-3', -1, 0, 10, 0},
            {31, 'C#3', -1, 0, 10, 0},
            {31, 'D-3', -1, 0, 10, 0},
            {31, 'C#3', -1, 0, 10, 0},
            {31, 'A-2', -1, 0, 10, 0},
            {31, 'B-2', -1, 0, 10, 0},
            {31, 'A-2', -1, 0, 10, 0},
            {31, 'B-2', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)
data.add_enemy(
    186,
    strongrose,
    {
        beatMap = {0,0,0,0,1,0,0,0},
        sfxMap = {{31, 'G#3', -1, 0, 12, 0}},
        -- intro = silence
    }   
)
data.add_enemy(
    170,
    strongrose,
    {
        beatMap = {0,0,1,0,0,0,1,0},
        sfxMap = {
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)

data.add_enemy(
    134,
    weakrose,
    {
        beatMap = {1,0,0,0,0,0,0,0},
        sfxMap = {
            {0, 'D-3', -1, 0, 10, 0},
            {0, 'C#3', -1, 0, 10, 0},
            {0, 'D-3', -1, 0, 10, 0},
            {0, 'C#3', -1, 0, 10, 0},
            {0, 'A-2', -1, 0, 10, 0},
            {0, 'B-2', -1, 0, 10, 0},
            {0, 'A-2', -1, 0, 10, 0},
            {0, 'B-2', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)
data.add_enemy(
    166,
    weakrose,
    {
        beatMap = {0,0,0,0,1,0,0,0},
        sfxMap = {{0, 'G#3', -1, 0, 12, 0}},
        -- intro = silence
    }   
)
data.add_enemy(
    150,
    weakrose,
    {
        beatMap = {0,0,1,0,0,0,1,0},
        sfxMap = {
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)


data.add_all_bullethell_sizes(
    16,
    {
        beatMap = {0,0, 0,0, 1,0, 0,0},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
        },
    }
)

data.add_all_bullethell_sizes(
    32,
    {
        beatMap = {0,0, 0,0, 1,0, 0,0},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
        },
        altBeatMap = {0,0, 0,1, 1,0, 0,0},
    }
)
data.add_all_bullethell_sizes(
    48,
    {
        beatMap = {0,0,0,0, 0,0,0,0, 0,1,0,0, 0,1,0,1,},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},
        },
        altBeatMap = {1,1,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0,}
    }
)

------------------------------------------------------------------------------------------------------------------------------------------------------------------


-- second theme --------------------------------------------------------------------------------------------------------------------------------------------------
data.add_enemy(
    12,
    strongrose,
    {
        beatMap = {1,0, 0,0, 1,0, 0,0},
        sfxMap = {
            {2, 'D-3', -1, 1, 11, 0},
            {2, 'D-4', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},

            {2, 'D-4', -1, 1, 11, 0},
            {2, 'D-4', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},
        },
        intro = {
            beatMap = {0,0, 0,0, 1,0, 1,0},
            sfxMap = {
                {2, 'A-3', -1, 1, 15, 0},
                {2, 'F#3', -1, 1, 15, 0},
            },  
        },
    }
)
data.add_enemy(
    28,
    weakrose,
    {
        beatMap = {0,0, 1,0, 0,1, 0,0},
        sfxMap = {
            {1, 'C#5', -1, 2, 15, 0},
            {1, 'C#5', -1, 2, 15, 0},
            {1, 'B-4', -1, 2, 15, 0},
            {1, 'B-4', -1, 2, 15, 0},
        },
        intro = silence,
    }
)
data.add_enemy(
    44,
    weakrose,
    {
        beatMap = {0,0, 1,0, 0,1, 0,0},
        sfxMap = {
            {1, 'A-4', -1, 1, 15, 0},
            {1, 'A-4', -1, 1, 15, 0},
            {1, 'F#4', -1, 1, 15, 0},
            {1, 'F#4', -1, 1, 15, 0},
        },
        intro = silence,
    }
)

data.add_all_bullethell_sizes(38,
    {
        beatMap = {0,0, 0,0, 0,0, 0,0,},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
        },
        intro = silence,
        altBeatMap = {1,0,1,0, 1,0,1,0,}
    }
)
data.add_all_bullethell_sizes(41,
    {
        beatMap = {0,0, 1,0, 0,1, 0,0},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {19, 'C#7', -1, 0, 4, 0},
            {19, 'C#7', -1, 0, 4, 0},
            {19, 'B-6', -1, 0, 4, 0},
            {19, 'B-6', -1, 0, 4, 0},
        },
        intro = silence,
        -- altBeatMap = {1,1,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0,}
    }
)
------------------------------------------------------------------------------------------------------------------------------------------------------------------

data.add_enemy(19, verystrongrose,
    {
        beatMap = {1,1,1,1, 1,1,1,0},
        sfxMap = {
            {8, 'A-2', 90, 1, 6, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},

            {8, 'C-3', 60, 1, 10, 0},
            {1, 'C-3', 16, 3, 0, 0},
            {1, 'C-3', 16, 3, 0, 0},
            {1, 'C-3', 16, 3, 0, 0},
        },
        intro = silence,
        altBeatMap = {1,1,1,1, 0,0,0,0},
    })


-- Palette.lua
-- sync(0, 1, false)

ADDR = 0x3FC0

palette = {
    defaultColors={},
    whiteColor = {r=255, g=255, b=255},
    bgColor = {r=63, g=31, b=60},
    isOneBit = false
}


astropalette = {
    white = {218, 242, 233},
    light_blue = {149, 224, 204},
    blue = {57, 112, 122},
    dark_blue = {35, 73, 93},
    bg = {28, 38, 56},
    red = {241, 78, 82},
    dark_red = {155, 34, 43},
    black = {0, 0, 0},
}

function palette.toggle1Bit()
    -- небольшая подмена
    palette.toggleAstroPalette()

    --[[
    for id = 1, 15 do
        local color
        if not palette.isOneBit then
            if id == 6 then
                color = palette.bgColor
            else
                color = palette.whiteColor
            end
        else
            color = palette.defaultColors[id]
        end

        palette.colorChange(id, color.r, color.g, color.b)
    end

    palette.isOneBit = not palette.isOneBit
    --]]
end


function palette.toggleAstroPalette()
    palette.isOneBit = not palette.isOneBit

    if not palette.isOneBit then
        for id = 1, 15 do
            local color = palette.defaultColors[id]
            palette.colorChange(id, color.r, color.g, color.b)
        end
        return
    end

    palette.colorChange(0, astropalette.bg[1], astropalette.bg[2], astropalette.bg[3])
    palette.colorChange(1, astropalette.red[1], astropalette.red[2], astropalette.red[3])
    palette.colorChange(2, astropalette.blue[1], astropalette.blue[2], astropalette.blue[3])
    palette.colorChange(3, astropalette.light_blue[1], astropalette.light_blue[2], astropalette.light_blue[3])
    palette.colorChange(4, astropalette.blue[1], astropalette.blue[2], astropalette.blue[3])
    palette.colorChange(5, astropalette.blue[1], astropalette.blue[2], astropalette.blue[3])
    palette.colorChange(6, astropalette.black[1], astropalette.black[2], astropalette.black[3])
    palette.colorChange(7, astropalette.dark_red[1], astropalette.dark_red[2], astropalette.dark_red[3])
    palette.colorChange(8, astropalette.light_blue[1], astropalette.light_blue[2], astropalette.light_blue[3])
    palette.colorChange(9, astropalette.blue[1], astropalette.blue[2], astropalette.blue[3])
    palette.colorChange(10, astropalette.dark_blue[1], astropalette.dark_blue[2], astropalette.dark_blue[3])
    palette.colorChange(11, astropalette.white[1], astropalette.white[2], astropalette.white[3])
    palette.colorChange(12, astropalette.white[1], astropalette.white[2], astropalette.white[3])
    palette.colorChange(13, astropalette.white[1], astropalette.white[2], astropalette.white[3])
    palette.colorChange(14, astropalette.red[1], astropalette.red[2], astropalette.red[3])
    palette.colorChange(15, astropalette.light_blue[1], astropalette.light_blue[2], astropalette.light_blue[3])
end


function palette.getColor(id)
    color = {}
    color.r = peek(ADDR+(id*3))
    color.g = peek(ADDR+(id*3)+1)
    color.b = peek(ADDR+(id*3)+2)
    return color
end

function palette.colorChange(id, red, green, blue)
    -- id -- color index in tic80 palette
    -- red, green, blue -- new color parameters
    poke(ADDR+(id*3), red)
    poke(ADDR+(id*3)+1, green)
    poke(ADDR+(id*3)+2, blue)
end

function palette.ghostColor(GC)
    -- я понятия не имею как это работает
    -- я тоже 😎😎
    -- Всем привет, ребята 🤠
    -- здесь GC = 11
    local id = GC  -- id цвета
    poke(ADDR+(id*3)+2, peek(ADDR))  -- red
    poke(ADDR+(id*3)+1, peek(ADDR+1))  -- green
    poke(ADDR+(id*3), peek(ADDR+2))  -- blue
end

for i = 1, 15 do
    local color = palette.getColor(i)
    table.insert(palette.defaultColors, color)
end

-- return palette

-- Rect.lua
Rect = {}

-- (x y): left top coordinates
function Rect:new(x, y, w, h)
    local obj = {
        x = x,
        y = y,
        w = w,
        h = h,
        halfWidth = w / 2,
        halfHeight = h / 2,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Rect:left()
    return self.x
end

function Rect:right()
    return self.x + self.w
end

function Rect:up()
    return self.y
end

function Rect:down()
    return self.y + self.h
end

function Rect:centerX()
    return self.x + self.halfWidth
end

function Rect:centerY()
    return self.y + self.halfHeight
end

function Rect:isObjectRight(object, objectWidth)
    return self:right() < object.x + objectWidth
end

function Rect:isObjectLeft(object)
    return self.x > object.x
end

function Rect:isObjectAbove(object)
    return self.y > object.y
end

function Rect:isObjectBelow(object, objectHeight)
    return self:down() < object.y + objectHeight
end

function Rect:isObjectInside(object, objectWidth, objectHeight)
    return not self:isObjectAbove(object) and
           not self:isObjectBelow(object, objectHeight) and
           not self:isObjectLeft(object) and
           not self:isObjectRight(object, objectWidth)
end

function Rect:move(dx, dy)
    self.x = self.x + dx
    self.y = self.y + dy
end

function Rect:moveLeftTo(x)
    self.x = x
end

function Rect:moveRightTo(x)
    self.x = x - self.w
end

function Rect:moveUpTo(y)
    self.y = y
end

function Rect:moveDownTo(y)
    self.y = y - self.h
end

function Rect:moveCenterTo(x, y)
    self.x = x - self.halfWidth
    self.y = y - self.halfHeight
end

function Rect:drawDebug()
    rect(
        self.x - gm.x * 8 + gm.sx,
        self.y - gm.y * 8 + gm.sy,
        self.w,
        self.h,
        1
    )
end

-- return Rect
-- Queue.lua
Queue = {}

function Queue:new()
    local obj = {
        head = 1,
        tail = 1,
        items = {},
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Queue:count() --additional +1
    return self.head - self.tail + 1 - 1
end

function Queue:enqueue(item)
    table.insert(self.items, self.head, item)
    self.head = self.head + 1
end

function Queue:dequeue()
    if self:count() == 0 then
        error('Queue has no elements!')
    end

    item = self.items[self.tail]
    self.tail = self.tail + 1
    return item
end

-- Stack.lua
Stack = {}

function Stack:new()
    local obj = {
        items = {},
        head = 1,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Stack:count()
    return self.head - 1
end

function Stack:push(item)
    table.insert(self.items, self.head, item)
    self.head = self.head + 1
end

function Stack:pop()
    item = table.remove(self.items, self.head - 1)
    self.head = self.head - 1

    return item
end

-- Particle.lua
Particle = table.copy(Body)

function Particle:new(x, y, sprite)
    local object = {
        x = x,
        y = y,
        velocity = {x = 0, y = 0},
        sprite = sprite:copy()
    }

    table.insert(game.updatables, object)
    table.insert(game.drawables, object)

    setmetatable(object, self)
    self.__index = self
    return object
end

function Particle:setVelocity(x, y)
    self.velocity = {x=x, y=y}
end

function Particle:_move()
    self.x = self.x + self.velocity.x
    self.y = self.y + self.velocity.y
end

function Particle:update()
    self:_move()
end

function Particle:draw()
    self.sprite:draw(self.x - 1 - gm.x*8 + gm.sx, self.y - 1 - gm.y*8 + gm.sy, self.flip, self.rotate)
end

-- Whirl.lua
Whirl = table.copy(Body)

function Whirl:new(x, y, fadeTimeMs)
    local spr = data.Snowman.whirl.sprite:copy()
    local object = {
        x = x,
        y = y,
        trail = {},
        sprite = spr,
        hitbox = Hitbox:new_with_shift(x, y, x+8, y+4, 0, 2),
        fadeTimeMs = fadeTimeMs,
    }

    local time = 0
    object.timer = function()
        time = time + Time.dt()
        if time > object.fadeTimeMs then
            return true
        end
    end

    setmetatable(object, self)
    self.__index = self
    return object
end

function Whirl:_destroy()
    table.insert(game.deleteSchedule, self)
end

function Whirl:_kill()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
        self:_destroy()
    end
end

function Whirl:update()
    self:_kill()
    local isEnded = self.timer()

    if isEnded then
        self:_destroy()
    end
end

function Whirl:draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
end

-- return Whirl

-- AnimationOver.lua
--Эпикграф

    -- " --А я не дурак 😉"

AnimationOver = {}

function AnimationOver:new(sprite, focusStatus, preInitStatus)
    local startStatus = 'waiting'
    if preInitStatus ~= nil then
        startStatus = preInitStatus
    end

    local obj2 = {
        x = 0,
        y = 0,
        sprite = sprite:copy(),
        flip = 0, -- for sprite drawing
        rotate = 0, -- for sprite drawing
        status = startStatus,
        focusStatus = focusStatus,
        is_focused = false,
    }

    -- чистая магия!
    setmetatable(obj2, self)
    self.__index = self;
    return obj2
end

function AnimationOver.clearUsuless(currentAnimations) -- если много анимаций накопилось, можно их очистить, круто
    local newCurrentAnimations = {}    
    for _, anime in ipairs(currentAnimations) do
        if anime.status ~= 'garbage' then
            table.insert(newCurrentAnimations, anime)
        end
    end

    return newCurrentAnimations
end

function AnimationOver:changeStats(newStats)
    --meh {x = newX, y = NewY, sprite = ...}
end

function AnimationOver:activate()
    self.status = 'active'
end

function AnimationOver:deActivate()
    self.status = 'waiting'
end

function AnimationOver:activateSingleTime()
    self.status = 'activeOnes'
end

function AnimationOver:activateSingleTimeWithDelitionFlag() -- можете звать это костылём...
    self.status = 'activeOnesDelete'
end

function AnimationOver:focus(x1, y1, x2, y2) -- focusing on target area
    if self.is_focused then
        return
    end
    if self.focusStatus == 'static' then
        self.x = x1
        self.y = y1
        self.is_focused = true
    elseif self.focusStatus == 'randomOn' then
        self.x = x1 + math.random(math.ceil(x2 - x1))
        self.y = y1 + math.random(math.ceil(y2 - y1))
        self.is_focused = true
    end
    
end

function AnimationOver:_draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate) -- drawing~
end

function AnimationOver:_spriteUpdate()
    --trace('updating sprite')
    self.sprite:nextFrame() -- nexting~
end

function AnimationOver:play() -- playing the animation
    if self.status == 'active' then
        self:_draw()
        self:_spriteUpdate()

    elseif self.status == 'activeOnes' then
        self:_draw()
        self:_spriteUpdate()
        if self.sprite:animationEnd() then
            self.status = 'waiting'
        end
    elseif self.status == 'activeOnesDelete' then
        self:_draw()
        self:_spriteUpdate()
        if self.sprite:animationEnd() then
            self.status = 'garbage'
        end
    end
end
-- Fruit.lua
fruitsCollection = {
    collected = 0,
    needed = 0,
}

FruitPopup = {
    timeOnScreen = 0,
    timeToStay = 0,
}

function FruitPopup:show(stayTimeMilliseconds)
    self.timeOnScreen = 0
    self.timeToStay = stayTimeMilliseconds
end

local goToBikeSprite = StaticSprite:new(308, 4)

function FruitPopup:draw()
    if fruitsCollection.collected == fruitsCollection.needed then
        rect(0, MAP_HEIGHT-30, 54, 40, 8)
        print('GoTo\nBike', 4, MAP_HEIGHT-26, 0, true, 2)
        return
    end

    if self.timeOnScreen < self.timeToStay then
        local digitCount = math.ceil(math.log(fruitsCollection.collected + 1, 10)) +
                           math.ceil(math.log(fruitsCollection.needed, 10))
        width = 16 + 12 * digitCount
        rect(0, MAP_HEIGHT-16, width, 20, 8)

        print(
            fruitsCollection.collected .. '/' .. fruitsCollection.needed,
            3,
            MAP_HEIGHT-12,
            0,
            true,
            2
        )
        self.timeOnScreen = self.timeOnScreen + Time.dt()
    end
end

local Fruit = table.copy(Body)

function Fruit:new(id, x, y)
    local sprite1 = Sprite:new({id}, 1)
    local sprite2 = Sprite:new({id+1}, 1)

    local obj = {
        x = x,
        y = y,
        id = id,
        collected = false,
        sprite = sprite1,
        sprite1 = sprite1,
        sprite2 = sprite2,
        hitbox = Hitbox:new(x, y, x+8, y+8),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end


function Fruit:update()
    if game.metronome.beat4 then
        if self.sprite == self.sprite1 then
            self.sprite = self.sprite2
        else
            self.sprite = self.sprite1
        end
    end

    if self.collected then
        table.insert(game.deleteSchedule, self) -- Чтобы не респавнился после смерти игрока 👍
    end

    if not self.collected and self.hitbox:collide(game.player.hitbox) then
        fruitsCollection.collected = fruitsCollection.collected + 1

        -- 🔊🤯
        local sound = data.fruitSFX[self.id]
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])

        table.removeElement(game.fruits, self) -- Чтобы не респавнился после смерти игрока 👍
        table.insert(game.deleteSchedule, self)

        self.collected = true

        FruitPopup:show(1000) -- 2 Секунды, ни больше ни меньше 😎
    end
end

function isFruit(tileID)
    local fruitIDs = {144, 145, 160, 161, 176, 177, 192, 193}
    return table.contains(fruitIDs, tileID)
end

function getFruitSprite(tileID)
    return Sprite:new({tileID}, 1)
end

function createFruits()
    local fruits = {}
    for x = 0, MAP_WIDTH do
        for y = 0, MAP_HEIGHT do
            local id = mget(x, y)
            if isFruit(id) then
                local fruit = Fruit:new(id, 8*x, 8*y)
                table.insert(fruits, fruit)
                mset(x, y, 0)
            end
        end
    end
    return fruits
end


-- MapAreas.lua
MapAreas = {}

AreaToEnemies = {}

function MapAreas.generate()
    local areas = {}
    local transitionTiles = {}
    local visitedTiles = {}

    local function ind(x, y)
        return y * MAP_WIDTH + x
    end

    local function isdoor(x, y)
        local id = mget(x, y)
        local doorIds = data.mapConstants.doorIds
        return table.contains(doorIds, id)
    end

    local function iswall(x, y)
        local id = mget(x, y)
        local wallIds = data.Map.WallTileIds
        return table.contains(wallIds, id)
    end

    local function isborder(x, y)
        return iswall(x, y) or isdoor(x, y)
    end

    local function areabfs(x, y)
        local area = {}
        local queue = Queue:new()
        queue:enqueue({x=x, y=y})
        while queue:count() > 0 do
            local tile = queue:dequeue()
            local x, y = tile.x, tile.y

            if visitedTiles[ind(x, y)] or iswall(x, y) then
                goto continue
            elseif isdoor(x, y) then
                table.insert(transitionTiles, {x=x, y=y, area=(#areas + 1)})
                goto continue
            end


            table.insert(area, tile)
            visitedTiles[ind(x, y)] = true

            if x > 0 then
                queue:enqueue({x=x-1, y=y})
            end
            if x < MAP_WIDTH then
                queue:enqueue({x=x+1, y=y})
            end
            if y > 0 then
                queue:enqueue({x=x, y=y-1})
            end
            if y < MAP_HEIGHT then
                queue:enqueue({x=x, y=y+1})
            end

            ::continue::
        end

        return area
    end

    for x = 0, MAP_WIDTH do
        for y = 0, MAP_HEIGHT do
            if visitedTiles[ind(x, y)] or isborder(x, y) then
                goto continue
            end

            local area = areabfs(x, y)
            table.insert(areas, area)
            ::continue::
        end
    end

    return areas, transitionTiles
end

function MapAreas.CookEnemies()
    for i, area in ipairs(game.areas) do
        AreaToEnemies[i] = {}
    end

    for _, enemy in ipairs(game.enemies) do
        local enemyLocation = MapAreas.findAreaWithTile(enemy.x // 8, enemy.y // 8)
        table.insert(AreaToEnemies[enemyLocation], enemy)
    end
end

function MapAreas.findAreaWithTile(tilex, tiley)
    for i, area in ipairs(game.areas) do
        for _, tile in ipairs(area) do
            if tile.x == tilex and tile.y == tiley then
                return i
            end
        end
    end
end

-- GlobalMap.lua
gm = {}

gm.x = 0  -- global map X
gm.y = 0  -- glabal map Y
gm.sx = 0 -- start map X 0w0
gm.sy = 0 -- start map Y >:(

TileType = {
    Void = 0,
    Solid = 1,
    Enemy = 2,
}

function gm.getTileId(x,y)
    return mget(x, y)
end

function gm.getTileType(x, y)
    x = x % (240 * 8)
    y = y % (136 * 8)

    x = x // 8
    y = y // 8

    return gm.getTileType8(x, y)
end

function gm.getTileType8(x, y)  -- x, y даются как координаты тайла на глобальной карте
    local tileId = mget(x, y)

    if table.contains(data.solidTiles, tileId) then --двери не твердые 🙈
        return TileType.Solid
    elseif table.contains(data.bfs.solidTiles, tileId) then -- теперь твёрдые 🙉
        return TileType.Solid
    end
    return TileType.Void
end

function gm.isBlockingBfs(x, y)
    local tileId = mget(x, y)

    if table.contains(data.solidTiles, tileId) then --двери не твердые 🙈 😎😎😎😎
        return true
    elseif table.contains(data.bfs.solidTiles, tileId) then
        return true
    else
        for _, entile in ipairs(game.enemyRespawn) do -- проверяем на столкновение с врагами.（づ￣3￣）づ╭(они тоже твердые)～
            --trace(entile.x..' '..entile.y..' '..x..' '..y..' ')
            if (entile.x == x) and (entile.y == y) then
                return true
            end
        end
    end

    return false
end

function gm.check(x, y)
    -- аргументы -- глобальные координаты пикселя
    -- x = x % (240 * 8)
    -- y = y % (136 * 8)
    local res = {x = 0, y = 0}
    if gm.x * 8 > x then
        res.x = -1
    elseif (gm.x+30) * 8 < x then
        res.x = 1
    end
    if gm.y * 8 > y then
        res.y = -1
    elseif (gm.y+17) * 8 < y then
        res.y = 1
    end
    return res
end

function gm.is_ghost(tile)
    return (229 <= tile and tile <= 255) or
            tile == 144 or tile == 128 or tile == 192 or tile == 108 or tile == 110
end

function gm.in_one_screen(obj1, obj2)
    local x1 = obj1.x
    local y1 = obj1.y
    local x2 = obj2.x
    local y2 = obj2.y
    return math.round(x1 // 240) == math.round(x2 // 240) and
            math.round(y1 // 136) == math.round(y2 // 136)
end

-- return gm


-- Time.lua
Time = {
    t = 0,
    delta = 0,
}

function Time.update()
    local time = time()
    Time.delta = time - Time.t
    Time.t = time
end

function Time.dt()
    return Time.delta
end

function Time.dt_in_60fps()
    -- 60 / 1000 == 0.06
    return Time.dt() * 0.06
end

-- Timer.lua
GameTimers = {
    timers = {}
}

Timer = {}

function GameTimers.addTimer(timer)
    table.insert(GameTimers.timers, timer)
    timer:onEnd(function()
        table.removeElement(GameTimers.timers, timer)
    end)
end

function GameTimers.update()
    for _, timer in ipairs(GameTimers.timers) do
        timer:update()
    end
end

function Timer:new(durationMs)
    local obj = {
        durationMs = durationMs,
        elapsed = 0,
        onElapsed = {},
    }

    setmetatable(obj, self)
    self.__index = self;
    GameTimers.addTimer(obj)
    return obj
end

function Timer:onEnd(onElapsed)
    table.insert(self.onElapsed, onElapsed)
    return self
end

function Timer:update()
    self.elapsed = self.elapsed + Time.dt()

    if self:ended() then
        for _, onElapsed in ipairs(self.onElapsed) do
            onElapsed()
        end
    end
end

function Timer:ended()
    return self.elapsed >= self.durationMs
end

function Timer:reset()
    self.elapsed = 0
end

-- Metronome.lua
Metronome = {}

--
-- msPerBeat explanation :D
--
-- BPM = Beats / Minute
-- Minute = Beats / BPM
--
-- For one beat:
-- Minute = 1 / BPM
--
-- To milliseconds:
-- 60 * 1000 * Minute = (60 * 1000) / BPM
--
-- Milliseconds = (60 * 1000) / BPM
--

function Metronome:new(bpm)
    local obj = {
        time = 0,
        msPerBeat = (60 * 1000) / bpm,
        onBeat = false,
        onBass = true,
        
        onOddBeat = false,
        onEvenBeat = false,
        beatCount = 0,
    }
    obj.smallTick = obj.msPerBeat,

    setmetatable(obj, self)
    self.__index = self; return obj
end

function Metronome:msBeforeNextBeat()
    return self.msPerBeat - (self.time % self.msPerBeat)
end

function Metronome:_onBeat()
    self.onBeat = true
end

function Metronome:_onOddBeat()
    self.onOddBeat = true
end

function Metronome:_onEvenBeat()
    self.onEvenBeat = true
end

function Metronome:update()
    if self.onBeat then
        self.onBeat = false
        self.onEvenBeat = false
        self.onOddBeat = false
    end

    if self.time >= self.msPerBeat then
        self:_onBeat()

        if self.beatCount % 2 == 1 then
            self:_onOddBeat()
        else
            self:_onEvenBeat()
        end

        self.beatCount = self.beatCount + 1
        self.time = 0
    end

    self.time = self.time + Time.dt()
end

-- Metronome4_4.lua

Metronome4_4 = table.copy(Metronome)


function Metronome4_4:new(bpm)
    bpm = bpm * M44  -- теперь на одну четверть приходится M44 ударов вместо 1
    local obj = {
        time = 0,
        msPerBeat = (60 * 1000) / bpm,
        onBeat = false,
        beatCount = 0,

        beat4 = false,
        beat4Count = 0,  -- число от 0 до 3
        beat8 = false,
        beat8Count = 0,
        beat16 = false,
        beat16Count = 0,
        beat32 = false,
        beat32Count = 0,
        beat6 = 0, -- ТРИОЛИ
        beat6Count = 0,
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end


function Metronome4_4:_onBeat()
    self.onBeat = true
    self.beatCount = self.beatCount + 1

    if self.beatCount % M44 == 0 then
        self.beat4 = true
        -- self.beat4Count = (self.beat4Count + 1) % 4
    end
    if self.beatCount % (M44 // 2) == 0 then
        self.beat8 = true
        -- self.beat8Count = (self.beat8Count + 1) % 8
    end
    if self.beatCount % (M44 // 4) == 0 then
        self.beat16 = true
        -- self.beat8Count = (self.beat8Count + 1) % 8
    end
    if self.beatCount % (M44 // 8) == 0 then
        self.beat32 = true
        -- self.beat8Count = (self.beat8Count + 1) % 8
    end
    if self.beatCount % ((M44 * 2) // 3) == 0 then
        self.beat6 = true
        -- self.beat6Count = (self.beat6Count + 1) % 6
    end
end

function Metronome4_4:_beatsOff()
    self.onBeat = false
    self.beat4 = false
    self.beat8 = false
    self.beat16 = false
    self.beat32 = false
    self.beat6 = false
end

function Metronome4_4:update()
    self:_beatsOff()

    if self.time >= self.msPerBeat then
        self:_onBeat()
        self.time = 0
    end

    self.time = self.time + Time.dt()
end


-- Enemy.lua
Enemy = table.copy(Body)

function Enemy:new(x, y)
    local obj = {
        sprite = data.Enemy.sprites.defaultSprite,
        x = x,
        y = y,
        flip = 0,

        hitbox = Hitbox:new(x, y, x + 8, y + 8),

        hp = data.Enemy.defaultHP,
        isEnemy = true,
        currentAnimations = {},

        isActive = false, -- активируется, когда в зону входит игрок
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Enemy:_drawAnimations()
    for _, anime in ipairs(self.currentAnimations) do
        anime:play()
    end
end

function Enemy:_focusAnimations()
    local center_x
    local center_y
    -- What the fuck??? +10000% code speedup когда я убрал создание таблицы,
    -- что за тупая хрень???!
    if self.hitbox.type == 'hitcircle' then
        local x1 = self.hitbox.x
        local x2 = self.hitbox.x + self.hitbox.d
        local y1 = self.hitbox.y
        local y2 = self.hitbox.y + self.hitbox.d
        center_x = x1 + (x2 - x1) / 2
        center_y = y1 + (y2 - y1) / 2
    else
        local x1 = self.hitbox.x1
        local y1 = self.hitbox.y1
        center_x = x1 + (self.hitbox.x2 - x1) / 2
        center_y = y1 + (self.hitbox.y2 - y1) / 2
    end
    local width = self.hitbox:getWidth()
    local height = self.hitbox:getHeight()
    -- чтобы анимация проигрывалась вокруг противника равномерно

    local x1 = center_x - width
    local x2 = center_x
    local y1 = center_y - height
    local y2 = center_y 
    for _, anime in ipairs(self.currentAnimations) do
        anime:focus(x1, y1, x2, y2)
    end
end

function Enemy:draw()
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)

    self:_drawAnimations()
end

function Enemy:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end
    
    if self:isDeadCheck() then
        self:die()
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end
end

function Enemy:die()
    -- Это самый древний trace в нашей кодовой базе! 🦖
    trace("I AM DEAD!!!")
    if self.deathSound ~= nil then
        local sound = self.deathSound
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
    else
        trace('Возможно ошибка: У врага нету звука смерти')
    end
    table.removeElement(game.updatables, self)
    table.removeElement(game.drawables, self)
    table.removeElement(game.collideables, self)
end

function Enemy:isDeadCheck()
    return self.hp == 0
end

function Enemy:takeDamage(damage)
    table.insert(self.currentAnimations,
        AnimationOver:new(table.chooseRandomElement(data.Enemy.sprites.hurtEffect), 'randomOn', 'activeOnes')
    )
    -- это может оказаться неэффективно

    self.hp = math.fence(self.hp - damage, 0, self.hp)

    if self.hp >= 0 and self.damageSound ~= nil then
        -- kawaii-Code@boomerang2.com:
        -- Я сначала копипастил код звука в update каждому врагу отдельно, и вот
        -- какие комментарии я при этом оставлял (в хронологическом порядке):
        --
        -- 1. А может это отправить в takeDamage?
        --
        -- 2. Ну, по-хорошему нужно отправить, чтобы переиспользовать важный код.
        --
        -- 3. Можно даже использовать вместо EnemyDeathSounds EnemyConfig!
        -- Тогда takeDamage будет универсальным для всех! Какая отличная
        -- идея! 😊

        if game.metronome.beat16 then
            -- Этот код у меня компилировался!!! Что? 😫
            -- local sound game.soundsQueue:dequeue()
            local sound = self.damageSound
            sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
        end
    end

end


-- BulletHell.lua
BulletHell = table.copy(Enemy)

function BulletHell:new(x, y, config)
    local bullets = {}
    for i = 1, config.bulletCount do
        bullets[i] = HellBullet:new()
    end

    local radius = math.floor(config.circleDiameter / 2) - 2
    local object = {
        x = x,
        y = y,
        type = type,
        spread = config.bulletSpreadRadius,
        bullets = bullets,
        bulletCount = config.bulletCount,
        bulletSpeed = config.bulletSpeed,
        bulletSprite = bulletSprite,
        damageSound = data.EnemyDamageSounds.BulletHell,
        deathSound = data.EnemyDeathSounds.BulletHell,
        rotationSpeed = config.bulletRotationSpeed,
        deathBulletSpeed = config.deathBulletSpeed,
        hp = config.hp,
        hitbox = HitCircle:new(x+1, y+1, config.circleDiameter),
        radius = radius,
        time = 0,
        status = '',
        color = config.color,

        reloadingTimer = 0,
        reloadingBullets = {},
        currentAnimations = {},

        isActive = false,
    }

    BulletHell._moveBullets(object, 0)

    setmetatable(object, self)
    self.__index = self
    return object
end

function BulletHell:_selectBullet()
    local minDist = 2147483647
    local minId = -1
    for i, bull in ipairs(self.bullets) do
        local dirX = game.player.x - bull.x
        local dirY = game.player.y - bull.y
        local dist = math.sqrt(dirX * dirX + dirY * dirY)
        if dist < minDist then
            minDist = dist
            minId = i
        end
    end

    local byTouchId = (minId + self.bulletCount - self.bulletCount // 4 - 1) % self.bulletCount + 1
    return byTouchId
end

function BulletHell:_shoot()
    local byTouchId = self:_selectBullet()
    while table.contains(self.reloadingBullets, self.bullets[byTouchId]) do
        byTouchId = byTouchId + 1
        if byTouchId > #self.bullets then
            byTouchId = 1
        end
    end
    table.insert(self.reloadingBullets, self.bullets[(byTouchId - 1) % 8 + 1])

    local bull = self:_createShootBullet()
    bull.x = self.bullets[byTouchId].x
    bull.y = self.bullets[byTouchId].y
    bull.hitbox:set_xy(bull.x, bull.y)
    local function randomFactor()
        return 16 * (2 * math.random() - 1)
    end
    bull:vectorUpdateByTarget(game.player.x + randomFactor(), game.player.y + randomFactor())
end

function BulletHell:_createShootBullet()
    local bull = Bullet:new(0, 0, self.bulletSprite)
    bull.speed = self.bulletSpeed

    table.insert(game.drawables, bull)
    table.insert(game.updatables, bull)

    return bull
end

function BulletHell:launchBulletsAround()
    for i = 1, #self.bullets do
        local bullet = self:_createShootBullet()
        bullet.x = self.bullets[i].x
        bullet.y = self.bullets[i].y
        bullet.hitbox:set_xy(bullet.x, bullet.y)

        local directionX = bullet.x - (self.x + self.radius)
        local directionY = bullet.y - (self.y + self.radius)

        local speed = self.deathBulletSpeed

        bullet:setVelocity(speed * directionX, speed * directionY)
    end
end

function BulletHell:update()
    if self.status == 'dying' then
        self.deathTick()
        return
    end

    if self:isDeadCheck() then
        self:launchBulletsAround()
        local time = 0
        self.status = 'dying'
        self.deathTick = function()
            time = time + Time.dt()
            if time > data.BulletHell.deathTimeMs then
                self:die()
            end
        end
        return
    end

    if self.hitbox:collide(game.boomer.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end

    if game.metronome.onBeat then
        self:_shoot()
    end

    for i = 1, #self.bullets do
        self.bullets[i]:update()
    end
end

function BulletHell._moveBullets(bullethell, offset)
    local radius = bullethell.radius
    local step = 2 * math.pi / bullethell.bulletCount
    for i = 1, #bullethell.bullets do
        local pheta = i * step + bullethell.rotationSpeed * offset
        local x = math.round(bullethell.spread * math.cos(pheta))
        local y = math.round(bullethell.spread * math.sin(pheta))
        local bullet = bullethell.bullets[i]
        bullet:setPos(bullethell.x + radius + x, bullethell.y + radius + y) --не настоящие пули
    end
end

function BulletHell:draw()
    if self.status == 'dying' then
        self.hitbox:drawOutline(self.color)
        return
    end

    if #self.reloadingBullets > 0 then
        self:_moveBullets(self.reloadingTimer)
        deletedBullet = nil
        for _, bullet in ipairs(self.reloadingBullets) do
            bullet:nextFrame()
            if bullet.sprite:animationEnd() then
                deletedBullet = bullet
            end
        end

        if deletedBullet then
            deletedBullet:nextFrame()
            table.removeElement(self.reloadingBullets, deletedBullet)
        end

        self.reloadingTimer = self.reloadingTimer + Time.dt()
    else
        self.reloadingTimer = 0
    end

    self.hitbox:draw(self.color)

    for i = 1, #self.bullets do
        self.bullets[i]:draw(self.color)
    end

    --self.hitbox.hb:draw(1)
    self:_drawAnimations()
end

-- HellBullet.lua
HellBullet = table.copy(Body)

function HellBullet:new()
    local object = {
        x = 0,
        y = 0,
        speed = data.Bullet.defaultSpeed,
        sprite = data.Bullet.reloadAnimation:copy(),
        hitbox = Hitbox:new_with_shift(0, 0, 2, 2, 1, 1),
        status = 'idle',
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function HellBullet:setPos(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function HellBullet:nextFrame()
    self.sprite:nextFrame()
end

function HellBullet:update()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
    end
end

function HellBullet:draw(color)
    local x = self.x - gm.x*8 + gm.sx
    local y = self.y - gm.y*8 + gm.sy

    self.sprite:draw(self.x - 2 - 8*gm.x + gm.sx, self.y - 2 - 8*gm.y + gm.sy, self.flip, self.rotate)
end

-- AutoHellBullet.lua
AutoHellBullet = table.copy(Body)

local trash = Sprite:new(anim.gen({379, 0, 380, 381, 382}, 4), 1)
function AutoHellBullet:new()
    local object = {
        x = 0,
        y = 0,
        speed = data.Bullet.defaultSpeed,
        sprite = trash:copy(),
        hitbox = Hitbox:new_with_shift(0, 0, 2, 2, 1, 1),
        status = 'idle',
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function AutoHellBullet:setPos(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function AutoHellBullet:nextFrame()
    self.sprite:nextFrame()
end

function AutoHellBullet:update()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
    end
end

function AutoHellBullet:draw(color)
    local x = self.x - gm.x*8 + gm.sx
    local y = self.y - gm.y*8 + gm.sy

    self.sprite:draw(self.x - 2 - 8*gm.x + gm.sx, self.y - 2 - 8*gm.y + gm.sy, self.flip, self.rotate)
end

-- AutoBulletHell.lua
AutoBulletHell = table.copy(BulletHell)

function AutoBulletHell:_shoot()
    local byTouchId = self:_selectBullet()
    local bull = self:_createShootBullet()
    bull.x = self.bullets[byTouchId].x
    bull.y = self.bullets[byTouchId].y
    bull.hitbox:set_xy(bull.x, bull.y)

    local kawaiiCode = aim.superAim(bull.x, bull.y, self.bulletSpeed)
    bull:setVelocity(kawaiiCode.x, kawaiiCode.y)
    bull.speed = self.bulletSpeed

    table.insert(self.reloadingBullets, self.bullets[(byTouchId - 1) % 8 + 1])

end

function aim.superAim(startX, startY, bulletSpeed)
    -- dirx, diry - направление к игроку
    -- local dirx = game.player.hitbox:get_center().x - startX
    -- local diry = game.player.hitbox:get_center().y - startY
    local dirx = -game.player.hitbox:get_center().x + startX  -- я не понимаю :(
    local diry = -game.player.hitbox:get_center().y + startY  -- ну ладно
    
    local dirX = game.player.dx
    local dirY = game.player.dy
    -- vx, vy - velocity крч. Она точно правильная
    local vx = dirX * game.player.speed
    local vy = dirY * game.player.speed
    if vx ~= 0 and vy ~= 0 then
        vx = vx * data.Player.movementNormalizerDiagonal
        vy = vy * data.Player.movementNormalizerDiagonal
    end

    local s = bulletSpeed

    -- Квадратное уравнение
    local a = vx*vx + vy*vy - s*s
    local b = dirx*vx + diry*vy
    local c = dirx*dirx + diry*diry
    local d = b*b - a * c
    local t = (-b + math.sqrt(d)) / a
    -- trace('t: ' .. t .. ' vx: ' .. vx .. ' vy: ' .. vy .. ' dirx: ' .. dirx .. ' diry: ' .. diry)

    -- Здесь по t находим нужную нам скорость (здесь может быть ошибка!)
    local resX = dirx/t + vx
    local resY = diry/t + vy

    local vec = math.vecNormalize({x=resX, y=resY})
    -- vec = {x=resX, y=resY}

    return {
        x = vec.x,
        y = vec.y,
    }
end

-- MusicBulletHell.lua
MusicBulletHell = table.copy(BulletHell)

-- function MusicBulletHell:tuning(beatMap, sfxMap)
function MusicBulletHell:tuning(music)
    -- local sfxMap = music.sfxMap
    -- local beatMap = music.beatMap
    local sfxMap, beatMap
    if music.intro then
        sfxMap = music.intro.sfxMap
        beatMap = music.intro.beatMap
        self.reserveMusic = {}
        self.reserveMusic.sfxMap = music.sfxMap
        self.reserveMusic.beatMap = music.beatMap
    else
        sfxMap = music.sfxMap
        beatMap = music.beatMap
    end
    -- обязательно вызывается после new для настройки музыки
    
    self.sfxMap = sfxMap
    self.i_sfxMap = 1

    -- строка из 0, 1, указывающая биты, на которые стреляет роза
    self.beatMap = beatMap
    self.i_beatMap = 1

    if music.altBeatMap then
        self.altBeatMap = music.altBeatMap
        -- trace("!!!!!!!!!   "..#self.altBeatMap)
    end
end

function MusicBulletHell:_full_shot()
    if self.beatMap[self.i_beatMap] == 0 then
        return
    end
    self:_shoot()

    local sound = self.sfxMap[self.i_sfxMap]
    sfx(sound[1],
        sound[2],
        sound[3],
        sound[4],
        sound[5],
        sound[6]
    )
    self.i_sfxMap = (self.i_sfxMap % #self.sfxMap) + 1
end

function MusicBulletHell:onBeat()

    if #self.beatMap == 4 then
        if not game.metronome.beat4 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 8 then
        if not game.metronome.beat8 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 16 then
        if not game.metronome.beat16 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 32 then
        if not game.metronome.beat32 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 24 then
        self:_full_shot()
    elseif #self.beatMap == 6 then
        if not game.metronome.beat6 then
            return
        end
        self:_full_shot()
    end
    -- self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
    if not self.reserveMusic then
        self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
        if self.altBeatMap and self.i_beatMap == 1 then
            local buf = table.copy(self.beatMap)
            self.beatMap = table.copy(self.altBeatMap)
            self.altBeatMap = buf
            -- trace(self.altBeatMap[1].." "..self.altBeatMap[2].." "..self.altBeatMap[3].." "..self.altBeatMap[4])
            -- trace(self.beatMap[1].." "..self.beatMap[2].." "..self.beatMap[3].." "..self.beatMap[4])
        end
        return
    end
    self.i_beatMap = self.i_beatMap + 1
    if self.i_beatMap > #self.beatMap then
        self:tuning(self.reserveMusic)
        self.reserveMusic = false
    end
end

function MusicBulletHell:update()
    if self.status == 'dying' then
        self.deathTick()
        return
    end

    if self:isDeadCheck() then
        self:launchBulletsAround()
        local time = 0
        self.status = 'dying'
        self.deathTick = function()
            time = time + Time.dt()
            if time > data.BulletHell.deathTimeMs then
                self:die()
            end
        end
        return
    end

    if self.hitbox:collide(game.boomer.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end

    if game.metronome.onBeat then
        self:onBeat()
    end

    for i = 1, #self.bullets do
        self.bullets[i]:update()
    end
end

-- MusicAutoBulletHell.lua
MusicAutoBulletHell = table.copy(AutoBulletHell)
-- local bulletSprite = 379

function MusicAutoBulletHell:new(x, y, config)

    local bullets = {}
    for i = 1, config.bulletCount do
        bullets[i] = AutoHellBullet:new()
    end

    local radius = math.floor(config.circleDiameter / 2) - 2
    local object = {
        x = x,
        y = y,
        type = type,
        spread = config.bulletSpreadRadius,
        bullets = bullets,
        bulletCount = config.bulletCount,
        bulletSpeed = config.bulletSpeed,
        bulletSprite = bulletSprite,
        rotationSpeed = config.bulletRotationSpeed,
        deathBulletSpeed = config.deathBulletSpeed,
        hp = config.hp,
        hitbox = HitCircle:new(x+1, y+1, config.circleDiameter),
        radius = radius,
        time = 0,
        status = '',
        color = config.color,

        reloadingTimer = 0,
        reloadingBullets = {},
        currentAnimations = {},

        isActive = false,

        damageSound = data.EnemyDamageSounds.BulletHell,
        deathSound = data.EnemyDeathSounds.BulletHell,
    }

    BulletHell._moveBullets(object, 0)

    setmetatable(object, self)
    self.__index = self
    return object
end


-- function MusicAutoBulletHell:tuning(beatMap, sfxMap)
function MusicAutoBulletHell:tuning(music)
    local sfxMap, beatMap
    if music.intro then
        sfxMap = music.intro.sfxMap
        beatMap = music.intro.beatMap
        self.reserveMusic = {}
        self.reserveMusic.sfxMap = music.sfxMap
        self.reserveMusic.beatMap = music.beatMap
    else
        sfxMap = music.sfxMap
        beatMap = music.beatMap
    end
    -- local sfxMap = music.sfxMap
    -- local beatMap = music.beatMap
    -- обязательно вызывается после new для настройки музыки
    
    self.sfxMap = sfxMap
    self.i_sfxMap = 1

    -- строка из 0, 1, указывающая биты, на которые стреляет роза
    self.beatMap = beatMap
    self.i_beatMap = 1

    if music.altBeatMap then
        self.altBeatMap = music.altBeatMap
        -- trace("!!!!!!!!!   "..#self.altBeatMap)
    end
end

function MusicAutoBulletHell:_full_shot()
    if self.beatMap[self.i_beatMap] == 0 then
        return
    end
    self:_shoot()

    local sound = self.sfxMap[self.i_sfxMap]
    sfx(sound[1],
        sound[2],
        sound[3],
        sound[4],
        sound[5],
        sound[6]
    )
    self.i_sfxMap = (self.i_sfxMap % #self.sfxMap) + 1
end

function MusicAutoBulletHell:onBeat()
    if #self.beatMap == 4 then
        if not game.metronome.beat4 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 8 then
        if not game.metronome.beat8 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 16 then
        if not game.metronome.beat16 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 24 then
        self:_full_shot()
    elseif #self.beatMap == 6 then
        if not game.metronome.beat6 then
            return
        end
        self:_full_shot()
    end
    if not self.reserveMusic then
        self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
        return
    end
    self.i_beatMap = self.i_beatMap + 1
    if self.i_beatMap > #self.beatMap then
        self:tuning(self.reserveMusic)
        self.reserveMusic = false
    end
end

local trash = Sprite:new({379}, 1)
function MusicAutoBulletHell:_createShootBullet()
    local bull = Bullet:new(0, 0, trash)
    bull.speed = self.bulletSpeed
    
    table.insert(game.drawables, bull)
    table.insert(game.updatables, bull)

    return bull
end

function MusicAutoBulletHell:update()
    if self.status == 'dying' then
        self.deathTick()
        return
    end

    if self:isDeadCheck() then
        self:launchBulletsAround()
        local time = 0
        self.status = 'dying'
        self.deathTick = function()
            time = time + Time.dt()
            if time > data.BulletHell.deathTimeMs then
                self:die()
            end
        end
        return
    end

    if self.hitbox:collide(game.boomer.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end

    if game.metronome.onBeat then
        self:onBeat()
    end

    for i = 1, #self.bullets do
        self.bullets[i]:update()
    end
end


function MusicAutoBulletHell:onBeat()

    if #self.beatMap == 4 then
        if not game.metronome.beat4 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 8 then
        if not game.metronome.beat8 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 16 then
        if not game.metronome.beat16 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 32 then
        if not game.metronome.beat32 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 24 then
        self:_full_shot()
    elseif #self.beatMap == 6 then
        if not game.metronome.beat6 then
            return
        end
        self:_full_shot()
    end
    -- self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
    if not self.reserveMusic then
        self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
        if self.altBeatMap and self.i_beatMap == 1 then
            local buf = table.copy(self.beatMap)
            self.beatMap = table.copy(self.altBeatMap)
            self.altBeatMap = buf
            -- trace(self.altBeatMap[1].." "..self.altBeatMap[2].." "..self.altBeatMap[3].." "..self.altBeatMap[4])
            -- trace(self.beatMap[1].." "..self.beatMap[2].." "..self.beatMap[3].." "..self.beatMap[4])
        end
        return
    end
    self.i_beatMap = self.i_beatMap + 1
    if self.i_beatMap > #self.beatMap then
        self:tuning(self.reserveMusic)
        self.reserveMusic = false
    end
end


-- Rose.lua
Rose = table.copy(Enemy)

local ANIMATION_FRAME_DURATION_MS = 16
local ROSE_ANIMATION_DURATION_MS = 69
local LASER_WIDTH = 3

function Rose:new(x, y, direction, sprites, laserColor, config)
    -- direction:
    -- 0 - up
    -- 1 - down
    -- 2 - left
    -- 3 - right
    local flip = 0
    local rotate = 0
    local laserSpeed = 8
    local laserdx = 0
    local laserdy = 0
    local laserbeginx = 0
    local laserbeginy = 0
    local hitboxx1
    local hitboxy1
    local hitboxx2
    local hitboxy2
    if direction == 0 then
        laserdy = -laserSpeed
        laserbeginx = x + 7
        laserbeginy = y + 8
        hitboxx1 = x + 3
        hitboxy1 = y + 7
        hitboxx2 = hitboxx1 + 10
        hitboxy2 = hitboxy1 + 8
    elseif direction == 1 then
        flip = 2
        laserdy = laserSpeed
        laserbeginx = x + 7
        laserbeginy = y + 16 - 8
        hitboxx1 = x + 3
        hitboxy1 = y + 1
        hitboxx2 = hitboxx1 + 10
        hitboxy2 = hitboxy1 + 8
    elseif direction == 2 then
        flip = 1
        rotate = 1
        laserdx = -laserSpeed
        laserbeginx = x + 16 - 8
        laserbeginy = y + 7
        hitboxx1 = x + 7
        hitboxy1 = y + 4
        hitboxx2 = hitboxx1 + 9
        hitboxy2 = hitboxy1 + 8
    else
        rotate = 1
        laserdx = laserSpeed
        laserbeginx = x + 8
        laserbeginy = y + 7
        hitboxx1 = x
        hitboxy1 = y + 4
        hitboxx2 = hitboxx1 + 9
        hitboxy2 = hitboxy1 + 8
    end

    local damageSound
    local deathSound
    if config.isWeak then
        damageSound = data.EnemyDamageSounds.WeakRose
        deathSound = data.EnemyDeathSounds.WeakRose
    else
        damageSound = data.EnemyDamageSounds.Rose
        deathSound = data.EnemyDeathSounds.Rose
    end

    local obj = {
        sprite = sprites.idle,
        sprites = sprites,
        laserColor = laserColor,
        damageSound = damageSound,
        deathSound = deathSound,
        x = x,
        y = y,
        flip = flip,
        rotate = rotate,

        hitbox = Hitbox:new(hitboxx1, hitboxy1, hitboxx2, hitboxy2),
        laserbeginx = laserbeginx,
        laserbeginy = laserbeginy,
        laserdx = laserdx,
        laserdy = laserdy,
        speed = laserSpeed,
        laserHitbox = Hitbox:new(x + 7, y + 11 - 20, x + 7 + 3, y + 11),
        direction = direction,

        hp = config.startingHealth,

        status = 'idle',

        shooting = false,
        ticks = 0,
        ticksBeforeShot = data.Rose.metronomeTicksReloading,
        ticksShooting = data.Rose.metronomeTicksSpentShooting,

        currentAnimations = {},

        isActive = false,
    }

    Rose.shoot(obj)

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Rose:onBeat()
    self.ticks = self.ticks + 1

    if self.status == 'shootBegin' then
        if self.ticks == self.ticksBeforeShot then
            self.status = 'shooting'
            self:shoot()
            self.ticks = 0
        end
    elseif self.status == 'shooting' then
        if self.ticks == self.ticksShooting then
            self.status = 'shootEnd'
            self.ticks = 0
        end
    end
end

function Rose:handleBeat()
    if game.metronome.onBeat then
        self:onBeat()
    end
end

function Rose:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    if self.status == 'dying' then
        self.sprite:nextFrame()
        if self.sprite:animationEnd() then
            self:die()
        end
        return
    end

    self:_focusAnimations()

    if not self.isActive then
        return
    end

    self:handleBeat()

    if self:isDeadCheck() then
        self.sprite = data.Rose.sprites.death:copy()
        self.status = 'dying'
        return
    end

    if game.metronome.onBass then
        self:onBeat()
    end

    if self.status == 'shooting' then
        if self.laserHitbox:collide(game.player.hitbox) then
            game.player:die()
        end
    end

    if self.status == 'idle' then
        if game.metronome:msBeforeNextBeat() <= ROSE_ANIMATION_DURATION_MS and not self.animation_playing then
            self.status = 'shootBegin'
        end
    end

    if self.status == 'shootBegin' then
        if not self.sprite:animationEnd() then
            self.sprite:nextFrame()
        end
    end

    if self.status == 'shootEnd' then
        frame = self.sprite:getFrame()
        if frame == 1 then
            self.status = 'idle'
        else
            self.sprite:setFrame(frame - 1)
        end
    end
end

function Rose:draw()
    if self.status == 'shooting' then
        self.laserHitbox:draw(self.laserColor)
    end

    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)

    self:_drawAnimations()
end

function Rose:shoot()
    local laserHitbox = Hitbox:new(self.laserbeginx, self.laserbeginy, self.laserbeginx + 1, self.laserbeginy + 1)

    while laserHitbox:mapCheck() do
        local newx = laserHitbox.x1 + self.laserdx
        local newy = laserHitbox.y1 + self.laserdy
        laserHitbox:set_xy(newx, newy)
    end

    local x = laserHitbox.x1 - self.laserdx
    local y = laserHitbox.y1 - self.laserdy
    laserHitbox:set_xy(x, y)

    while laserHitbox:mapCheck() do
        local newx = laserHitbox.x1 + (self.laserdx / self.speed)
        local newy = laserHitbox.y1 + (self.laserdy / self.speed)
        laserHitbox:set_xy(newx, newy)
    end

    local x
    local y
    if self.direction == 0 or self.direction == 2 then
        x = laserHitbox.x1 - self.laserdx / self.speed
        y = laserHitbox.y1 - self.laserdy / self.speed
    else
        x = laserHitbox.x1 + self.laserdx / self.speed
        y = laserHitbox.y1 + self.laserdy / self.speed
    end

    local newHitbox
    if self.direction == 0 then
        newHitbox = Hitbox:new(x, y, x + LASER_WIDTH, self.laserbeginy)
    elseif self.direction == 1 then
        newHitbox = Hitbox:new(x, self.laserbeginy, x + LASER_WIDTH, y)
    elseif self.direction == 2 then
        newHitbox = Hitbox:new(x, y, self.laserbeginx, y + LASER_WIDTH)
    else
        newHitbox = Hitbox:new(self.laserbeginx, y, x, y + LASER_WIDTH)
    end

    self.laserHitbox = newHitbox
end

-- LongRose.lua
LongRose = table.copy(Rose)

function LongRose:onBeat()
    self.ticks = self.ticks + 1

    if self.status == 'shootBegin' then
        if self.ticks == self.ticksBeforeShot then
            self.status = 'shooting'
            self:shoot()
            self.ticks = 0
        end
    elseif self.status == 'shooting' then
        if self.ticks == self.ticksShooting then
            self.status = 'shootEnd'
            self.ticks = 0
        end
    end
end

function LongRose:handleBeat()
    if game.metronome.onBass and self.status == 'shootBegin' then
        self.status = 'shooting'
        self:shoot()
    end

    if self.status == 'shooting' and not game.metronome.onBass then
        self.status = 'shootEnd'
    end
end

-- MusicRose.lua
MusicRose = table.copy(LongRose)

-- function MusicRose:tuning(beatMap, sfxMap)
function MusicRose:tuning(music)
    -- local sfxMap = music.sfxMap
    -- local beatMap = music.beatMap
    local sfxMap, beatMap
    if music.intro then
        sfxMap = music.intro.sfxMap
        beatMap = music.intro.beatMap
        self.reserveMusic = {}
        self.reserveMusic.sfxMap = music.sfxMap
        self.reserveMusic.beatMap = music.beatMap
    else
        sfxMap = music.sfxMap
        beatMap = music.beatMap
    end
    -- обязательно вызывается после new для настройки музыки

    self.sfxMap = sfxMap
    self.i_sfxMap = 1

    -- строка из 0, 1, указывающая биты, на которые стреляет роза
    self.beatMap = beatMap
    self.i_beatMap = 1

    if music.altBeatMap then
        self.altBeatMap = music.altBeatMap
    end
end


function MusicRose:_full_shot()
    if self.beatMap[self.i_beatMap] == 0 then
        self.status = 'idle'
        self.sprite = self.sprites.idle
        return
    end
    self.status = 'shooting'
    self.sprite = self.sprites.shooting

    local sound = self.sfxMap[self.i_sfxMap]
    sfx(sound[1],
        sound[2],
        sound[3],
        sound[4],
        sound[5],
        sound[6]
    )
    self.i_sfxMap = (self.i_sfxMap % #self.sfxMap) + 1
end


function MusicRose:onBeat()
    if #self.beatMap == 4 then
        if not game.metronome.beat4 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 16 then
        if not game.metronome.beat16 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 8 then
        if not game.metronome.beat8 then
            return
        end
        self:_full_shot()
    elseif #self.beatMap == 6 then
        if not game.metronome.beat6 then
            return
        end
        self:_full_shot()
    end
    if not self.reserveMusic then
        self.i_beatMap = (self.i_beatMap % #self.beatMap) + 1
        if self.altBeatMap and self.i_beatMap == 1 then
            local buf = table.copy(self.beatMap)
            self.beatMap = table.copy(self.altBeatMap)
            self.altBeatMap = buf
            -- trace(self.altBeatMap[1].." "..self.altBeatMap[2].." "..self.altBeatMap[3].." "..self.altBeatMap[4])
            -- trace(self.beatMap[1].." "..self.beatMap[2].." "..self.beatMap[3].." "..self.beatMap[4])
        end
        return
    end
    self.i_beatMap = self.i_beatMap + 1
    if self.i_beatMap > #self.beatMap then
        self:tuning(self.reserveMusic)
        self.reserveMusic = false
    end
end


function MusicRose:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    if self.status == 'dying' then
        self.sprite:nextFrame()
        if self.sprite:animationEnd() then
            self:die()
        end
        return
    end

    self:_focusAnimations()

    if self:isDeadCheck() then
        self.sprite = self.sprites.death:copy()
        self.status = 'dying'
        return
    end

    if not self.isActive then
        return
    end

    self:onBeat()

    if self.status == 'shooting' then
        if self.laserHitbox:collide(game.player.hitbox) then
            game.player:die()
        end
    end
end

-- Decorations.lua
Decorations = {}

local decorationTiles = {
    100, 101, 102, 103, 104,
}
local decorations = {}

local function nextFrame(decoration)
    local x = decoration.x
    local y = decoration.y

    mset(x, y, 0);
    if decoration.c then
        mset(x, y, decoration.nxt)
    else
        mset(x, y, decoration.cur)
    end

    decoration.c = not decoration.c
end

function Decorations.init()
    for x = 0, MAP_WIDTH do
        for y = 0, MAP_HEIGHT do
            local tile = mget(x, y)
            local decoration
            if table.contains(decorationTiles, tile) then
                decoration = {x=x, y=y, c=true, cur=tile, nxt=tile+16}
            elseif table.contains(decorationTiles, tile - 16) then
                decoration = {x=x, y=y, c=false, cur=tile - 16, nxt=tile}
            end
            table.insert(decorations, decoration)
        end
    end
end

function Decorations:update()
    if game.metronome.beat4 then
        for _, decoration in ipairs(decorations) do
            nextFrame(decoration)
        end
    end
end


-- Bullet.lua
Bullet = table.copy(Body)

Bullet.defaultSprite = StaticSprite:new(373, 1)

function Bullet:new(x, y, sprite)
    sprite = sprite or Bullet.defaultSprite

    local obj = {
        x = x,
        y = y,
        vector = {x = 0, y = 0},
        hitbox = Hitbox:new_with_shift(x, y, x + 2, y + 2, 2, 2), --,HitCircle:new(x, y, 2), -- 
        speed = data.Bullet.defaultSpeed,
        sprite = sprite:copy(),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Bullet:setVelocity(x, y)
    self.vector.x = x
    self.vector.y = y
end

function Bullet:vectorUpdateByTarget(targetCoordX, targetCoordY)
    self.vector.x = targetCoordX - self.x
    self.vector.y = targetCoordY - self.y
    self.vector = math.vecNormalize(self.vector)
end

function Bullet:_move()
    self.x = self.x + self.vector.x * self.speed
    self.y = self.y + self.vector.y * self.speed
    self.hitbox:set_xy(self.x, self.y)
end

local count = 0
function Bullet:_destroy()
    table.insert(game.deleteSchedule, self)
end

function Bullet:_kill()
    if self.hitbox:collide(game.player.hitbox) then
        game.player:die()
        self:_destroy()
    end
end

function Bullet:_checkCollision()
    if not self.hitbox:mapCheck() then
        self:_destroy()
    end
end

function Bullet:update()
    self:_checkCollision()
    self:_move()
    self:_kill()
end

function Bullet:draw()
    self.sprite:draw(self.x - 1 - gm.x*8 + gm.sx, self.y - 1 - gm.y*8 + gm.sy, self.flip, self.rotate)
end

-- Taraxacum.lua
Taraxacum = table.copy(Bullet)

function Taraxacum:new(x, y, radius, speed, count, countSlow, countFast, spread)
    radius = radius or data.Taraxacum.radius
    speed = speed or data.Taraxacum.speed
    count = count or data.Taraxacum.deathBulletCount
    countSlow = countSlow or data.Taraxacum.deathBulletSlowCount
    countFast = countFast or data.Taraxacum.deathBulletFastCount
    spread = spread or data.Taraxacum.deathBulletSpread
    --local deathBulletSpeed = error('No way!')
    local object = {
        x = x,
        y = y,
        vector = {x = 0, y = 0},
        hitbox = HitCircle:new(x, y, radius),
        speed = speed,
        count = count,
        countSlow = countSlow,
        countFast = countFast,
        spread = spread,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function Taraxacum:_launchBullets()
    local spread = self.spread
    local count = self.count

    local function createBulletAtRandomPoint()
        local ran = math.random()
        local angle = (2 * math.pi) * ran
        
        local x = self.x + spread * math.cos(angle)
        local y = self.y + spread * math.sin(angle)

        local bullet = self:_createBullet(x, y)

        local dx = x - self.x
        local dy = y - self.y
        bullet:setVelocity(dx, dy)

        return bullet
    end
    
    for i = 1, count do
        createBulletAtRandomPoint()
    end

    for i = 1, self.countSlow do
        local bullet = createBulletAtRandomPoint()
        bullet.speed = data.Taraxacum.deathSlowBulletSpeed
    end

    for i = 1, self.countFast do
        local bullet = createBulletAtRandomPoint()
        bullet.speed = data.Taraxacum.deathFastBulletSpeed
    end
end

function Taraxacum:_createBullet(x, y)
    local bullet = Bullet:new(x, y, data.Taraxacum.deathBulletSprite)
    bullet.speed = data.Taraxacum.deathBulletSpeed
    table.insert(game.updatables, bullet)
    table.insert(game.drawables, bullet)

    return bullet
end

function Taraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_launchBullets()
        self:_destroy()
    end

    -- TODO: тут можно пользоваться тайлами двери, а не этими приколами 🤔🤔
    for _, door in ipairs(game.doors) do
        -- САМЫЙ БЕЗУМНЫЙ КОСТЫЛЬ
        if self.hitbox:collide(door.hitboxLeft) or
           self.hitbox:collide(door.hitboxRight)
        then
     -- begin
            self:_launchBullets()
            self:_destroy()
        end
    end

    if not self.hitbox:mapCheck() then
        self:_launchBullets()
        self:_destroy()
    end
end

function Taraxacum:setVelocity(x, y)
    self.vector = {x=x, y=y}
end

function Taraxacum:draw()
    self.hitbox:draw(data.Taraxacum.color)
end

-- JustTaraxacum.lua
JustTaraxacum = table.copy(Taraxacum)

function JustTaraxacum:new(x, y)
    local object = {
        x = x,
        y = y,
        hitbox = HitCircle:new(x, y, data.Snowman.whirl.taraxacum.radius),
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function JustTaraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_destroy()
    end
end

function JustTaraxacum:setPos(x, y)
    self.x = x
    self.y = y
    self.hitbox:set_xy(x, y)
end

function JustTaraxacum:update()
    self:_checkCollision()
end

function JustTaraxacum:draw()
    self.hitbox:draw(data.Taraxacum.color)
end

-- StaticTaraxacum.lua
StaticTaraxacum = table.copy(Taraxacum)

function StaticTaraxacum:new(
    x, y, config
)
    local radius = config.staticRadius or error('no config!')
    local speed = config.speed or error('no config!')
    local count = config.deathBulletCount or error('no config!')
    local countSlow = config.deathBulletSlowCount or error('no config!')
    local countFast = config.deathBulletFastCount or error('no config!')
    local spread = config.deathBulletSpread or error('no config!')
    local bodyLength = config.bodyLength or error('no config!')
    local deathBulletSpeed = config.deathBulletSpeed or error('no config!')

    local object = {
        x = x,  -- wtf
        y = y,
        w = 0,
        h = bodyLength,
        config = config,
        radius = radius,
        hitbox = HitCircle:new(x, y, 2 * radius),
        dead = false,
        speed = speed,
        count = count,
        countSlow = countSlow,
        countFast = countFast,
        deathBulletSpeed = deathBulletSpeed,
        spread = spread,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function StaticTaraxacum:_checkCollision()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_launchBullets()
        self:_destroy()
    end
end

function StaticTaraxacum:_destroy()
    table.removeElement(game.updatables, self)
    self.dead = true
end

function StaticTaraxacum:_move()
    -- 😣😣😣
end

function StaticTaraxacum:draw()
    local x = self.radius + self.x - gm.x*8 + gm.sx - 1
    local y = self.radius + self.y - gm.y*8 + gm.sy - 1
    line(x, y, x + self.w, y + self.h, data.StaticTaraxacum.bodyColor)
    if not self.dead then
        self.hitbox:draw(data.Taraxacum.color)
    end
end

-- SpecialTaraxacum.lua
--😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣
SpecialTaraxacum = table.copy(StaticTaraxacum) -- 😣😣😣😣😣😣😣😣😣😣😣
--😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣😣

function SpecialTaraxacum:new(x, y, radius, bodyLength, shiftX, shiftY)
    local speed = data.StaticTaraxacum.speed
    local count = data.StaticTaraxacum.deathBulletCount
    local countSlow = data.StaticTaraxacum.deathBulletSlowCount
    local countFast = data.StaticTaraxacum.deathBulletFastCount
    local spread = data.StaticTaraxacum.deathBulletSpread

    local object = {
        x = x,
        y = y,
        w = 0,
        h = bodyLength,
        shiftX = shiftX + 1,
        shiftY = shiftY - 1,
        radius = radius,
        hitbox = HitCircle:new(x, y, 2 * radius),
        dead = false,
        status = 'needReload',
        timer = 0,

        speed = speed,
        count = count,
        countSlow = countSlow,
        countFast = countFast,
        spread = spread,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function SpecialTaraxacum:move(x, y)
    -- 😣😣😣
    self.x = x + self.shiftX -- + data.Snowman.specialTaraxacum.radius - 1 
    self.y = y + self.shiftY -- - data.Snowman.specialTaraxacum.radius - 1
    self.hitbox:set_xy(self.x, self.y)
end

function SpecialTaraxacum:_drawline(start, ending)
	line(start.x, start.y, ending.x, ending.y, data.Snowman.specialTaraxacum.bodyColor)
    -- local arm = self.h / 4
    -- local shift = self.h / 4
    -- local dir = aim.compute(start.x, start.y, ending.x, ending.y, 1)
    -- local white = data.Snowman.specialTaraxacum.color

    -- line(1 + start.x + shift*dir.x, start.y + shift*dir.y, 1 + start.x + arm*dir.x, start.y + arm*dir.y, white)
    -- line(-1 + ending.x - shift*dir.x, ending.y - shift*dir.y, -1 + ending.x - (shift+arm)*dir.x, ending.y - (shift+arm)*dir.y, white)
end

function SpecialTaraxacum:_reloadAnimation()
	if self.timer == data.Snowman.specialTaraxacum.reloadAnimationTime then
		self.status = 'ready'
	elseif self.timer <= data.Snowman.specialTaraxacum.reloadAnimationTime // 3 then
		circ(self.x + self.radius - 1 - gm.x*8 + gm.sx, self.y + 2- gm.y*8 + gm.sy, 0, data.Snowman.specialTaraxacum.color)
		self.timer = self.timer + 1
	elseif self.timer <= 2 * data.Snowman.specialTaraxacum.reloadAnimationTime // 3 then
		circ(self.x + self.radius - 1 - gm.x*8 + gm.sx, self.y + 2 - gm.y*8 + gm.sy, 1, data.Snowman.specialTaraxacum.color)
		self.timer = self.timer + 1
	elseif self.timer < data.Snowman.specialTaraxacum.reloadAnimationTime then
		circ(self.x + self.radius - 1 - gm.x*8 + gm.sx, self.y + 2 - gm.y*8 + gm.sy, 2, data.Snowman.specialTaraxacum.color)
		self.timer = self.timer + 1
	end
end

function SpecialTaraxacum:draw()
    local x = self.radius + self.x - gm.x*8 + gm.sx - 1
    local y = self.radius + self.y - gm.y*8 + gm.sy - 1
    local start = {x = x, y = y}
    local ending = {x = x - data.Snowman.specialTaraxacum.bodyLength, y = y + data.Snowman.specialTaraxacum.bodyLength}

    -- ARMS
    local armLength = data.Snowman.specialTaraxacum.bodyLength / 4
    local sx = self.snowman.hitbox:get_center().x - gm.x*8 + gm.sx
    local sy = self.snowman.hitbox:get_center().y - gm.y*8 + gm.sy
    local leftArmStart = {x = sx - 2, y = sy - 2}
    local rightArmStart = {x = sx + 2, y = sy - 1}
    local leftArmEnd = {x = leftArmStart.x - armLength + 1, y = leftArmStart.y + armLength,}
    local rightArmEnd = {x = rightArmStart.x + armLength - 2, y = rightArmStart.y - armLength - 1,}

    -- ARMS DRAAAAAAAAAAW
    line(leftArmStart.x, leftArmStart.y, leftArmEnd.x, leftArmEnd.y, data.Snowman.color)
    line(rightArmStart.x, rightArmStart.y, rightArmEnd.x, rightArmEnd.y, data.Snowman.color)

    self:_drawline(start, ending)

    if not self.dead then
    	if self.status == 'needReload' then
        	self:_reloadAnimation()
        else
        	self.hitbox:draw(data.Taraxacum.color)
        	self.timer = 0
    	end
    end
end

-- Snowman.lua
Snowman = table.copy(Enemy)

function Snowman:new(x, y, config)
    local startTaraxacum = nil
    startTaraxacum = SpecialTaraxacum:new(
        x + config.specialTaraxacum.shiftForCenterX,
        y + config.specialTaraxacum.shiftForCenterY,
        config.specialTaraxacum.radius,
        config.specialTaraxacum.bodyLength,
        config.specialTaraxacum.shiftForCenterX,
        config.specialTaraxacum.shiftForCenterY
    )

    local object = {
        x = x,
        y = y,
        awake = false,
        speed = config.speed,
        sleepDistanceToPlayer = config.sleepDistanceToPlayer,
        config = config,
        damageSound = data.EnemyDamageSounds.Snowman,
        deathSound = data.EnemyDeathSounds.Snowman,
        hp = config.hp,
        sprite = config.sprites.chill:copy(),
        hitbox = Hitbox:new(x, y, x + 16, y + 16),

        taraxacum = startTaraxacum,

        theWay = nil,

        status = 'idle',
        attackStatus = 'idle',
        chaseStatus = 'no chase 🙄',

        currentAnimations = {},

        outOfChaseTime = 0,
        forJumpTime = 0,

        area = MapAreas.findAreaWithTile(x // 8, y // 8),
    }

    object.taraxacum.snowman = object

    setmetatable(object, self)
    self.__index = self
    return object
end

function Snowman:_prepareJumpActivate()
    self.status = 'steady'
    if not (self.attackStatus == 'whirl') then
        self.sprite = self.config.sprites.prepareJump:copy()
    end
    self.forJumpTime = 0
end

function Snowman:_jumpActivate()
    self.status = 'go'
    if not (self.attackStatus == 'whirl') then
        self.sprite = self.config.sprites.flyJump:copy()
    end
    self.forJumpTime = 0
end

function Snowman:_resetJumpActivate()
    self.status = 'ready'
    if not (self.attackStatus == 'whirl') then
        self.sprite = self.config.sprites.resetJump:copy()
    end
    self.forJumpTime = 0
    --error('not implemented error on Snowman:_resetJumpActivate()')
end

function Snowman:move(dx, dy) -- special for doors 🥰
    self.x = self.x + dx
    self.y = self.y + dy
    self.hitbox:set_xy(self.x, self.y)
    self.taraxacum:move(self.x, self.y)
    self:_moveWhirlAttack()
end

function Snowman:_moveOneTile() -- оптимизируем вычисления в 60 раз если будем вызывать каждый бит, а не тик.. эх, раньше надо было
    for _, tile in ipairs(game.transitionTiles) do -- этот парень почти как игрок, ему можно
        if tile.x == self.x // 8 and tile.y == self.y // 8 and self.area ~= tile.area then
            self.area = tile.area
            -- trace('Snowman transitioned into area ' .. self.area)
        end
    end

    if #self.theWay > 2 and self.chaseStatus == 'chasing 🧐' then --[[ придётся менять это условие и то, что ниже в _jumpActivate()
     широкий парень уважает личное пространство                 ]]--
        --trace(tostring(table.contains(data.bfs.solidTiles, mget(self.theWay[2].x, self.theWay[2].y))))
        if not table.contains(data.bfs.solidTiles, mget(self.theWay[2 + 1].x, self.theWay[2 + 1].y)) then -- тут мы проверяем, не является ли, совершенно случайно, следующий тайл дверью 😅
            local vec = {x = 8 * self.theWay[2].x - self.x, y = 8 * self.theWay[2].y - self.y}
            return self:_slowMoveOneTile(math.vecNormalize(vec), {x = 8 * self.theWay[2].x, y = 8 * self.theWay[2].y})
        else
            -- trace('next time i chase you 👿')
            return false
        end
        -- Честно говоря, я тоже боюсь того, что написал
    elseif self.outOfChaseTime < #self.theWay - 2 and self.chaseStatus == 'lost him 😠' then
        --trace(tostring(table.contains(data.bfs.solidTiles, mget(self.theWay[2 + self.outOfChaseTime].x, self.theWay[2 + self.outOfChaseTime].y))))
        if self.area == game.playerArea then -- провяем, на одной ли зоне 🐓
            local vec = {x = 8 * self.theWay[2 + self.outOfChaseTime].x - self.x, y = 8 * self.theWay[2 + self.outOfChaseTime].y - self.y}
            return self:_slowMoveOneTile(math.vecNormalize(vec), {x = 8 * self.theWay[2 + self.outOfChaseTime].x, y = 8 * self.theWay[2 + self.outOfChaseTime].y})
        else
            -- trace('damn you, player the sandass')
            return false
        end
    else
        --trace('let me hug yu🤗!!')
    end
end

function Snowman:_moveWhirlAttack()
    --  ________________________________________________________________________________________
    -- | BOOMER @ MAIL.tic 😏 |                                                                 |
    -- |-----------------------                                                                 |
    -- |                                                                                        |
    -- | kawaii-Code@boomerang2.com: Тот кто увидит этот комментарий должен удалить             | 
    -- | эту функцию. 🥵🤬🤬                                                                    |
    -- |                                                                                        |
    -- | Linux Torbolts@boomerang2.com: я закомментирую, вдруг ещё пригодится 🤓👍              |
    -- |                                                                                        |
    -- | kawaii-Code@boomerang2.com: Ладно, не удаляйте 😅😅                                    |
    --  ----------------------------------------------------------------------------------------
    --
    if self.whirlAttack then
        self.whirlAttack.x = self.hitbox:get_center().x
        self.whirlAttack.y = self.hitbox:get_center().y
    end
end

function Snowman:_slowMoveOneTile(vector, neededXY)
    if math.abs(self.x - neededXY.x) < 1 then
        self.x = neededXY.x
    end
    if math.abs(self.y - neededXY.y) < 1 then
        self.y = neededXY.y
    end
    if self.x == neededXY.x and self.y == neededXY.y then
        self.hitbox:set_xy(self.x, self.y)
        self.taraxacum:move(self.x, self.y)
        self:_moveWhirlAttack()
        return true
    end
    self.x = self.x + vector.x * self.speed
    self.y = self.y + vector.y * self.speed
    self.hitbox:set_xy(self.x, self.y)
    self.taraxacum:move(self.x, self.y)
    self:_moveWhirlAttack()
end

function Snowman:_updatePath()
    -- Ух ты! Крутая оптимизация.. 🤩🤩
    -- Я знаю 😎
    -- когда у нас начнет лагать можно будет не создавать новый путь при каждой проверке, а менять предыдущий на основе того,
    -- как изменилось положение игрока. просматривая от конца пути расширяя радиус проверки. должно быть круто, но может быть проблема,
    -- если там глупые препятствия. возможно при этом путь будет не самый короткий, но более интересный.
end

function Snowman:_onBeat()
    if self.attackStatus == 'whirl' then
        return
    elseif game.metronome.onOddBeat then
        self:_prepareJumpActivate()
    elseif game.metronome.onEvenBeat then
        self:_jumpActivate()
    end
end

function Snowman:_setPath()
    -- local way = aim.bfsMapAdaptedV2x2({x = self.x // 8, y = self.y // 8})
    local way = aim.astar_2x2({x = self.x // 8, y = self.y // 8})

    if way then
        self.chaseStatus = 'chasing 🧐'
        self.theWay = way
        self.outOfChaseTime = 0
    else
        self.chaseStatus = 'lost him 😠'
        self.outOfChaseTime = self.outOfChaseTime + 1 --in bits
    end
end

-- DO NOT EDIT. UPDATE OVERRIDE IN MUSIC SNOWMAN. YES THIS IS STUPID. 😊
function Snowman:update()
    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)
    end

    if not game.metronome.onBass and self.attackStatus == 'whirl' then
        self.speed = self.config.speed
        self.attackStatus = 'idle'
        self.whirlAttack:endAttack()
        self.whirlAttack = nil -- Чтобы жесткие ошибки 😱😱😷
    end

    if game.metronome.onBass and self.attackStatus ~= 'whirl' then
        self.attackStatus = 'whirl'
        self.speed = self.config.speedWithWhirl
        -- DO: Тут костыль +8
        -- Готово 🤠
        self.whirlAttack = SnowmanWhirlAttack:new(self.hitbox:get_center().x, self.hitbox:get_center().y, self.taraxacum.h)
        self.whirlAttack.snowman = self
    end

    self:_focusAnimations()

    if self.status == 'dying' then
        self.sprite:nextFrame()
        if self.sprite:animationEnd() then
            self:_createDeathEffect()
            self:die()
        end
        return
    end

    if self:isDeadCheck() then
        self.sprite = self.config.sprites.death:copy()
        self.status = 'dying'
        return
    end

    if self.attackStatus == 'whirl' then
        self.whirlAttack:update()
        self.sprite = self.config.sprites.chill:copy()
        if self.theWay then
            self:_moveOneTile()
        end
    end

    --разбили время на прыжок на две равные части, фрейм меняем в соответствующее время
    if self.status == 'steady' then
        self.forJumpTime = self.forJumpTime + 1
        if self.forJumpTime == self.config.prepareJumpTime then
            self.status = 'idle'
        elseif self.forJumpTime == self.config.prepareJumpTime // 2 then
            self.sprite:nextFrame()
        end
    end

    if self.status == 'go' then
        self:_moveOneTile()
        if self:_moveOneTile() then
            self:_resetJumpActivate()
        end
    end

    if self.status == 'ready' then
        self.forJumpTime = self.forJumpTime + 1
        if self.forJumpTime == self.config.resetJumpTime then
            self.status = 'idle'
        elseif self.forJumpTime == self.config.resetJumpTime // 3 then
            self.sprite:nextFrame()
        elseif self.forJumpTime == 2 * self.config.resetJumpTime // 3 then
            self.sprite:nextFrame()
        end
    end

    if game.metronome.onBeat then
        self:_setPath() -- перенести на оддБит
        self:_onBeat()
    end

    self:_focusAnimations()
end

function Snowman:_createDeathEffect()
    local x = self.x
    local y = self.y

    local particleCount = math.random(self.config.deathParticleCountMin, self.config.deathParticleCountMax)
    local particleSpeed = self.config.deathAnimationParticleSpeed

    local function randomSide()
        return 2 * math.random() - 1
    end

    local function randomSpeed()
        return math.random(50, 150) / 100
    end

    particles = {}
    for i = 1, particleCount do
        local spawnx = x + randomSide()
        local spawny = y + randomSide()
        --particles are weak, bullets here
        particles[i] = Bullet:new(spawnx, spawny, self.config.deathParticleSprite)
        table.insert(game.updatables, particles[i])
        table.insert(game.drawables, particles[i])

        local dx = randomSide() * randomSpeed()
        local dy = randomSide() * randomSpeed()
        local vecLen = math.sqrt(dx * dx + dy * dy)
        if vecLen < self.config.deathAnimationParticleSpeedNormalizer then
            dx = dx * self.config.deathAnimationParticleSpeedNormalizer / vecLen
            dy = dy * self.config.deathAnimationParticleSpeedNormalizer / vecLen
        end
        particles[i]:setVelocity(particleSpeed * dx, particleSpeed * dy)
    end
end

function Snowman:die()
    trace("I AM DEAD!!!")
    table.removeElement(game.updatables, self)
    table.removeElement(game.drawables, self)
    table.removeElement(game.collideables, self)
    table.removeElement(game.enemies, self) -- именно этого ему не хватало, чтобы умереть спокойно
end

function Snowman:draw()
    if self.attackStatus == 'whirl' then
        self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
        self.whirlAttack:draw()
    end

    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
    if not (self.attackStatus == 'whirl') and self.taraxacum then
        self.taraxacum:draw()
    end

    self:_drawAnimations()

    -- circb(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.sleepDistanceToPlayer, 4)
end

-- MusicSnowman.lua
MusicSnowman = table.copy(Snowman)

-- И Сноумен ⛄ говорит:
-- ноль ноль один один один ноль
-- function MusicSnowman:tuning(beatMap, sfxMap)
function MusicSnowman:tuning(music)
    -- local sfxMap = music.sfxMap
    -- local beatMap = music.beatMap
    local sfxMap, beatMap
    if music.intro then
        sfxMap = music.intro.sfxMap
        beatMap = music.intro.beatMap
        self.reserveMusic = {}
        self.reserveMusic.sfxMap = music.sfxMap
        self.reserveMusic.beatMap = music.beatMap
    else
        sfxMap = music.sfxMap
        beatMap = music.beatMap
    end
    self.sfxMap = sfxMap
    self.sfxMapIndex = 1
    self.beatMap = beatMap
    self.beatMapIndex = 1
    self.pastAngle = 0

    if music.altBeatMap then
        self.altBeatMap = music.altBeatMap
        -- trace("!!!!!!!!!   "..#self.altBeatMap)
    end
end

function MusicSnowman:update()
    --if not self.awake then
    --    trace('not awake')
    --    return
    --end
    --trace('awake')
    -- trace('sdtp = ' .. self.sleepDistanceToPlayer .. ' x = ' .. self.x .. ' gpx = ' .. game.player.x .. 'distance = ' .. math.distance(self.x, self.y, game.player.x, game.player.y))
    if math.distance(self.x, self.y, game.player.x, game.player.y) >= self.sleepDistanceToPlayer then
        self.boxOfBirth:activate()
        return
    end

    if (#self.beatMap == 4 and game.metronome.beat4) or
       (#self.beatMap == 6 and game.metronome.beat6) or
       (#self.beatMap == 8 and game.metronome.beat8) then

        if not self.reserveMusic then
            self.beatMapIndex = (self.beatMapIndex % #self.beatMap) + 1
            if self.altBeatMap and self.beatMapIndex == 1 then
                local buf = table.copy(self.beatMap)
                self.beatMap = table.copy(self.altBeatMap)
                self.altBeatMap = buf
                -- trace(self.altBeatMap[1].." "..self.altBeatMap[2].." "..self.altBeatMap[3].." "..self.altBeatMap[4])
                -- trace(self.beatMap[1].." "..self.beatMap[2].." "..self.beatMap[3].." "..self.beatMap[4])
            end
        else
            self.beatMapIndex = self.beatMapIndex + 1
            if self.beatMapIndex > #self.beatMap then
                self:tuning(self.reserveMusic)
                self.reserveMusic = false
            end
        end

        if (self.beatMap[self.beatMapIndex] ~= 0) then
            --- АХХАХАХАХ ДУббяж кода 😜😋😱🤪🤪🤪
            self.whirlAttack = SnowmanWhirlAttack:new(self.hitbox:get_center().x, self.hitbox:get_center().y, self.taraxacum.h)
            self.whirlAttack.angle = self.pastAngle
            self.whirlAttack.snowman = self
            self.attackStatus = 'whirl'
            self.speed = self.config.speedWithWhirl

            local sound = self.sfxMap[self.sfxMapIndex]
            sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])

            self:_setPath()
            self.sfxMapIndex = (self.sfxMapIndex % #self.sfxMap) + 1
            self:_moveOneTile()
       else
            self.speed = self.config.speed
            self.attackStatus = 'idle'
            if self.whirlAttack then
                self.pastAngle = self.whirlAttack.angle
                self.whirlAttack:endAttack()
                self.whirlAttack = nil -- Чтобы жесткие ошибки 😱😱😷
           end
       end
    end

    if self.whirlAttack then
        self.pastAngle = self.whirlAttack.angle
    end

    self:_focusAnimations()

    if self.attackStatus == 'whirl' then
        self.whirlAttack:update()
        self.sprite = self.config.sprites.chill:copy()
        if self.theWay then
            self:_moveOneTile()
        end
    end

    if game.boomer.hitbox:collide(self.hitbox) then
        local damage = game.boomer.dpMs * Time.dt()
        self:takeDamage(damage)

        if self:isDeadCheck() then
            self.sprite = self.config.sprites.death:copy()
            return
        end
    end

    if self:isDeadCheck() then
        self.sprite:nextFrame()
        if self.sprite:animationEnd() then
            self:_createDeathEffect()
            self:die()
        end
        return
    end
end

-- SnowmanBox.lua
SnowmanBox = table.copy(Body)

function SnowmanBox:new(x, y, config)
    local object = {
        sprite = data.SnowmanBox.sleepSprite:copy(),
        snowman = MusicSnowman:new(x, y, config),
        snowmanConfig = config,
        x = x,
        y = y,
        playerCheckTimeMs = data.SnowmanBox.playerCheckFrequencyMs,
        wakeUpDistance = data.SnowmanBox.wakeUpDistanceToPlayer,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function SnowmanBox:newFake(x, y, config, snowman)
    local object = {
        sprite = data.SnowmanBox.sleepSprite:copy(),
        snowman = snowman,
        snowmanConfig = config,
        x = x,
        y = y,
        playerCheckTimeMs = data.SnowmanBox.playerCheckFrequencyMs,
        wakeUpDistance = data.SnowmanBox.wakeUpDistanceToPlayer,
    }

    setmetatable(object, self)
    self.__index = self
    return object
end

function SnowmanBox:activate()
    fakeBox = self:newFake(self.snowman.x, self.snowman.y, self.snowmanConfig, self.snowman)
    table.insert(game.updatables, fakeBox)
    table.insert(game.drawables, fakeBox)
    self.snowman:die()
end

function SnowmanBox:deactivate()
    table.removeElement(game.updatables, self)
end

function SnowmanBox:_distanceToPlayer()
    local dx = self.x - game.player.x
    local dy = self.y - game.player.y
    return math.sqrt(dx*dx + dy*dy)
end

function SnowmanBox:_spawnSnowman()
    self.snowman.awake = true
    self.snowman.boxOfBirth = self
    -- snowman:tuning(self.snowmanConfig.music.beatMap, self.snowmanConfig.music.sfxMap); -- Затюнил 🏎сноумена ☃
    self.snowman:tuning(self.snowmanConfig.music); -- Затюнил 🏎сноумена ☃
    self.snowman.x = self.x
    self.snowman.y = self.y
    table.insert(game.updatables, self.snowman)
    table.insert(game.drawables, self.snowman)
    table.insert(game.collideables, self.snowman)
    table.insert(game.enemies, self.snowman) -- всем привет, пока что он здесь не босс 👾
    self:deactivate()
end

function SnowmanBox:_changeSprite()
    self.sprite = data.SnowmanBox.wokeupSprite:copy()
end

function SnowmanBox:update()
    -- self.checkTimer() -- Можно использовать если метроном не оч 🙄🙄
    if game.metronome.onBeat and self:_distanceToPlayer() < self.wakeUpDistance then
        self:_spawnSnowman()
        self:_changeSprite()
    end
end

function SnowmanBox:draw()
    local x = self.x - gm.x*8 + gm.sx
    local y = self.y - gm.y*8 + gm.sy
    -- Никто не заставит меня вынести это в дату! 😈😈😈
    local whiteColor = 12
    rect(x + 3, y - 2, 11, 2, whiteColor)
    self.sprite:draw(x, y, self.flip, self.rotate)
    rect(x + 3, y + 16, 11, 2, whiteColor)
end

-- SnowmanWhirlAttack.lua
SnowmanWhirlAttack = {}

function SnowmanWhirlAttack:new(x, y, bodyLength)
    local endX = x + bodyLength
    local endY = y
    local object = {
        x = x,
        y = y,
        bodyLength = bodyLength,
        rotationSpeed = data.Snowman.whirl.rotationSpeed,
        particlesEmitDelayMs = data.Snowman.whirl.particleEmitDelayMs,
        angle = 0,
        taraxacum = JustTaraxacum:new(endX, endY),
    }

    local time = 0
    object.whirlParticleTimer = function()
        time = time + Time.dt()
        if time > object.particlesEmitDelayMs then
            time = 0
            return true
        end

        return false
    end

    setmetatable(object, self)
    self.__index = self
    return object
end

function SnowmanWhirlAttack:endAttack()
    local taraxacum = Taraxacum:new(
        self.x, self.y,
        data.Snowman.whirl.taraxacum.radius,
        data.Snowman.whirl.endTaraxacumSpeed,
        data.Snowman.whirl.taraxacum.deathBulletCount,
        data.Snowman.whirl.taraxacum.deathSlowBulletCount,
        data.Snowman.whirl.taraxacum.deathFastBulletCount
    )
    vec = aim.superAim(self.x, self.y, data.Snowman.whirl.endTaraxacumSpeed)
    taraxacum:setVelocity(vec.x, vec.y)
    table.insert(game.updatables, taraxacum)
    table.insert(game.drawables, taraxacum)
    self.snowman.taraxacum.status = 'needReload'
    -- 😚😚
end

function SnowmanWhirlAttack:_spawnParticle()
    local halfWhirlParticle = 8 / 2
    local endX = self.x - halfWhirlParticle + self.bodyLength * math.cos(self.angle)
    local endY = self.y - halfWhirlParticle + self.bodyLength * math.sin(self.angle)
    local whirl = Whirl:new(endX, endY, data.Snowman.whirl.fadeTimeMs)

    table.insert(game.updatables, whirl)
    table.insert(game.drawables, whirl)
end

function SnowmanWhirlAttack:update()
    self.angle = self.angle + self.rotationSpeed * Time.dt()
    local x = self.x + self.bodyLength * math.cos(self.angle)
    local y = self.y + self.bodyLength * math.sin(self.angle)
    self.taraxacum:setPos(x, y)
    self.taraxacum:update()

    if self.whirlParticleTimer() then
        self:_spawnParticle()
    end
end

function SnowmanWhirlAttack:draw()
    local x = self.x - 8 * gm.x + gm.sx
    local y = self.y - 8 * gm.y + gm.sy
    local endX = x + self.bodyLength * math.cos(self.angle)
    local endY = y + self.bodyLength * math.sin(self.angle)
    line(x, y, endX, endY, data.Snowman.specialTaraxacum.bodyColor)

    self.taraxacum:draw()

    local armLength = self.bodyLength / 3
    local armX = x + armLength * math.cos(self.angle)
    local armY = y + armLength * math.sin(self.angle)
    
    -- МАГИЧЕСКИЕ ЧИСЛА 👽👽👽👺
    -- left arm
    line(x - 2, y - 2, armX, armY, data.Snowman.color)
    -- right arm
    line(x + 2, y - 2, armX, armY, data.Snowman.color)
end


-- DoorMechanic.lua
-->door->wire->lever-->

DoorMechanic = {}

function DoorMechanic.findConnection(startX, startY) -- where we start searching
    local doorWiresLever = {
        door = nil, --{x = 1000000, y = 1000000, id = 'crutch'},
        lever = nil,
        wires = {},
    }

    doorWiresLever.lever = {x = startX, y = startY}
    for x = startX - 1, startX + 1 do -- будем искать только вокруг рычага
        for y = startY - 1, startY + 1 do
            local tileType = gm.getTileId(x, y)
            if table.contains(data.mapConstants.turnedOnWires, tileType) then
                DoorMechanic._walkWire(x, y, doorWiresLever)
                if doorWiresLever.door == nil or doorWiresLever.lever == nil then
                    trace("ERROR!! Couldn't find lever or door for wire at " .. x .. " " .. y)
                    return doorWiresLever
                else
                    return doorWiresLever
                end
            end
        end
    end
end

function DoorMechanic.findConnectionWithoutDoor(startX, startY) -- where we start searching
    local doorWiresLever = {
        door = {x = 1000000, y = 1000000, id = 'not a door, just a setting'},
        lever = nil,
        wires = {},
    }

    doorWiresLever.lever = {x = startX, y = startY}
    for x = startX - 1, startX + 1 do -- будем искать только вокруг рычага
        for y = startY - 1, startY + 1 do
            local tileType = gm.getTileId(x, y)
            if table.contains(data.mapConstants.turnedOnWires, tileType) then
                DoorMechanic._walkWire(x, y, doorWiresLever)
                --trace('rrrrrrrr')
                if doorWiresLever.door == nil or doorWiresLever.lever == nil then
                    trace("ERROR!! Couldn't find lever or door for wire at " .. x .. " " .. y)

                    return doorWiresLever
                else
                    --trace(doorWiresLever.door)
                    return doorWiresLever
                end
            end
        end
    end
end

function DoorMechanic._walkWire(x, y, doorWiresLever) -- _walkWireWhileDoor to be honest
    local tileType = gm.getTileId(x, y)
    if table.contains(data.mapConstants.doorIds, tileType) then
        if (doorWiresLever.door == nil) or ((x <= doorWiresLever.door.x) and (y <= doorWiresLever.door.y)) then
            doorWiresLever.door = { x = x, y = y, id = mget(x, y) }
            --trace('dr'..x..' '..y)
        end
    end

    --if table.contains(data.mapConstants.leverIds, tileType) then
    --    doorWiresLever.lever = { x = x, y = y }
    --end

    if not (table.contains(data.mapConstants.turnedOnWires, tileType) or table.contains(data.mapConstants.doorIds, tileType)) then
        return
    end

    local turnedOffWire = data.mapConstants.turnedOffWires[mget(x, y)]
    
    if table.contains(data.mapConstants.turnedOnWires, tileType) then
        table.insert(doorWiresLever.wires, {id = turnedOffWire, x = x, y = y })
        mset(x, y, turnedOffWire)
        DoorMechanic._walkWire(x + 1, y, doorWiresLever)
        DoorMechanic._walkWire(x - 1, y, doorWiresLever)
        DoorMechanic._walkWire(x, y + 1, doorWiresLever)
        DoorMechanic._walkWire(x, y - 1, doorWiresLever)

        DoorMechanic._walkWire(x + 1, y + 1, doorWiresLever)
        DoorMechanic._walkWire(x - 1, y + 1, doorWiresLever)
        DoorMechanic._walkWire(x + 1, y - 1, doorWiresLever)
        DoorMechanic._walkWire(x - 1, y - 1, doorWiresLever)
        return
    end

    DoorMechanic._walkWire(x - 1, y, doorWiresLever)
    DoorMechanic._walkWire(x, y - 1, doorWiresLever)
end

function DoorMechanic.doorOffset(door)
    local offset = data.mapConstants.doorOffsetsIds[door.id]
    return offset
end

-- function DoorMechanic:new()
--     DoorMechanic.findWires()
--     local doors = {}
--     local levers = {}

--     for i, pair in ipairs(doorWiresLever) do
--         mset(pair.lever.x, pair.lever.y, 0)

--         local doorOffset = DoorMechanic.doorOffset(pair.door)
--         local doorx = pair.door.x + doorOffset.x
--         local doory = pair.door.y + doorOffset.y

--         mset(doorx, doory, 0)
--         mset(doorx + 1, doory, 0)
--         mset(doorx, doory + 1, 0)
--         mset(doorx + 1, doory + 1, 0)

--         -- Сдвиг, потому что калитка ОГРОМНАЯ ༼ つ ◕_◕ ༽つ
--         doorx = doorx
--         doory = doory - 2

--         -- Дверь смотрит на то, включен ли рычаг
--         -- и сама себя переключает (?? (￣﹃￣))
--         local lever = Lever:new(pair.lever.x * 8, pair.lever.y * 8, nil, pair.wires)
--         local door = Door:new(doorx * 8, doory * 8, lever)

--         table.insert(doors, door)
--         table.insert(levers, lever)
--     end

--     local obj = {
--         doors = doors,
--         levers = levers
--     }

--     setmetatable(obj, self)
--     self.__index = self;
--     return obj
-- end


-- Lever.lua
Lever = table.copy(Body)

Lever.spriteOff = data.Lever.sprites.off -- is default
Lever.spriteOn = data.Lever.sprites.on

function Lever:new(x, y)
    local obj = {
        x = x,
        y = y - 3,
        wires = {},
        door = nil,
        sprite = Lever.spriteOff:copy(),
        hitbox = Hitbox:new(x, y - 3, x+8, y - 3+8),
        status = 'off'
    }

    --если мы хотим сделать плавное переключение проводов, нужно их сортировать

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Lever:_toogleWires()
    for _, wire in ipairs(self.wires) do
        local turnedOnWire = data.mapConstants.turnedOffWires[wire.id]
        local turnedOffWire = data.mapConstants.turnedOnWires[wire.id]

        if turnedOnWire ~= nil then
            wire.id = turnedOnWire
            mset(wire.x, wire.y, turnedOnWire)
        elseif turnedOffWire ~= nil then
            wire.id = turnedOffWire
            mset(wire.x, wire.y, turnedOffWire)
        end
    end
end

function Lever:_turn()
    if self.status == 'off' then
        self.sprite = Lever.spriteOn
        self.status = 'justOn'

        local sound = data.Player.sfx.leverOn
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])

        self:_toogleWires()
        self.door:statusUpdate('on')

        return
    elseif self.status == 'on' then
        self.sprite = Lever.spriteOff
        self.status = 'justOff'

        -- 🔊🤯
        local sound = data.Player.sfx.leverOff
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])

        self:_toogleWires()
        self.door:statusUpdate('off')
        
        return
    end
end

function Lever:update()
    if self.hitbox:collide(game.boomer.hitbox) then
        self:_turn()

    else
        if self.status == 'justOff' then
            self.status = 'off'
        elseif self.status == 'justOn' then
            self.status = 'on'
        end
    end
    
end

-- Door.lua
Door = table.copy(Body)

function Door:new(x, y) --калитка только из двух частей(
    local rectangleLeft = Rect:new(x, y, 8 * data.Door.widthTiles // 2, 8 * data.Door.heightTiles)
    local rectangleRight = Rect:new(rectangleLeft:right(), y, 8 * data.Door.widthTiles // 2, 8 * data.Door.heightTiles)
    local object1 = {
        x = x,
        y = y,

        crutch = false,
        Crutch = false, -- Брат близнец 👼💘

        rectL = rectangleLeft,
        rectR = rectangleRight,
        speed = data.Door.speed,
        status = 'closedFromStart',
        shakeTimer = 1,
        hitboxLeft = Hitbox:new(rectangleLeft:left(), rectangleLeft:up(), rectangleLeft:right(), rectangleLeft:down()),
        hitboxRight = Hitbox:new(rectangleRight:left(), rectangleRight:up(), rectangleRight:right(), rectangleRight:down()),

        solidTilesSpawned = true,
    }

    --shit code
    for addX = 0, data.Door.widthTiles - 1 do
        for addY = 0, data.Door.heightTiles - 1 do
            mset(x // 8 + addX, y // 8 + addY, data.Door.solidTileId)
        end
    end

    setmetatable(object1, self)
    self.__index = self
    return object1
end

-- Вызывается управляющим рычагом 😄
function Door:statusUpdate(leverStatus)
    if leverStatus == 'off' then
        self.status = 'close'
        self:_spawnBlockingTiles()
        game.camera:shakeByDoorStop()
    elseif leverStatus == 'on' then
        self.status = 'open'
        self:_despawnBlockingTiles()
    end
end

function Door:_colliding()
    if self.hitboxLeft:collide(game.player.hitbox) and self.hitboxRight:collide(game.player.hitbox) then
        game.player:die()
    elseif self.hitboxLeft:collide(game.player.hitbox) and
           (math.inRangeNotIncl(game.player.y, self.hitboxLeft.y1, self.hitboxLeft.y2) or
           (math.inRangeNotIncl(game.player.y + 8, self.hitboxLeft.y1, self.hitboxLeft.y2))) then
        game.player:move(self.speed, 0)
    elseif self.hitboxRight:collide(game.player.hitbox) and
           (math.inRangeNotIncl(game.player.y, self.hitboxRight.y1, self.hitboxRight.y2) or
           (math.inRangeNotIncl(game.player.y + 8, self.hitboxRight.y1, self.hitboxRight.y2))) then
        game.player:move(-self.speed, 0)
    end

    local boarderLeft = self.rectL.x + self.rectL.w
    local boarderRight = self.rectR.x
    if boarderRight - boarderLeft < 0.01 then
        -- 🔊🤯
        if not self.crutch then
            local sound = data.Player.sfx.closeDoor
            sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
            self.crutch = true
        end
        return
    end

    for _, collider in ipairs(game.enemies) do
        if self.hitboxLeft:collide(collider.hitbox) and self.hitboxRight:collide(collider.hitbox) then
            collider:die()
        elseif self.hitboxLeft:collide(collider.hitbox) and math.inRangeNotIncl(collider.y, self.hitboxLeft.y1, self.hitboxLeft.y2) then
            collider:move(self.speed, 0)
        elseif self.hitboxRight:collide(collider.hitbox) and math.inRangeNotIncl(collider.y, self.hitboxRight.y1, self.hitboxRight.y2) then
            collider:move(-self.speed, 0)
        end
    end
end

function Door:_closing()
    self:_colliding()

    local boarderLeft = self.x + self.rectL.w
    local boarderRight = self.x + self.rectR.w

    if math.floor(self.hitboxLeft.x2) < boarderLeft then
        self.rectL:moveLeftTo(self.rectL:left() + self.speed, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    elseif math.floor(self.hitboxLeft.x2) > boarderLeft then
        self.rectL:moveLeftTo(self.x, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    end

    if self.hitboxRight.x1 > boarderRight then
        self.rectR:move(-self.speed, 0)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    elseif self.hitboxRight.x1 < boarderRight then
        self.rectR:moveLeftTo(boarderRight)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    end

    if not (self.status == 'closedFromStart') then
        if self.hitboxLeft:collide(self.hitboxRight) then
            if self.shakeTimer >= data.Door.shakeTimeTics then
                if not self.Crutch then
                    game.camera:shakeByDoorStop()
                    self.Crutch = true;
                end
            else
                game.camera:shakeByDoor(0.7)
                self.Crutch = false;
                self.shakeTimer = self.shakeTimer + 1
            end
        end
    end

    self.speed = self.speed + data.Door.closingAcceleration
end

function Door:_opening() -- whers ending, i like it more!
    self.crutch = false
    self.shakeTimer = 1
    self.speed = data.Door.speed

    local boarderLeft = self.x + data.Door.closedGapInPixels
    local boarderRight = self.x + 2 * self.rectR.w - data.Door.closedGapInPixels

    if math.floor(self.hitboxLeft.x2) > boarderLeft then
        self.rectL:move(-self.speed, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    elseif math.floor(self.hitboxLeft.x2) < boarderLeft then
        self.rectL:moveRightTo(boarderLeft, 0)
        self.hitboxLeft:set_xy(self.rectL:left(), self.y)
    end

    if self.hitboxRight.x1 < boarderRight then
        self.rectR:move(self.speed, 0)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    elseif self.hitboxRight.x1 > boarderRight then
        self.rectR:moveLeftTo(boarderRight)
        self.hitboxRight:set_xy(self.rectR:left(), self.y)
    end
end

local UpperLeftTileX2 = data.Door.spriteTiles.upperLeft -- отсюда рисуем на два тайла вперёд!
local UpperRightTile = data.Door.spriteTiles.upperRight
local BottomRightTile = data.Door.spriteTiles.bottomRight

function Door:drawUpdate()
    local xleft = (self.rectL:left() - gm.x*8 + gm.sx)
    local yup = self.rectL:up() - gm.y*8 + gm.sy
    local xright = (self.rectR:left() - gm.x*8 + gm.sx)
    local ydownHalf = self.rectR:down() - self.rectR.w / 1.5 - gm.y*8 + gm.sy
    local w = 2 * self.rectL.w
    local h = self.rectL.h

    --LeftUpSide
    spr(UpperLeftTileX2, xleft, yup, C0, 1, 0, 0, 2, 2)
    spr(UpperRightTile, xleft + w // 3, yup, C0, 1, 0, 0, 1, 1)
    spr(BottomRightTile, xleft + w // 3, yup + (h // 2 - 8), C0, 1, 0, 0, 1, 1)
    --LeftLowSide
    spr(UpperLeftTileX2, xleft, ydownHalf, C0, 1, 2, 0, 2, 2)
    spr(BottomRightTile, xleft + w // 3, ydownHalf, C0, 1, 2, 0, 1, 1)
    spr(UpperRightTile, xleft + w // 3, ydownHalf + 8 * 1, C0, 1, 2, 0, 1, 1)
    --RightUpSide
    spr(UpperLeftTileX2, xright + w // 6, yup, C0, 1, 1, 0, 2, 2)
    spr(UpperRightTile, xright, yup, C0, 1, 1, 0, 1, 1)
    spr(BottomRightTile, xright, yup + (h // 2 - 8), C0, 1, 1, 0, 1, 1)
    --RightLowSide
    spr(UpperLeftTileX2, xright + w // 6, ydownHalf, C0, 1, 3, 0, 2, 2)
    spr(BottomRightTile, xright, ydownHalf, C0, 1, 3, 0, 1, 1)
    spr(UpperRightTile, xright, ydownHalf + 8 * 1, C0, 1, 3, 0, 1, 1)
end

function Door:draw()

end

function Door:_spawnBlockingTiles()
    if not self.solidTilesSpawned then
        for addX = 0, data.Door.widthTiles - 1 do
            for addY = 0, data.Door.heightTiles - 1 do
                mset(self.x // 8 + addX, self.y // 8 + addY, data.Door.solidTileId)
            end
        end
        self.solidTilesSpawned = true
    end
end

function Door:_despawnBlockingTiles()
    if self.solidTilesSpawned then
        for addX = 0, data.Door.widthTiles - 1 do
            for addY = 0, data.Door.heightTiles - 1 do
                mset(self.x // 8 + addX, self.y // 8 + addY, 0)
            end
        end
        self.solidTilesSpawned = false
    end
end

function Door:update()
    self:drawUpdate()
    if self.status == 'close' then
        self:_closing()
        --self:_spawnBlockingTiles()
    elseif self.status == 'open'then
        self:_opening()
        --self:_despawnBlockingTiles()
    end
end


-- EnemyFactory.lua
enemyFactory = {}

function enemyFactory.getConfig(tileID)
    return data.EnemyConfig[tileID]
end

local function addDebugValidation(t)
    wrapper = {t}
    local metatable = {
        __index = function(_, k)
            if t[k] == nil then
                error("Config value '" .. k .. "' is missing!")
            end
            return t[k]
        end
    }
    setmetatable(wrapper, metatable)
    return wrapper
end

-- Move to data
Rose.sprite = Sprite:new({389, 391, 393, 395, 397, 421}, 2)
Rose2sprite = Sprite:new({393, 395, -1, -1, -1, 275}, 2)

function enemyFactory.create(tileX, tileY, tileID)
    local x = 8 * tileX;
    local y = 8 * tileY;

    local config = enemyFactory.getConfig(tileID)
    config = addDebugValidation(config)
    local type = config.name

    -- Здесь раньше другое имя было
    -- Заметка(kawaii-Code): В идеальном мире всё так и будет работать.
    -- Однако мир не идеален. 🦍🦍
    -- 🤠☝

    if type == 'Enemy' then
        return Enemy:new(x, y)
    elseif type == 'StaticTaraxacum' then
        return StaticTaraxacum:new(x, y, config), {noCollisions = true}
    elseif type == 'Snowman' then
        return SnowmanBox:new(x, y, config, music), {noCollisions = true}
    elseif type == 'MusicRose' then
        local musicRose = MusicRose:new(x, y, config.direction, data.Rose.sprites, 1, config)
        -- musicRose:tuning(config.music.beatMap, config.music.sfxMap)
        musicRose:tuning(config.music)
        return musicRose
    elseif type == 'MusicWeakRose' then
        local musicRose = MusicRose:new(x, y, config.direction, data.WeakRose.sprites, 11, config)
        -- musicRose:tuning(config.music.beatMap, config.music.sfxMap)
        musicRose:tuning(config.music)
        return musicRose
    elseif type == 'MusicBulletHell' then
        local musicBulletHell = MusicBulletHell:new(x, y, config)
        -- musicBulletHell:tuning(config.music.beatMap, config.music.sfxMap)
        musicBulletHell:tuning(config.music)
        return musicBulletHell
    elseif type == 'MusicAutoBulletHell' then
        local musicAutoBulletHell = MusicAutoBulletHell:new(x, y, config)
        -- musicAutoBulletHell:tuning(config.music.beatMap, config.music.sfxMap)
        musicAutoBulletHell:tuning(config.music)
        return musicAutoBulletHell
    end
end


-- Checkpoint.lua
Checkpoint = table.copy(Body)

local status = {
    disabled = 0,
    enabled = 1,
    justUsed = 2,
    appearing = 3,
}

function Checkpoint:new(x, y)
    local obj = {
        x = x + 1,
        y = y + 1,
        sprite = data.Checkpoint.turnedOffSprite:copy(),
        turnOnAnimation = data.Checkpoint.turnOnAnimation,
        hitbox = Hitbox:new(
            x,
            y,
            x + data.Checkpoint.width,
            y + data.Checkpoint.height
        ),
        status = status.disabled,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Checkpoint:enable()
    self.sprite = data.Checkpoint.turnedOnSprite:copy()
    self.status = status.enabled
end

function Checkpoint:enableBeatiful()
    self.sprite = data.Checkpoint.turnOnAnimation:copy()
    self.status = status.appearing
end

function Checkpoint:disable()
    self.sprite = data.Checkpoint.turnedOffSprite:copy()
    self.status = status.disabled
end

function Checkpoint:use()
    self.sprite = data.Checkpoint.justUsedSprite:copy()
    self.status = status.justUsed
end

function Checkpoint:update()
    if self.status == status.disabled and self.hitbox:collide(game.boomer.hitbox) then
        -- 🔊 😍
        local sound = data.Player.sfx.checkpoint
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])
        self:enableBeatiful()
        game.save(self)
    end

    if self.status == status.appearing then
        if self.sprite:animationEnd() then
            self:enable()
        end
        self.sprite:nextFrame()
    end
end

-- Player.lua
Player = table.copy(Body)

Player.stayFront = data.Player.sprites.stayFront
Player.stayBack = data.Player.sprites.stayBack
Player.runFront = data.Player.sprites.runFront
Player.runBack = data.Player.sprites.runBack

Player.death = data.Player.sprites.death
Player.hat = data.Player.sprites.hat

function Player:new(x, y, boomerang)
    local obj = {
        sprite = Player.stayFront:copy(),
        startX = x,
        startY = y,
        verticalFlip = false,
        x = x,
        y = y,
        lastDx = 1, lastDy = 0,
        dx = 0,
        dy = 0,
        speed = data.Player.speed,
        flip = 0,  -- направление при отрисовке спрайта
        hitbox = Hitbox:new_with_shift(x, y, x+3, y+6, 2, 1), -- shift портит малину bfs
        boomerang = boomerang,
        boomerangActive = false,
        status = 'alive',
        deathDurationMs = data.Player.deathAnimationDurationMs,
        like_0xDEADBEEF = false,
    }

    setmetatable(obj, self)
    self.__index = self
        return obj
end

function Player:_willMoveCheck()
    self.dx = 0
    self.dy = 0 -- chill bro~~

    if game.key(KEY_W) then
        self.dy = self.dy - 1
    end
    if game.key(KEY_S) then
        self.dy = self.dy + 1
    end
    if game.key(KEY_A) then
        self.dx = self.dx - 1
    end
    if game.key(KEY_D) then
        self.dx = self.dx + 1
    end
end

function Player:_verticalFlipCalculator()
    local wasMoving = false
    if math.abs(self.dx) + math.abs(self.dy) ~= 0 then  -- was moving~
        wasMoving = true
    end

    if math.abs(self.dx) + math.abs(self.dy) ~= 0 then  -- is moving~
        self.lastDx = self.dx;
        self.lastDy = self.dy

        frame = self.sprite:getFrame()
        self.sprite:setFrame(frame)

        if self.dy < 0 and not self.verticalFlip then
            self.verticalFlip = true
            self.sprite = Player.runBack:copy();
        elseif self.dy > 0 and self.verticalFlip then
            self.verticalFlip = false
            self.sprite = Player.runFront:copy();
        end

        if not wasMoving or #self.sprite.animation == 1 then
            if self.verticalFlip then
                self.sprite = Player.runBack:copy()
            else
                self.sprite = Player.runFront:copy()
            end
        end
    else
        if self.verticalFlip then
            self.sprite = Player.stayBack:copy()
        else
            self.sprite = Player.stayFront:copy()
        end
    end
end

function Player:_horizontalFlipCalculator()
    if self.dx == -1 then
        self.flip = 1
    elseif self.dx == 1 then
        self.flip = 0
    end
end

function Player:_tryMove(movementNormalizer)
    local dx = self.dx * self.speed * movementNormalizer
    local dy = self.dy * self.speed * movementNormalizer

    if self:willCollideAfter(dx, dy) then
        if not self:willCollideAfter(dx, 0) then
            self:move(dx, 0)
        end
        if not self:willCollideAfter(0, dy) then
            self:move(0, dy)
        end
    else
        self:move(dx, dy)
    end

    local tilex = self.x // 8
    local tiley = self.y // 8
    for _, tile in ipairs(game.transitionTiles) do
        if tile.x == tilex and tile.y == tiley and game.playerArea ~= tile.area then
            game.playerArea = tile.area
            trace('Player transitioned into area ' .. game.playerArea)
        end
    end
end

function Player:_movementNormalizerGen()
    local movementNormalizer = data.Player.movementNormalizerStraight
    if self.dx * self.dy ~= 0 then
       movementNormalizer = data.Player.movementNormalizerDiagonal
    end
    return movementNormalizer
end

function Player:_shoot()
    self.boomerang.active = true
    self.boomerang.canBePickedUp = false

    if game.key(KEY_UP) then
        self.boomerang:init(self.x, self.y, C0, -1) -- С0 - яйца самого лучшего качества 
        return
    end
    if game.key(KEY_DOWN) then
        self.boomerang:init(self.x, self.y, C0, 1)
        return
    end
    if game.key(KEY_LEFT) then
        self.boomerang:init(self.x, self.y, -1, C0)
        return
    end
    if game.key(KEY_RIGHT) then
        self.boomerang:init(self.x, self.y, 1, C0)
        return
    end

    self.boomerang.active = false
end

function Player:_createDeathEffect()
    local x = self.x
    local y = self.y

    local particleCount = math.random(data.Player.deathParticleCountMin, data.Player.deathParticleCountMax)
    local particleSpeed = data.Player.deathAnimationParticleSpeed

    local function randomSide()
        return 2 * math.random() - 1
    end

    particles = {}
    for i = 1, particleCount do
        local spawnx = x + randomSide()
        local spawny = y + randomSide()
        particles[i] = Particle:new(spawnx, spawny, data.Player.deathParticleSprite)

        local dx = randomSide()
        local dy = randomSide()
        particles[i]:setVelocity(particleSpeed * dx, particleSpeed * dy)
    end
end

function Player:die()
    if self.status == 'dying' then
        return
    end

    self.sprite = Player.death:copy()
    self.sprite:setFrame(1)
    self:_createDeathEffect()
    local time = 0
    local step = self.deathDurationMs / #Player.death.animation
    self.deathTimer = function()
        time = time + Time.dt()
        self.sprite:setFrame(1 + time / step)
        return time > self.deathDurationMs
    end
    self.status = 'dying'
end

function Player:boomerangHandle()
    if not self.boomerang.active then
        self:_shoot() -- *dead*
    end
end

function Player:update()
    if self.status == 'dying' then
        isDead = self.deathTimer()
        if isDead then
            self.status = 'alive'
            game.restart()
        end
        return
    end

    if game.keyp(KEY_R) then
        -- Smert :)
        self:die()
        return
    end

    -- if keyp(KEY_B) then
    --     -- Metronome :(
    --     game.metronome.onBass = not game.metronome.onBass
    -- end

    -- if keyp(27) then
    --     sfx(0, 'D-2', -1, 0, 10, 0)
    --     -- trace('GNOADFNASDJV')
    -- end
    -- if keyp(28) then
    --     sfx(0, 'D-2', 10, 0, 10, 0)
    -- end
    -- if keyp(29) then
    --     sfx(0, 'D-2', 20, 0, 10, 0)
    -- end
    -- if keyp(30) then
    --     sfx(0, 'D-2', 30, 0, 10, 0)
    -- end
    -- if keyp(31) then
    --     sfx(0, 'D-2', 60, 0, 10, 0)
    -- end
    if not self.like_0xDEADBEEF then

        self:_willMoveCheck() -- wanna move?~

        self:_verticalFlipCalculator() -- will flip?

        self:_horizontalFlipCalculator() -- will flip??

        self.sprite:nextFrame()

        self:_tryMove(self:_movementNormalizerGen()) -- MOVED‼

        self:boomerangHandle() -- Boomer go brrrrr
    end
end

-- return Player

-- Bike.lua
Bike = table.copy(Body)

function Bike:new(x, y)
    local obj = {
        x = x,
        y = y,
        hitbox = Hitbox:new(x, y, x + 16, y + 16), -- left top again 😒
        sprite = data.Bike.sprites.waitingForHero:copy(),
        currentAnimations = {},
        status = 'forgotten',

        area = MapAreas.findAreaWithTile(x // 8, y // 8),
        cutscene = nil,
        beforeCutsceneTime = 0,
        beforeCutsceneMaxTime = 120,
        beforeBikeGoBR = 480,
        beforeBikeGoBRMaxTime = 640,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Bike:sparkle()
    trace('sparkling~~')
end

function Bike:_drawAnimations()
    --trace('yay2')
    for _, anime in ipairs(self.currentAnimations) do
        anime:play()
    end
end

function Bike:draw()
    --trace('yay')
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
    self:_drawAnimations()
    if self.cutscene then
        self.cutscene:draw()
    end
end

function Bike:_focusAnimations()
    local center = self.hitbox:get_center()
    local width = self.hitbox:getWidth()
    local height = self.hitbox:getHeight()
    -- чтобы анимация проигрывалась вокруг байканура где-то

    local x1 = center.x - width / 2
    local x2 = center.x + width / 2
    local y1 = center.y - height / 2
    local y2 = center.y + height / 2
    -- self.hitbox:draw(2)
    rect(x1,y1, x2 - x1, y2 - y1, 2)
    for _, anime in ipairs(self.currentAnimations) do
        anime:focus(x1, y1, x2, y2 - 8)
    end
end

function Bike:onStatus()
    --trace('heyday')

    rand = math.random(14)
    if rand == 7 then
        local anime = AnimationOver:new(table.chooseRandomElement(data.Bike.sprites.animations), 'randomOn', 'activeOnes')
        --need refactoring
        if anime.sprite.sprite == 457 or anime.sprite.animation ~= nil and anime.sprite.animation[1] == 457 then
            anime.right_sided = true
            anime.left_sided = false
        end
        table.insert(self.currentAnimations, anime)

        self:_focusAnimations()
    end
end



--TODO: CUT scene
function Bike:scene()
    
    
    --😈😈😈😈😈😈😈😈😈 - a bit laggy
    --for i = 1, 10000000 do
    --    if (true) then
    --        local lol = 1
    --    end
    --end
    --😈😈😈😈😈😈😈😈😈
    --game.player:die()
end

function Bike:endspiel()
    
end

function Bike:update()
    --trace('yay1')\

    if self.status == 'endgame' then
        self.beforeCutsceneTime = self.beforeCutsceneTime + 1
        self.beforeBikeGoBR = self.beforeBikeGoBR + 1
        if (self.beforeCutsceneTime > self.beforeCutsceneMaxTime and self.cutscene.TIMERCRUTCH) then --useless bigdata
            self.cutscene:updateGMXGMSXGMYGMSY()
            self.cutscene:make_smokkkkk()
            self.cutscene.TIMERCRUTCH = false
            self.cutscene.THENBIKEGOAWAY = true
        end
        if (self.beforeBikeGoBR > self.beforeBikeGoBRMaxTime and self.cutscene.THENBIKEGOAWAY) then
            self.cutscene:go_away()
        end
        self.cutscene:update()
        return
    end

    if self.status ~= 'endgame' and self.hitbox:collide(game.player.hitbox) then
        self.sprite = data.Bike.sprites.himAgain:copy()
        trace('Ugh, rolled around in the sandbox again, drunkard!😞')
        
        self.cutscene = CutScene:new(game.player, game.bike)
        self.cutscene:init()
        self.status = 'endgame' --yose
        return
    end

    if self.area == game.playerArea then
        self.status = 'blossomed'
    else
        self.status = 'forgotten'
    end

    if self.status == 'blossomed' then
        self:onStatus()
    end
end

-- Boomerang.lua
Boomerang = table.copy(Body)

boomerangSpinningSprite = data.Boomerang.sprites.spinning

function Boomerang:new(x, y, dx, dy)
    local obj = {  -- dx, dy in [-1, 1]
        sprite = boomerangSpinningSprite:copy(),
        x = x,
        y = y,
        dx = dx,
        dy = dy,
        canBePickedUp = false,
        speed = data.Boomerang.speed,
        flightNormalizer = data.Boomerang.flightNormalizerStraight,
        px = 0,
        jpy = 0,
        dpMs = data.Boomerang.damagePerMillisecond,
        hitbox = Hitbox:new_with_shift(-1000+2, -1000+2, -1000+6, -1000+6, 2, 2),
        active = false,
        status = 'going brrr',
        shakeOld = false,
    }
    obj.pickupTimer = Timer:new(900):onEnd(function() obj.canBePickedUp = true end)

    if obj['dx'] * obj['dy'] ~= 0 then
        obj['flightNormalizer'] = data.Boomerang.flightNormalizerDiagonal
    end
    obj['decelerationThing'] = obj['speed'] / data.Boomerang.decelerationConstant

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Boomerang:init(x, y, dx, dy)
    self.x = x; self.y = y
    self.dx = dx; self.dy = dy
    self.speed = data.Boomerang.speed
    self.pickupTimer:reset()
    if self.shakeOld then
        game.camera:shakeByBoomer(0.2)
        self.shaking = true
    end
end

function Boomerang:focus()
    self.px = game.player.x
    self.py = game.player.y
end

function Boomerang:update()
    -- trace(self.x.." "..self.y)
    if not self.active then
        return
    end

    self.sprite:nextFrame()

    self.pickupTimer:update()
    self.speed = self.speed - self.decelerationThing * Time.dt_in_60fps()

    if self.pickupTimer:ended() and self.hitbox:collide(game.player.hitbox) then
        if self.shakeOld or self.shaking then
            game.camera:shakeByBoomerStop()
            self.shaking = false
        end
        self.active = false
        self.hitbox:set_xy(-1000, -1000)
        return
    end

    if self.speed < 0 then
        self:focus()
        self:_reverseUpdate()
        return
    end

    local dx = self.speed * self.dx * self.flightNormalizer --* Time.dt_in_60fps()
    local dy = self.speed * self.dy * self.flightNormalizer --* Time.dt_in_60fps()

    self:moveUnclamped(dx, dy)
end

function Boomerang:_reverseUpdate()
    local fx = self.px
    local fy = self.py
    local x = self.x
    local y = self.y
    if fx == x then
        fx = fx + 0.0000001
    end
    d = math.abs(fy - y) / math.abs(fx - x)
    dx = self.speed / math.sqrt(1 + d*d) --* Time.dt_in_60fps()
    dy = dx*d --* Time.dt_in_60fps() -- xdd~~~

    local kx = 1
    local ky = 1
    if fx < x then
        kx = -1
    end
    if fy < y then
        ky = -1
    end

    local ddx = -1 * kx * dx  -- вторая производная хули ?!??!?!?!
    local ddy = -1 * ky * dy
    self:moveUnclamped(ddx, ddy)
end

function Boomerang:draw()
    if not self.active then
        return
    end
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
end


-- return Boomerang

-- CameraWindow.lua
CameraWindow = {}

function CameraWindow:new(deadZoneRect, target, targetWidth, targetHeight)
    local obj = {
        area = deadZoneRect,
        deadbeef = nil,
        target = target,
        targetWidth = targetWidth,
        targetHeight = targetHeight,
        we_are_shaking_for = 0,

        shakeMagnitude = {},
        statuses = {},
        status = 'normal',
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function CameraWindow:moveCamera()
    local centerX = math.floor(self.area:centerX())
    local centerY = math.floor(self.area:centerY())
    local tileX = math.floor(self.area:centerX() / 8)
    local tileY = math.floor(self.area:centerY() / 8)

    gm.x = tileX - math.floor(120 / 8)
    gm.sx = 8 * (tileX) - centerX

    gm.y = tileY - math.floor(68 / 8)
    gm.sy = 8 * (tileY) - centerY
end

function CameraWindow:centerOnTarget()
    local dx = self.target.x + self.targetWidth  / 2 - self.area:centerX()
    local dy = self.target.y + self.targetHeight / 2 - self.area:centerY()

    -- Чтобы не камера не дергалась, когда уже достигла игрока
    if math.abs(dx) < 1 and math.abs(dy) < 1 then
        return
    end

    local length = math.sqrt(dx * dx + dy * dy)

    dx = dx / length
    dy = dy / length

    self.area:move(dx * CAMERA_SPEED, dy * CAMERA_SPEED)
end

function CameraWindow:getDirectionToTarget()
    local dx, dy = 0, 0

    if self.area:isObjectRight(self.target, self.targetWidth) then
        dx = 1
    elseif self.area:isObjectLeft(self.target) then
        dx = -1
    end

    if self.area:isObjectBelow(self.target, self.targetHeight) then
        dy = 1
    elseif self.area:isObjectAbove(self.target) then
        dy = -1
    end

    return dx, dy
end

function CameraWindow:shakeByDoor(magnitude)
    if not self.statuses['doork'] then
        self.statuses['doork'] = true
    end
    self.shakeMagnitude['doork'] = magnitude
end

function CameraWindow:shakeByBoomer(magnitude)
    if not self.statuses['boomer'] then
        self.statuses['boomer'] = true
    end
    self.shakeMagnitude['boomer'] = magnitude
end

function CameraWindow:shake(magnitude)
    --self.status = 'shake'
    --self.shakeMagnitude = magnitude
    if not self.statuses['shake'] then
        self.statuses['shake'] = true
    end
    self.shakeMagnitude['shake'] = magnitude
end

function CameraWindow:shakeByDoorStop()
    self.statuses['doork'] = false
end

function CameraWindow:shakeByBoomerStop()
    self.statuses['boomer'] = false
end

--function CameraWindow:shakeStop() -- TODO fix conflict with many shakes 😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑
--    self.status = 'normal'
--end

local function oneOrMinusOne()
    return math.random(0, 1) == 0 and -1 or 1
end

function CameraWindow:update()
    local dx, dy = self:getDirectionToTarget()

    if self.area:isObjectInside(self.target, self.targetWidth, self.targetHeight) then
        self:centerOnTarget()
        -- Ура, я использовал goto!!!
        goto move
    end

    if dx < 0 then
        self.area:moveLeftTo(self.target.x)
    elseif dx > 0 then
        self.area:moveRightTo(self.target.x + self.targetWidth)
    end

    if dy < 0 then
        self.area:moveUpTo(self.target.y)
    elseif dy > 0 then
        self.area:moveDownTo(self.target.y + self.targetHeight)
    end

    ::move::

    local do_we_shake = false
    if self.statuses['doork'] then
        self.area:move(
            self.shakeMagnitude['doork'] * oneOrMinusOne(),
            self.shakeMagnitude['doork'] * oneOrMinusOne()
        )
        do_we_shake = true
    elseif self.statuses['boomer'] then
        self.area:move(
            self.shakeMagnitude['boomer'] * oneOrMinusOne(),
            self.shakeMagnitude['boomer'] * oneOrMinusOne()
        )
        -- do_we_shake = true
    elseif self.statuses['shake'] then
        self.area:move(
            self.shakeMagnitude['shake'] * oneOrMinusOne(),
            self.shakeMagnitude['shake'] * oneOrMinusOne()
        )
        do_we_shake = true
    end

    if do_we_shake then
        self.we_are_shaking_for = self.we_are_shaking_for + Time.dt()
        if self.we_are_shaking_for > 2.0 then
            -- trace("fuck you$$")
            self.statuses['doork'] = false
            self.statuses['boomer'] = false
            self.statuses['shake'] = false
        end
    else
        self.we_are_shaking_for = 0
    end

    --if self.status == 'shake' then
    --    self.area:move(
    --        self.shakeMagnitude['shake'] * oneOrMinusOne(),
    --        self.shakeMagnitude['shake'] * oneOrMinusOne()
    --    )
    --end
    self:moveCamera()
end

-- return CameraWindow

-- Settings.lua
settings = {}

	SettingLever = table.copy(Lever)

	SettingLever.spriteOff = data.SettingLever.sprites.off -- is default
	SettingLever.spriteOn = data.SettingLever.sprites.on

	function SettingLever:new(x, y, setting)
	    local obj = {
	        x = x,
	        y = y,
	        wires = {},
	        setting = nil,
	        sprite = SettingLever.spriteOff:copy(),
	        hitbox = Hitbox:new(x, y, x+8, y+8),
	        status = 'off'
	    }

	    setmetatable(obj, self)
	    self.__index = self
	    return obj
	end

	local function changeSetting(name)
		for i, set in ipairs(settings) do
			if set.name == name then
				set.change(set.state)
			end
		end
	end

	function SettingLever:_turn()
	    if self.status == 'off' then
	        self.sprite = SettingLever.spriteOn
	        self.status = 'justOn'

	        self:_toogleWires()
	        self.setting.state = true
	        changeSetting(self.setting.name)

	        return
	    elseif self.status == 'on' then
	        self.sprite = SettingLever.spriteOff
	        self.status = 'justOff'

	        self:_toogleWires()
	        self.setting.state = false
	        changeSetting(self.setting.name)
	        
	        return
	    end
	end

settings = {
	[1] = {name = 'oneBitPallete', state = false},
	[2] = {name = 'boomerShake', state = false},
}



settings[1].change = function (state) -- changes palette
	palette.toggle1Bit()
end

 settings[2].change = function (state) -- changes boomer shake
	game.boomer.shakeOld = state
end


-- Game.lua
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
    print(m_str .. ':' .. s_str .. '\n', 0, 1, 6, true, 1, true)
    -- Рамка
    -- rect(0, 0, 22, 7, 6)
    print(m_str .. ':' .. s_str .. '\n', 0, 0, 14, true, 1, true)
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

-- return game


function TIC()
    cls(C0)
    game.update()
end

// <TILES>
// 001:0000000000003000000333000011300000102000001020000010200002222220
// 002:0000000000000000030000003330000003300000000200000000200022222222
// 003:0000000000000000000000400000044400000440000020000002000022222222
// 004:3333333334444443340004433400004334000043340000433444444333333333
// 005:333333333aaaaaa33a000aa33a0000a33a0000a33a0000a33aaaaaa333333333
// 006:333333333777777337bbb77337bbbb7337bbbb7337bbbb733777777333333333
// 007:9999999999999999999999999999999999999999999999999999999999999999
// 008:9999999999999999999999999999999999999999999999999999999999999999
// 009:999999999999999999999999999999999999999c999999cc99999cca9999cca9
// 010:999cc99999cca9999cca9999cca99999ca999999a99999999999999999999999
// 012:1111111100333300000303000003330000030300003333000000000000000000
// 013:0000000000000000003333000003030000033300000303000033330011111111
// 014:1000000013333000103030001033300010303000133330001000000010000000
// 015:0000000100033331000030310000333100003031000333310000000100000001
// 016:0000000000000000000ee00000e00e0000e00e00000ee0000000000000000000
// 017:0000000000eeee000e0000e00e0000e00e0000e00e0000e000eeee0000000000
// 018:00eeee000e0000e0e000000ee000000ee000000ee000000e0e0000e000eeee00
// 019:1111111100eeee00000ee000000ee000000ee000000ee00000eeee0000000000
// 020:000000000eeeeee000ee0e0000ee0e0000ee0e0000ee0e000eeeeee011111111
// 021:100000001eeeeee010ee0e0011ee0e0011ee0e0011ee0e0011eeeee010000000
// 022:000000010eeeeee100ee0e0100ee0e0100ee0e0100ee0e010eeeee1100000011
// 023:9999999999999999999999999999999999999999ccccccccaccccccc9aaaaaaa
// 024:999999999999999999999999999999999999999cccccccccccccccccaaaaaaaa
// 025:999cca9999cca9999cca9999cca99999ca999999ccccccccccccccccaaaaaaaa
// 026:9999999999999999999999999999999999999999cccccccccccccccaaaaaaaa9
// 028:1111111100444400000404000004000000040400004444000000000000000000
// 029:0000000000000000004444000004040000040000000404000044440011111111
// 030:1000000014444000104040001040000010404000144440001000000010000000
// 031:0000000100044441000040410000400100004041000444410000000100000001
// 032:0000000000000000000ee00000ee0e0000e0ee00000ee0000000000000000000
// 033:0000000000eeee000ee0e0e00e0e0ee00ee0e0e00e0e0ee000eeee0000000000
// 034:00eeee000e0e0ee0e0e0e0eeee0e0e0ee0e0e0eeee0e0e0e0ee0e0e000eeee00
// 035:0000000000444400000440000004400000044000000440000044440000000000
// 036:0000000004444440004404000044040000440400004404000444444000000000
// 038:0770000010000000070ee000007eee0077eeee00000ee0000000000000000000
// 039:0770000070eeee0007eeeee00e7eeee077eeeee00eeeeee000eeee0000000000
// 040:077eee007eeeeee0e7eeeeeeee7eeeee77eeeeeeeeeeeeee0eeeeee000eeee00
// 041:70007000707070007777700077e77e0000eeee00000ee0000000000000000000
// 042:70007000707e7e0077777ee077e77ee00eeeeee00eeeeee000eeee0000000000
// 043:70ee7e007e7e7ee077777eee77e77eeeeeeeeeeeeeeeeeee0eeeeee000eeee00
// 044:1111111100333300000303000003000000030300003333000000000000000000
// 045:0000000000000000003333000003030000030000000303000033330011111111
// 046:1000000013333000103030001030000010303000133330001000000010000000
// 047:0000000100033331000030310000300100003031000333310000000100000001
// 048:0000000000000000000ee00000eeee0000eeee00000ee0000000000000000000
// 049:0000000000eeee000eeeeee00eeeeee00eeeeee00eeeeee000eeee0000000000
// 050:00eeee000eeeeee0eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0eeeeee000eeee00
// 051:0000555000055665000550050005555500055665000660060000000000000000
// 052:0005555000055665000555560005566500055556000666600000000000000000
// 053:0000555000055665000550060005500500065556000066600000000000000000
// 054:0005555000055665000550050005500500055556000666600000000000000000
// 055:0005555500055666000555500005566000055555000666660000000000000000
// 056:0005555500055666000555500005566000055000000660000000000000000000
// 057:0000555500055666000550550005506500065555000066660000000000000000
// 058:0005500500055005000555550005566500055005000660060000000000000000
// 059:0000555500006556000005500000055000005555000066660000000000000000
// 060:0005555500066655000000550005505500065556000066600000000000000000
// 061:0005500500055056000555600005565000055065000660060000000000000000
// 062:0005500000055000000550000005500000055555000666660000000000000000
// 063:0005505500055555000555550005656500050605000600060000000000000000
// 065:00000cc00000cccc0000cccc0000acc0000a000000a000000a000000a0000000
// 066:770cccc0007ccc7700c7c7cc00c77ccc007777cc007cc77007000077a0000007
// 067:0005500500055505000555550005565500055065000660060000000000000000
// 068:0000555000055665000550050005500500065556000066600000000000000000
// 069:0005555000055665000550050005555600055660000660000000000000000000
// 070:0000555000055665000550050005500500065556000066650000000600000000
// 071:0005555000055665000550050005555600055665000660060000000000000000
// 072:0000555500055566000655500000655500055556000666600000000000000000
// 073:0000555500006556000005500000055000000550000006600000000000000000
// 074:0005500500055005000550050005500500065556000066600000000000000000
// 075:0005500500055005000550050006555600006560000006000000000000000000
// 076:0005000500050505000555550005555500055655000660660000000000000000
// 077:0005500500055005000655560005566500055005000660060000000000000000
// 078:0000550500005505000055550000655600000550000006600000000000000000
// 079:0005555500066556000055600005560000055555000666660000000000000000
// 080:0000000000000000000dd00000d00d0000d00d00000dd0000000000000000000
// 081:0000000000dddd000d0000d00d0000d00d0000d00d0000d000dddd0000000000
// 082:00dddd000d0000d0d000000dd000000dd000000dd000000d0d0000d000dddd00
// 089:000000000aa000000a000aa00000aaa000000aa00aa000000000aa0000000000
// 090:000000000aaa0aa00aaa000000a00aa000000a0000aa00000aaa0aa000000000
// 091:0000550000005500000065000000060000000000000000000000000000000000
// 092:0000555000006550000005500000055000005555000066660000000000000000
// 093:0000000000555555005555550066666600000000000000000000000000000000
// 094:0000000000005000000555000056565000605060000050000000500000006000
// 095:0000000000005000000065000555555006666560000056000000600000000000
// 097:000ccc0000ccccc000ccccc000ccccc0000ccc000000a0000000a0000000a000
// 100:0a000a00a000a000a000a0000000a00a0a00a0a00a0000a00a0a00a00a0a0000
// 101:00000000a0a000a0a00a0a00000a0a00a00000000a000a000a000a0000000000
// 102:0000aa000000aa00000020000aa022a00aa200a0000200000000200000000000
// 103:0101000000100000010100000000200000002000000200000002000000000000
// 104:0000000000200020000202000022200002002200000200200002000000000000
// 105:00a000000aaa00a000000aa00aa000000aa0aaa00000aa000aa0000000000000
// 106:00000000aa00aaa00aa00aa00a000000000aaa000a00a0000aa0000000000000
// 107:0000555500006655000005560000066000000550000006600000000000000000
// 108:5555000066655000055560005566000055555000666660000000000000000000
// 109:0000000000000000000000000000550000005500000066000000000000000000
// 110:0000000000005000000050000000500000505050006555600006560000006000
// 111:0000000000005000000560000055555500656666000650000000600000000000
// 112:d000000d00000000000ee00000e00e0000e00e00000ee00000000000d000000d
// 113:d000000d00eeee000e0000e00e0000e00e0000e00e0000e000eeee00d000000d
// 114:d0eeee0d0e0000e0e000000ee000000ee000000ee000000e0e0000e0d0eeee0d
// 116:a00a0000a000a000a000a0000000a0a0a000a0a00a0000a00a0a00a00a0a0000
// 117:0a000000a00a0a00a00a0a00000a0a00000000000aa00aa00a000a0000000000
// 118:000aaa000000a00000a020a00aaa22a000a220a0000020000000200000000000
// 119:0000101000000100000010100000200000002000000200000002000000000000
// 120:0000000000200020000202000022200002002220000200000002000000000000
// 121:000000000aa00aa00aa0aaa0000000a00a0000000aaa0a000aa00aa000000000
// 122:000a000000aaa0000aaa00aa00000aa00a000aa00aa0000000a0aa000000a000
// 127:0000005500000055000000550000006600000055000000660000000000000000
// 128:d000000d00000000000ee00000e0ee0000ee0e00000ee00000000000d000000d
// 129:d000000d00eeee000e0e0ee00ee0e0e00e0e0ee00ee0e0e000eeee00d000000d
// 130:d0eeee0d0ee0e0e0ee0e0e0ee0e0e0eeee0e0e0ee0e0e0ee0e0e0ee0d0eeee0d
// 131:d000000d00000000000ee00000eeee0000eeee00000ee00000000000d000000d
// 132:d000000d00eeee000eeeeee00eeeeee00eeeeee00eeeeee000eeee00d000000d
// 133:d0eeee0d0eeeeee0eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0eeeeee0d0eeee0d
// 134:11111111bb0000bbbb00bb0bbb00bb0bbb00bb0bbb0000bbbbbbbbbbbbbbbbbb
// 135:bbbbbbbbbb0000bbbb00bb0bbb00bb0bbb00bb0bbb0000bbbbbbbbbb11111111
// 136:1bbbbbbb1b0000bb1b00bb0b1b00bb0b1b00bb0b1b0000bb1bbbbbbb1bbbbbbb
// 137:bbbbbbb1bb0000b1bb00bb01bb00bb01bb00bb01bb0000b1bbbbbbb1bbbbbbb1
// 140:0000000000000000000000000000000000000000000000000000008800008888
// 141:0000000000000000000000000000000000000000000000008800000088880000
// 142:009999990999999999999999999999990999999909999999999aa9a9999aaaaa
// 143:09999990999999999999999999999990999999909999999999a99999aaaaa990
// 144:000000000000020000000e000000e800000e800000e800000000000000000000
// 145:00000000000000000000020000000e000000e800000e800000e8000000000000
// 146:0000300000003000000030000000300000003000000030000000300000003000
// 147:0000000000000000000000000000000033333000000030000000300000003000
// 148:0000300000003000000030000000300033333000000000000000000000000000
// 150:11111111bb00000bbb00bbbbbb0000bbbb00bbb0bb00bbbbbbbbbbbbbbbbbbbb
// 151:bbbbbbbbbb00000bbb00bbbbbb0000bbbb00bbb0bb00bbbbbbbbbbbb11111111
// 152:1bbbbbbb1b00000b1b00bbbb1b0000bb1b00bbb01b00bbbb1bbbbbbb1bbbbbbb
// 153:bbbbbbb1b00000b1b00bbbb1b0000bb1b00bbb01b00bbbb1bbbbbbb1bbbbbbb1
// 154:0000000003000000003000000003777700044777004334000043440000044000
// 155:0000000000000300000033007773300077443000043340000434400000440000
// 156:0000022203000022003000880003778800044787004334000043440000044000
// 157:2220000082280300880033007773300077443000043340000434400000440000
// 158:0999aaaa099aaaaa999aaaaa9999aaaa0999aaaa9999aaaa999aaaaa099aaaaa
// 159:aaaaa999aaaa9999aaaa9999aaaaa990aaaa9999aaaaa990aaaaa990aaaa9999
// 160:00000000000099000009a0000090a00001101100011011000000000000000000
// 161:0000000000000000000099000009a0000090a000011011000110110000000000
// 162:0000000000000000000000000000000033333333000000000000000000000000
// 163:0000000000000000000000000000000000003333000030000000300000003000
// 164:0000300000003000000030000000300000003333000000000000000000000000
// 166:11111111bbbbbbbbbb0000bbb00bbbbbb00b00b0b00bb0bbbb0000bbbbbbbbbb
// 167:bbbbbbbbbbbbbbbbbb0000bbb00bbbbbb00b00b0b00bb0bbbb0000bb11111111
// 168:1bbbbbbb1bbbbbbb1b0000bb100bbbbb100b00b0100bb0bb1b0000bb1bbbbbbb
// 169:bbbbbbb1bbbbbbb1b0000bb100bbbbb100b00b0100bb0bb1b0000bb1bbbbbbb1
// 170:1111111100ccccc000cc000000cccc0000cc000c00cc00000000000000000000
// 171:0000000000ccccc000cc000000cccc0000cc000c00cc00000000000011111111
// 172:1000000010ccccc010cc000010cccc0010cc000c10cc00001000000010000000
// 173:000000010ccccc010cc000010cccc0010cc000c10cc000010000000100000001
// 174:000000000000000000eeee00001e1e0000eeee0000e1ee000000000000000000
// 175:000000000eeeeee00eeeeee00e1e1ee00eeeeee001e1e1e00e1e1ee000000000
// 176:00000000000000200000f200000f4f0000f4f400004f40000000000000000000
// 177:0000000000000000000000200000f200000f4f0000f4f400004f400000000000
// 178:0000400000004000000040000000400000004000000040000000400000004000
// 179:0000000000000000000000000000000044444000000040000000400000004000
// 180:0000400000004000000040000000400044444000000000000000000000000000
// 182:1111111100cccc0000cc00c000cc00c000cc00c000cccc000000000000000000
// 183:0000000000cccc0000cc00c000cc00c000cc00c000cccc000000000011111111
// 184:1000000010cccc0010cc00c010cc00c010cc00c010cccc001000000010000000
// 185:0000000100cccc0100cc00c100cc00c100cc00c100cccc010000000100000001
// 186:111111110000000000cccc000cc000000cc0cc0c0cc00c0000cccc0000000000
// 187:000000000000000000cccc000cc000000cc0cc0c0cc00c0000cccc0011111111
// 188:100000001000000010cccc001cc000001cc0cc0c1cc00c0010cccc0010000000
// 189:00000001000000010cccc001cc000001cc0cc0c1cc00c0010cccc00100000001
// 191:eeeeeeeeeeeeeeeeeeeeeeeeee1e1eeeeeeeeeeee1e1e1eeee1e1eeeeeeeeeee
// 192:000000000016190000111a0000616900009a9a00000000000000000000000000
// 193:00000000000000000016190000111a0000616900009a9a000000000000000000
// 194:0000000000000000000000000000000044444444000000000000000000000000
// 195:0000000000000000000000000000000000004444000040000000400000004000
// 196:0000400000004000000040000000400000004444000000000000000000000000
// 204:8888888802802802028028020280280202802802028028028288288202802802
// 205:8888888880280280802802808028028080280280802802808828828880280280
// 206:8888888828028028280280282802802828028028280280282882882828028028
// 208:00999099999999999999999909999999aa9999999a9999999999999999999999
// 209:90099099aa999999999999999999999999999999999999999999999999999999
// 210:0990990099999990999999999999999999999990999999a09999999099999999
// 211:8888888880000000800000008000000080000000800000008000000080000000
// 212:8800000008000000080000000800000008000000080000000800000008000000
// 213:0000000000000000000000000000000000000000000000008000000000000000
// 214:0000000000000000000000000000000000000000000000008800000000000000
// 215:0000000000000000000000000000000000000000800000008880000000000000
// 216:0000000000000000000000000000000000000000880000008888000000000000
// 217:0000000000000000000000000000000080000000888000008888800000000000
// 220:0280280202802802028028020280280282882882028028020280280202802802
// 221:8028028080280280802802808028028088288288802802808028028080280280
// 222:2802802828028028280280282802802828828828280280282802802828028028
// 224:999999999999999999999999099999990a999999099999990999999999999999
// 225:9999999999999999999999999999999999999999999999999999999999999999
// 226:999999909999999099999999999999999999999999999990999999a099999990
// 227:8888888800000000000000000000000000000000000000000000000000000000
// 228:8800000000000000000000000000000000000000000000000000000000000000
// 229:0000000000000000000000000000000088000000888800008888880000000000
// 230:0000000000000000000000008000000088800000888880008888888000000000
// 231:0000000000000000000000008800000088880000888888008888888800000000
// 232:0000000000000000800000008880000088888000888888888888888800000000
// 233:0000000000000000880000008888000088888888888888888888888800000000
// 236:111111110000000000cccc0000cc00c000cccc0000cc00c000cccc0000000000
// 237:000000000000000000cccc0000cc00c000cccc0000cc00c000cccc0011111111
// 238:100000001000000010cccc0010cc00c010cccc0010cc00c010cccc0010000000
// 239:000000010000000100cccc0100cc00c100cccc0100cc00c100cccc0100000001
// 240:999aa9a9099aaaa9999aaaaa999aaaaa99aaaaaa0a9aaaaa099aaaaa99a0aaaa
// 241:99aa9aa9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0aaaa00a
// 242:9aaaa990aaaaa9a0aaaa9990aaaa9999aaaaa999aaaaa990aaaa9990a00aa999
// 243:99aa9aa9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 245:0000000080000000888000088888808888888888888888888888888800000000
// 246:0000000888000008888800888888888888888888888888888888888800000000
// 247:8000008888800888888888888888888888888888888888888888888800000000
// 248:8888888888888888888888888888888888888888888888888888888800000000
// 249:8800008800000000880000888800008880000088080000888808808800000000
// 250:8888888888888888888888888888888888888888888888888888888888888888
// 252:111111110000000000ccccc000cc000000cccc0000cc000000ccccc000000000
// 253:000000000000000000ccccc000cc000000cccc0000cc000000ccccc011111111
// 254:100000001000000010ccccc010cc000010cccc0010cc000010ccccc010000000
// 255:000000010000000100ccccc100cc000100cccc0100cc000100ccccc100000001
// </TILES>

// <TILES1>
// 001:0000000000009000000999000011900000102000001020000010200002222220
// 002:0000000000000000090000009990000009200000000200000000200022222222
// 003:0000000000000000000000900000099900000290000020000002000022222222
// 004:3333333334444443340004433400004334000043340000433444444333333333
// 005:333333333aaaaaa33a000aa33a0000a33a0000a33a0000a33aaaaaa333333333
// 006:333333333777777337bbb77337bbbb7337bbbb7337bbbb733777777333333333
// 007:9999999999999999999999999999999999999999999999999999999999999999
// 008:9999999999999999999999999999999999999999999999999999999999999999
// 009:999999999999999999999999999999999999999c999999cc99999cca9999cca9
// 010:999cc99999cca9999cca9999cca99999ca999999a99999999999999999999999
// 012:1111111100333300000303000003330000030300003333000000000000000000
// 013:0000000000000000003333000003030000033300000303000033330011111111
// 014:1000000013333000103030001033300010303000133330001000000010000000
// 015:0000000100033331000030310000333100003031000333310000000100000001
// 016:0000000000000000000ee00000e00e0000e00e00000ee0000000000000000000
// 017:0000000000eeee000e0000e00e0000e00e0000e00e0000e000eeee0000000000
// 018:00eeee000e0000e0e000000ee000000ee000000ee000000e0e0000e000eeee00
// 019:1111111100eeee00000ee000000ee000000ee000000ee00000eeee0000000000
// 020:000000000eeeeee000ee0e0000ee0e0000ee0e0000ee0e000eeeeee011111111
// 021:100000001eeeeee010ee0e0011ee0e0011ee0e0011ee0e0011eeeee010000000
// 022:000000010eeeeee100ee0e0100ee0e0100ee0e0100ee0e010eeeee1100000011
// 023:9999999999999999999999999999999999999999ccccccccaccccccc9aaaaaaa
// 024:999999999999999999999999999999999999999cccccccccccccccccaaaaaaaa
// 025:999cca9999cca9999cca9999cca99999ca999999ccccccccccccccccaaaaaaaa
// 026:9999999999999999999999999999999999999999cccccccccccccccaaaaaaaa9
// 028:1111111100444400000404000004000000040400004444000000000000000000
// 029:0000000000000000004444000004040000040000000404000044440011111111
// 030:1000000014444000104040001040000010404000144440001000000010000000
// 031:0000000100044441000040410000400100004041000444410000000100000001
// 032:0000000000000000000ee00000ee0e0000e0ee00000ee0000000000000000000
// 033:0000000000eeee000ee0e0e00e0e0ee00ee0e0e00e0e0ee000eeee0000000000
// 034:00eeee000e0e0ee0e0e0e0eeee0e0e0ee0e0e0eeee0e0e0e0ee0e0e000eeee00
// 035:0000000000444400000440000004400000044000000440000044440000000000
// 036:0000000004444440004404000044040000440400004404000444444000000000
// 038:0770000010000000070ee000007eee0077eeee00000ee0000000000000000000
// 039:0770000070eeee0007eeeee00e7eeee077eeeee00eeeeee000eeee0000000000
// 040:077eee007eeeeee0e7eeeeeeee7eeeee77eeeeeeeeeeeeee0eeeeee000eeee00
// 041:70007000707070007777700077e77e0000eeee00000ee0000000000000000000
// 042:70007000707e7e0077777ee077e77ee00eeeeee00eeeeee000eeee0000000000
// 043:70ee7e007e7e7ee077777eee77e77eeeeeeeeeeeeeeeeeee0eeeeee000eeee00
// 044:1111111100333300000303000003000000030300003333000000000000000000
// 045:0000000000000000003333000003030000030000000303000033330011111111
// 046:1000000013333000103030001030000010303000133330001000000010000000
// 047:0000000100033331000030310000300100003031000333310000000100000001
// 048:0000000000000000000ee00000eeee0000eeee00000ee0000000000000000000
// 049:0000000000eeee000eeeeee00eeeeee00eeeeee00eeeeee000eeee0000000000
// 050:00eeee000eeeeee0eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0eeeeee000eeee00
// 051:0000555000055665000550050005555500055665000660060000000000000000
// 052:0005555000055665000555560005566500055556000666600000000000000000
// 053:0000555000055665000550060005500500065556000066600000000000000000
// 054:0005555000055665000550050005500500055556000666600000000000000000
// 055:0005555500055666000555500005566000055555000666660000000000000000
// 056:0005555500055666000555500005566000055000000660000000000000000000
// 057:0000555500055666000550550005506500065555000066660000000000000000
// 058:0005500500055005000555550005566500055005000660060000000000000000
// 059:0000555500006556000005500000055000005555000066660000000000000000
// 060:0005555500066655000000550005505500065556000066600000000000000000
// 061:0005500500055056000555600005565000055065000660060000000000000000
// 062:0005500000055000000550000005500000055555000666660000000000000000
// 063:0005505500055555000555550005656500050605000600060000000000000000
// 065:00000cc00000cccc0000cccc0000acc0000a000000a000000a000000a0000000
// 066:000cccc000cccccc00cccccc00cccccc00cccccc00acccc00a000000a0000000
// 067:0005500500055505000555550005565500055065000660060000000000000000
// 068:0000555000055665000550050005500500065556000066600000000000000000
// 069:0005555000055665000550050005555600055660000660000000000000000000
// 070:0000555000055665000550050005500500065556000066650000000600000000
// 071:0005555000055665000550050005555600055665000660060000000000000000
// 072:0000555500055566000655500000655500055556000666600000000000000000
// 073:0000555500006556000005500000055000000550000006600000000000000000
// 074:0005500500055005000550050005500500065556000066600000000000000000
// 075:0005500500055005000550050006555600006560000006000000000000000000
// 076:0005000500050505000555550005555500055655000660660000000000000000
// 077:0005500500055005000655560005566500055005000660060000000000000000
// 078:0000550500005505000055550000655600000550000006600000000000000000
// 079:0005555500066556000055600005560000055555000666660000000000000000
// 080:0000000000000000000dd00000d00d0000d00d00000dd0000000000000000000
// 081:0000000000dddd000d0000d00d0000d00d0000d00d0000d000dddd0000000000
// 082:00dddd000d0000d0d000000dd000000dd000000dd000000d0d0000d000dddd00
// 089:000000000aa000000a000aa00000aaa000000aa00aa000000000aa0000000000
// 090:000000000aaa0aa00aaa000000a00aa000000a0000aa00000aaa0aa000000000
// 091:0000550000005500000065000000060000000000000000000000000000000000
// 092:0000555000006550000005500000055000005555000066660000000000000000
// 093:0000000000555555005555550066666600000000000000000000000000000000
// 094:0000000000005000000555000056565000605060000050000000500000006000
// 095:0000000000005000000065000555555006666560000056000000600000000000
// 097:000ccc0000ccccc000ccccc000ccccc0000ccc000000a0000000a0000000a000
// 100:0a000a00a000a000a000a0000000a00a0a00a0a00a0000a00a0a00a00a0a0000
// 101:00000000a0a000a0a00a0a00000a0a00a00000000a000a000a000a0000000000
// 102:0000aa000000aa00000020000aa022a00aa200a0000200000000200000000000
// 103:0101000000100000010100000000200000002000000200000002000000000000
// 104:0000000000200020000202000022200002002200000200200002000000000000
// 105:00a000000aaa00a000000aa00aa000000aa0aaa00000aa000aa0000000000000
// 106:00000000aa00aaa00aa00aa00a000000000aaa000a00a0000aa0000000000000
// 107:0000555500006655000005560000066000000550000006600000000000000000
// 108:5555000066655000055560005566000055555000666660000000000000000000
// 109:0000000000000000000000000000550000005500000066000000000000000000
// 110:0000000000005000000050000000500000505050006555600006560000006000
// 111:0000000000005000000560000055555500656666000650000000600000000000
// 112:d000000d00000000000ee00000e00e0000e00e00000ee00000000000d000000d
// 113:d000000d00eeee000e0000e00e0000e00e0000e00e0000e000eeee00d000000d
// 114:d0eeee0d0e0000e0e000000ee000000ee000000ee000000e0e0000e0d0eeee0d
// 116:a00a0000a000a000a000a0000000a0a0a000a0a00a0000a00a0a00a00a0a0000
// 117:0a000000a00a0a00a00a0a00000a0a00000000000aa00aa00a000a0000000000
// 118:000aaa000000a00000a020a00aaa22a000a220a0000020000000200000000000
// 119:0000101000000100000010100000200000002000000200000002000000000000
// 120:0000000000200020000202000022200002002220000200000002000000000000
// 121:000000000aa00aa00aa0aaa0000000a00a0000000aaa0a000aa00aa000000000
// 122:000a000000aaa0000aaa00aa00000aa00a000aa00aa0000000a0aa000000a000
// 127:0000005500000055000000550000006600000055000000660000000000000000
// 128:d000000d00000000000ee00000e0ee0000ee0e00000ee00000000000d000000d
// 129:d000000d00eeee000e0e0ee00ee0e0e00e0e0ee00ee0e0e000eeee00d000000d
// 130:d0eeee0d0ee0e0e0ee0e0e0ee0e0e0eeee0e0e0ee0e0e0ee0e0e0ee0d0eeee0d
// 131:d000000d00000000000ee00000eeee0000eeee00000ee00000000000d000000d
// 132:d000000d00eeee000eeeeee00eeeeee00eeeeee00eeeeee000eeee00d000000d
// 133:d0eeee0d0eeeeee0eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0eeeeee0d0eeee0d
// 134:11111111bb0000bbbb00bb0bbb00bb0bbb00bb0bbb0000bbbbbbbbbbbbbbbbbb
// 135:bbbbbbbbbb0000bbbb00bb0bbb00bb0bbb00bb0bbb0000bbbbbbbbbb11111111
// 136:1bbbbbbb1b0000bb1b00bb0b1b00bb0b1b00bb0b1b0000bb1bbbbbbb1bbbbbbb
// 137:bbbbbbb1bb0000b1bb00bb01bb00bb01bb00bb01bb0000b1bbbbbbb1bbbbbbb1
// 140:0000000000000000000000000000000000000000000000000000008800008888
// 141:0000000000000000000000000000000000000000000000008800000088880000
// 142:009999990999999999999999999999990999999909999999999aa9a9999aaaaa
// 143:09999990999999999999999999999990999999909999999999a99999aaaaa990
// 144:000000000000020000000e000000e800000e800000e800000000000000000000
// 145:00000000000000000000020000000e000000e800000e800000e8000000000000
// 146:0000300000003000000030000000300000003000000030000000300000003000
// 147:0000000000000000000000000000000033333000000030000000300000003000
// 148:0000300000003000000030000000300033333000000000000000000000000000
// 150:11111111bb00000bbb00bbbbbb0000bbbb00bbb0bb00bbbbbbbbbbbbbbbbbbbb
// 151:bbbbbbbbbb00000bbb00bbbbbb0000bbbb00bbb0bb00bbbbbbbbbbbb11111111
// 152:1bbbbbbb1b00000b1b00bbbb1b0000bb1b00bbb01b00bbbb1bbbbbbb1bbbbbbb
// 153:bbbbbbb1b00000b1b00bbbb1b0000bb1b00bbb01b00bbbb1bbbbbbb1bbbbbbb1
// 154:0000000003000000003000000003777700044777004334000043440000044000
// 155:0000000000000300000033007773300077443000043340000434400000440000
// 156:0000022203000022003000880003778800044787004334000043440000044000
// 157:2220000082280300880033007773300077443000043340000434400000440000
// 158:0999aaaa099aaaaa999aaaaa9999aaaa0999aaaa9999aaaa999aaaaa099aaaaa
// 159:aaaaa999aaaa9999aaaa9999aaaaa990aaaa9999aaaaa990aaaaa990aaaa9999
// 160:00000000000099000009a0000090a00001101100011011000000000000000000
// 161:0000000000000000000099000009a0000090a000011011000110110000000000
// 162:0000000000000000000000000000000033333333000000000000000000000000
// 163:0000000000000000000000000000000000003333000030000000300000003000
// 164:0000300000003000000030000000300000003333000000000000000000000000
// 166:11111111bbbbbbbbbb0000bbb00bbbbbb00b00b0b00bb0bbbb0000bbbbbbbbbb
// 167:bbbbbbbbbbbbbbbbbb0000bbb00bbbbbb00b00b0b00bb0bbbb0000bb11111111
// 168:1bbbbbbb1bbbbbbb1b0000bb100bbbbb100b00b0100bb0bb1b0000bb1bbbbbbb
// 169:bbbbbbb1bbbbbbb1b0000bb100bbbbb100b00b0100bb0bb1b0000bb1bbbbbbb1
// 170:1111111100ccccc000cc000000cccc0000cc000c00cc00000000000000000000
// 171:0000000000ccccc000cc000000cccc0000cc000c00cc00000000000011111111
// 172:1000000010ccccc010cc000010cccc0010cc000c10cc00001000000010000000
// 173:000000010ccccc010cc000010cccc0010cc000c10cc000010000000100000001
// 174:000000000000000000eeee00001e1e0000eeee0000e1ee000000000000000000
// 175:000000000eeeeee00eeeeee00e1e1ee00eeeeee001e1e1e00e1e1ee000000000
// 176:00000000000000200000f200000f4f0000f4f400004f40000000000000000000
// 177:0000000000000000000000200000f200000f4f0000f4f400004f400000000000
// 178:0000400000004000000040000000400000004000000040000000400000004000
// 179:0000000000000000000000000000000044444000000040000000400000004000
// 180:0000400000004000000040000000400044444000000000000000000000000000
// 182:1111111100cccc0000cc00c000cc00c000cc00c000cccc000000000000000000
// 183:0000000000cccc0000cc00c000cc00c000cc00c000cccc000000000011111111
// 184:1000000010cccc0010cc00c010cc00c010cc00c010cccc001000000010000000
// 185:0000000100cccc0100cc00c100cc00c100cc00c100cccc010000000100000001
// 186:111111110000000000cccc000cc000000cc0cc0c0cc00c0000cccc0000000000
// 187:000000000000000000cccc000cc000000cc0cc0c0cc00c0000cccc0011111111
// 188:100000001000000010cccc001cc000001cc0cc0c1cc00c0010cccc0010000000
// 189:00000001000000010cccc001cc000001cc0cc0c1cc00c0010cccc00100000001
// 191:eeeeeeeeeeeeeeeeeeeeeeeeee1e1eeeeeeeeeeee1e1e1eeee1e1eeeeeeeeeee
// 192:000000000016190000111a0000616900009a9a00000000000000000000000000
// 193:00000000000000000016190000111a0000616900009a9a000000000000000000
// 194:0000000000000000000000000000000044444444000000000000000000000000
// 195:0000000000000000000000000000000000004444000040000000400000004000
// 196:0000400000004000000040000000400000004444000000000000000000000000
// 204:8888888802802802028028020280280202802802028028028288288202802802
// 205:8888888880280280802802808028028080280280802802808828828880280280
// 206:8888888828028028280280282802802828028028280280282882882828028028
// 208:00999099999999999999999909999999aa9999999a9999999999999999999999
// 209:90099099aa999999999999999999999999999999999999999999999999999999
// 210:0990990099999990999999999999999999999990999999a09999999099999999
// 211:8888888880000000800000008000000080000000800000008000000080000000
// 212:8800000008000000080000000800000008000000080000000800000008000000
// 213:0000000000000000000000000000000000000000000000008000000000000000
// 214:0000000000000000000000000000000000000000000000008800000000000000
// 215:0000000000000000000000000000000000000000800000008880000000000000
// 216:0000000000000000000000000000000000000000880000008888000000000000
// 217:0000000000000000000000000000000080000000888000008888800000000000
// 220:0280280202802802028028020280280282882882028028020280280202802802
// 221:8028028080280280802802808028028088288288802802808028028080280280
// 222:2802802828028028280280282802802828828828280280282802802828028028
// 224:999999999999999999999999099999990a999999099999990999999999999999
// 225:9999999999999999999999999999999999999999999999999999999999999999
// 226:999999909999999099999999999999999999999999999990999999a099999990
// 227:8888888800000000000000000000000000000000000000000000000000000000
// 228:8800000000000000000000000000000000000000000000000000000000000000
// 229:0000000000000000000000000000000088000000888800008888880000000000
// 230:0000000000000000000000008000000088800000888880008888888000000000
// 231:0000000000000000000000008800000088880000888888008888888800000000
// 232:0000000000000000800000008880000088888000888888888888888800000000
// 233:0000000000000000880000008888000088888888888888888888888800000000
// 236:111111110000000000cccc0000cc00c000cccc0000cc00c000cccc0000000000
// 237:000000000000000000cccc0000cc00c000cccc0000cc00c000cccc0011111111
// 238:100000001000000010cccc0010cc00c010cccc0010cc00c010cccc0010000000
// 239:000000010000000100cccc0100cc00c100cccc0100cc00c100cccc0100000001
// 240:999aa9a9099aaaa9999aaaaa999aaaaa99aaaaaa0a9aaaaa099aaaaa99a0aaaa
// 241:99aa9aa9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0aaaa00a
// 242:9aaaa990aaaaa9a0aaaa9990aaaa9999aaaaa999aaaaa990aaaa9990a00aa999
// 243:99aa9aa9aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// 245:0000000080000000888000088888808888888888888888888888888800000000
// 246:0000000888000008888800888888888888888888888888888888888800000000
// 247:8000008888800888888888888888888888888888888888888888888800000000
// 248:8888888888888888888888888888888888888888888888888888888800000000
// 249:8800008800000000880000888800008880000088080000888808808800000000
// 250:8888888888888888888888888888888888888888888888888888888888888888
// 252:111111110000000000ccccc000cc000000cccc0000cc000000ccccc000000000
// 253:000000000000000000ccccc000cc000000cccc0000cc000000ccccc011111111
// 254:100000001000000010ccccc010cc000010cccc0010cc000010ccccc010000000
// 255:000000010000000100ccccc100cc000100cccc0100cc000100ccccc100000001
// </TILES1>

// <SPRITES>
// 000:0000000000888800888888880222222000228220088888008088880000088000
// 001:0000000000888800888888880222222000228220088888008088880000800800
// 002:0088880088888888022222200022822008888800808888000800008000000000
// 003:0088880088888888000888000222222000228220088888008088880000800800
// 004:8800000088000000000000000000000000000000000000000000000000000000
// 005:8008000008008000088888000808080008888800088888000088800000080000
// 006:8008000008008000088888000808080008808800088088000088800000080000
// 007:8008000008008000088888000808080008808800088088000088800000000000
// 008:0000000000000000000888000088000000800000008000000000000000000000
// 009:0000000000000000008880000000880000000800000008000000000000000000
// 010:0000000000000000000008000000080000008800008880000000000000000000
// 011:0800000080800000080000000000000000000000000000000000000000000000
// 012:8080000000000000808000000000000000000000000000000000000000000000
// 013:8000000000000000000000000000000000000000000000000000000000000000
// 016:0000000000888800888888880088800000888800088880008088880000800000
// 017:0000000000888800888888880088800000880800088880008088080000800000
// 018:0000000000888800888888880080800000880800088080008088080000800000
// 019:0000000000888800888888880080800000080800088080008008080000800000
// 020:0000000000888800888888880000800000080000008080008008000000800000
// 021:0000000000000000000000000000000000000000000000000000000b00000000
// 022:0000000000000000000000000000000000000000000000000bb00000b0000000
// 023:0000000000000000000000000000000000000000000000000000000b00000000
// 024:00000000000000000000000000000000000000000000000000000000b0000000
// 032:0000000008008000088888000808080008808800088088000088800000000000
// 033:0000000000000000088880000808080008808800088088000088800000000000
// 034:0000000000000000008880000808080008808800008088000088000000000000
// 035:0000000000000000008080000808080000808000008080000008000000000000
// 036:0000000000000000008080000800000000808000000000000008000000000000
// 037:000bb0000000bb000000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 038:00000000000b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 039:000bb0000000bb000000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 040:00000000000b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 041:000bb0000000bb000000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 042:00000000000b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 043:0000000000000000000000000000000000000000000000000000000b000000bb
// 044:00000000000b000000bb00000bbb00000bbb0000bbb00000bbb00000b0000000
// 050:000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc00000c0c
// 051:c0000000cc000000cc000000cc00c000cc00c000cc0c0000ccc00000cc000000
// 052:0000000000555550555555505550000055000000550000005500000055000000
// 053:0000000000055555000555550005505500055005005550000055000000550000
// 054:0000555500005555500000005500000055000005550000055500000555000005
// 055:5555550055555555555555555500000055000550500055555005555550055555
// 056:000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc0000000c
// 057:c0000000cc000000cc000000cc000000cc000000cc000000ccc00000cc000000
// 058:00000000000000cc00000ccc00000ccc000000cc0000000c000ccccc0000000c
// 059:00000000c0000000cc000000cc000000cc000000cc000000ccccc000cc000c00
// 060:000000cc00000ccc00000ccc000c0ccc000c00cc0000c00c00000ccc0000000c
// 061:c0000000cc000000cc000000cc000000cc000000cc000000ccc00000cc0c0000
// 062:00000000000000cc00000ccc00000ccc000000cc0000000c000ccccc00c0000c
// 063:00000000c0000000cc000000cc000000cc000000cc000000cccccc00cc000000
// 066:0000c00c0000c00c0000000c000000c0000000c0000000c0000000c0000000c0
// 067:cc000000cc0000000c0000000cc0000000c0000000c0000000c0000000c00000
// 068:5500555055005555550005555500005555000055555555555555555500000000
// 069:0055000000550005005550055055505550055055500555550005555000000000
// 070:5500000555000005500000055000000550000005000000050000000500000000
// 071:5005505550055055500550555005505550055055500550555005555500055555
// 072:0000000c0000000c0000000c000000c0000000c0000000c0000000c0000000c0
// 073:cc000000cc0000000c0000000cc0000000c0000000c0000000c0000000c00000
// 074:0000000c0000000c0000000c000000c0000000c0000000cc000000c0000000c0
// 075:cc000000cc0000000c0000000c000000c000000000000000c000000000000000
// 076:0000000c0000000c0000000c000000c0000000c00000000c0000000c000000c0
// 077:cc00c000cc00c0000c0000000c000000c0000000c000000000000000c0000000
// 078:0000000c0000000c0000000c000000c0000000c0000000c0000000c0000000c0
// 079:cc000000cc0000000c0000000c00000000c0000000c0000000c0000000c00000
// 084:0000000000000000555555505555555555000555550000555500055555555555
// 085:0000000000000000000555500005555000005500000055000005550000055500
// 086:0000000000000000055000000550005505500555055055550550555005555500
// 087:0000555000000000000000000055555500555555005500000055000005550000
// 088:00000000000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc
// 089:00000000c0000000cc000000cc000000cc000000cc000000cc000000ccc00000
// 090:0000000000000000000000cc00000ccc00000ccc00000ccc000000cc0000000c
// 091:0000000000000000c0000000cc000000cc000000cc000000cc000000cc000000
// 092:000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc0000000c
// 093:c0000000cc000000cc000000cc000000cc000000cc000000ccc00000cc000000
// 094:0000000000000000000ccccccccccccccccccccc0000cccc0000000000000000
// 100:5555555055055550550005505500055055005550550055505555550055555500
// 101:0005500000055000000550000055500000550000005500005555500055555000
// 102:0555550005555000055550000555550005555550055055500550055005500550
// 103:0550000005555555055555550550000005500000055000000555555505555555
// 104:0000000c0000000c0000000c0000000c000000c0000000c0000000c0000000c0
// 105:cc000000cc000000cc0000000c0000000cc0000000c0000000c0000000c00000
// 106:000000cc0000000c0000000c0000000c000000c0000000c0000000c000000000
// 107:ccc00000cc000000cc0000000c0000000cc0000000c0000000c0000000000000
// 108:0000000c0000000c000000c00000000c0000000c000000000000000000000000
// 109:cc0000000c0000000cc00000000c0000000c0000000000000000000000000000
// 113:00999900099999900991919009919190099a9a900999999009a99a90009a9090
// 115:009000000990000091990000999990090aa99999009999900a090a900a090a90
// 117:000000000000000000000000000ee000000ee000000000000000000000000000
// 118:000000000000000000000000000e000000000000000000000000000000000000
// 119:000000000000000000000000000e00000000e000000000000000000000000000
// 120:000000000000000000000000000ee0000000e000000000000000000000000000
// 121:0000000000000000000000000008800000088000000000000000000000000000
// 122:000000000000000000000000000cc000000cc000000000000000000000000000
// 123:000000000000000000000000000dd000000dd000000000000000000000000000
// 124:000000000000000000000000000d000000000000000000000000000000000000
// 125:000000000000000000000000000d00000000d000000000000000000000000000
// 126:000000000000000000000000000dd0000000d000000000000000000000000000
// 130:0aaaaaa0a999999a9009900990099009a999999aaa0101aaa910109a0aaaaaa0
// 133:0000000000000000000000000000000000000000000000000000000100000110
// 134:0000000000000000000000000000000000000000000000000110000010000000
// 135:0000000000000000000000000000000000000000000000000000000100001010
// 136:1000000010000000100000001000000010000000100000001100000010000000
// 137:0000000000000000000000000000000000000000000000000000000b00000bb0
// 138:0000000000000000000000000000000000000000000000000bb00000b0000000
// 139:0000000000000000000000000000000000000000000000000000000b0000b0b0
// 140:b0000000b0000000b0000000b0000000b0000000b0000000bb000000b0000000
// 145:0000000009999990090000900919919009199190099009900999999009099090
// 147:0aaaaaa0a999999a9109901991199119a999999aaa0000aaa901109a0aa11aa0
// 149:0001101100001101000011100000111100001111000001100000010100000011
// 150:0110000011010000001100000111000011110000111000001110000010000000
// 151:0000101100001101000011100000111100000111000000100000000100000011
// 152:0101000011010000001100000111000011110000111000001110000010000000
// 153:000bb0bb0000bb0b0000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 154:0bb00000bb0b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 155:0000b0bb0000bb0b0000bbb00000bbbb00000bbb000000b00000000b000000bb
// 156:0b0b0000bb0b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 167:0000000000000000000000000000000000000000000000000000000100000000
// 168:0000000000000000000000000000000000000000000000000110000010000000
// 169:0000000000000000000000000000000000000000000000000000000100000000
// 170:0000000000000000000000000000000000000000000000000000000010000000
// 183:0001100000001100000011100000111100001111000001100000010100000011
// 184:0000000000010000001100000111000011110000111000001110000010000000
// 185:0001100000001100000011100000111100001111000001100000010100000011
// 186:0000000000010000001100000111000011110000111000001110000010000000
// 187:0001100000001100000011100000111100001111000001100000010100000011
// 188:0000000000010000001100000111000011110000111000001110000010000000
// 189:0000000000000000000000000000000000000000000000000000000100000011
// 190:0000000000010000001100000111000001110000111000001110000010000000
// 192:0000000000888800888888880222222000228220088888008088880000088000
// 193:0000000000888800888888880222222000228220088888008088880000800800
// 194:0088880088888888022222200022822008888800808888000800008000000000
// 195:0088880088888888000888000222222000228220088888008088880000800800
// 196:0000000000888800888888880222222000220220000000000000000000000000
// 197:0000000000000000000000000088880088888888022222200022022000000000
// 198:0000000000000000000000000000000000888800888888880222222000220220
// 208:0000000000888800888888880288882000888820088888008088880000088000
// 209:0000000000888800888888880288882000888820088888008088880000800800
// 210:0088880088888888028888200088882008888800808888000800008000000000
// 211:0088880088888888000888000288882000888820088888008088880000800800
// 217:8000000000000000000000000000000000000000000000000000000000000000
// 218:8000000080000000080000000000000000000000000000000000000000000000
// 219:8000000080000000080000000088800000000000000000000000000000000000
// 220:8000000080000008080000080088888000000000000000000000000000000000
// 221:0000000000000008000000080008888000000000000000000000000000000000
// 222:0000000000000008000000080000008000000000000000000000000000000000
// 223:0000000000000008000000000000000000000000000000000000000000000000
// 229:000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc
// 230:cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00
// 231:000ccc00000cc000000cc000000cc000000ccc00000cccc0000ccc00000cc0c0
// 232:0ccccc0000cccc0000cccc0000cc0c0000cc0c0000c0cc00000ccc0000cccc00
// 233:0000000800000000000000000000000000000000000000000000000000000000
// 234:0000000800000008000000800000000000000000000000000000000000000000
// 235:0000000800000008000000800000008000000800000080000000000000000000
// 236:0000000800000008000000808000008008000800008880000000000000000000
// 237:0000000000000000000000008000000008000800008880000000000000000000
// 238:0000000000000000000000008000000008000000008000000000000000000000
// 239:0000000000000000000000008000000000000000000000000000000000000000
// 245:000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc
// 246:cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00
// 247:000c0cc0000c0cc0000cccc0000ccc0c000ccc0c000ccc0c000ccc0c000ccc0c
// 248:00cccc0000cccc00c0cccc00c00ccc00cc0ccc00cc0ccc00cc0ccc00cc0ccc00
// 249:00000000000000000000000000000000000000000000000000000000e0000000
// 250:0000000000000000000000000000000000000000000000000e00000000000000
// 251:0000000000000000000000000000000000e000000eee000000e0000000000000
// 252:00000000000000000000000000e0e000000e000000e0e0000000000000000000
// 253:00000000000000000000e000000eee000000e000000000000000000000000000
// 254:000000000000000000000e000000000000000000000000000000000000000000
// 255:00000000000000e0000000000000000000000000000000000000000000000000
// </SPRITES>

// <SPRITES1>
// 000:0000000000888800888888880222222000228220088888008088880000088000
// 001:0000000000888800888888880222222000228220088888008088880000800800
// 002:0088880088888888022222200022822008888800808888000800008000000000
// 003:0088880088888888000888000222222000228220088888008088880000800800
// 004:8800000088000000000000000000000000000000000000000000000000000000
// 005:8008000008008000088888000808080008888800088888000088800000080000
// 006:8008000008008000088888000808080008808800088088000088800000080000
// 007:8008000008008000088888000808080008808800088088000088800000000000
// 008:0000000000000000000888000088000000800000008000000000000000000000
// 009:0000000000000000008880000000880000000800000008000000000000000000
// 010:0000000000000000000008000000080000008800008880000000000000000000
// 011:0800000080800000080000000000000000000000000000000000000000000000
// 012:8080000000000000808000000000000000000000000000000000000000000000
// 013:8000000000000000000000000000000000000000000000000000000000000000
// 016:0000000000888800888888880088800000888800088880008088880000800000
// 017:0000000000888800888888880088800000880800088880008088080000800000
// 018:0000000000888800888888880080800000880800088080008088080000800000
// 019:0000000000888800888888880080800000080800088080008008080000800000
// 020:0000000000888800888888880000800000080000008080008008000000800000
// 021:0000000000000000000000000000000000000000000000000000000b00000000
// 022:0000000000000000000000000000000000000000000000000bb00000b0000000
// 023:0000000000000000000000000000000000000000000000000000000b00000000
// 024:00000000000000000000000000000000000000000000000000000000b0000000
// 032:0000000008008000088888000808080008808800088088000088800000000000
// 033:0000000000000000088880000808080008808800088088000088800000000000
// 034:0000000000000000008880000808080008808800008088000088000000000000
// 035:0000000000000000008080000808080000808000008080000008000000000000
// 036:0000000000000000008080000800000000808000000000000008000000000000
// 037:000bb0000000bb000000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 038:00000000000b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 039:000bb0000000bb000000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 040:00000000000b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 041:000bb0000000bb000000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 042:00000000000b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 043:0000000000000000000000000000000000000000000000000000000b000000bb
// 044:00000000000b000000bb00000bbb00000bbb0000bbb00000bbb00000b0000000
// 050:000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc00000c0c
// 051:c0000000cc000000cc000000cc00c000cc00c000cc0c0000ccc00000cc000000
// 052:0000000000555550555555505550000055000000550000005500000055000000
// 053:0000000000055555000555550005505500055005005550000055000000550000
// 054:0000555500005555500000005500000055000005550000055500000555000005
// 055:5555550055555555555555555500000055000550500055555005555550055555
// 056:000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc0000000c
// 057:c0000000cc000000cc000000cc000000cc000000cc000000ccc00000cc000000
// 058:00000000000000cc00000ccc00000ccc000000cc0000000c000ccccc0000000c
// 059:00000000c0000000cc000000cc000000cc000000cc000000ccccc000cc000c00
// 060:000000cc00000ccc00000ccc000c0ccc000c00cc0000c00c00000ccc0000000c
// 061:c0000000cc000000cc000000cc000000cc000000cc000000ccc00000cc0c0000
// 062:00000000000000cc00000ccc00000ccc000000cc0000000c000ccccc00c0000c
// 063:00000000c0000000cc000000cc000000cc000000cc000000cccccc00cc000000
// 066:0000c00c0000c00c0000000c000000c0000000c0000000c0000000c0000000c0
// 067:cc000000cc0000000c0000000cc0000000c0000000c0000000c0000000c00000
// 068:5500555055005555550005555500005555000055555555555555555500000000
// 069:0055000000550005005550055055505550055055500555550005555000000000
// 070:5500000555000005500000055000000550000005000000050000000500000000
// 071:5005505550055055500550555005505550055055500550555005555500055555
// 072:0000000c0000000c0000000c000000c0000000c0000000c0000000c0000000c0
// 073:cc000000cc0000000c0000000cc0000000c0000000c0000000c0000000c00000
// 074:0000000c0000000c0000000c000000c0000000c0000000cc000000c0000000c0
// 075:cc000000cc0000000c0000000c000000c000000000000000c000000000000000
// 076:0000000c0000000c0000000c000000c0000000c00000000c0000000c000000c0
// 077:cc00c000cc00c0000c0000000c000000c0000000c000000000000000c0000000
// 078:0000000c0000000c0000000c000000c0000000c0000000c0000000c0000000c0
// 079:cc000000cc0000000c0000000c00000000c0000000c0000000c0000000c00000
// 084:0000000000000000555555505555555555000555550000555500055555555555
// 085:0000000000000000000555500005555000005500000055000005550000055500
// 086:0000000000000000055000000550005505500555055055550550555005555500
// 087:0000555000000000000000000055555500555555005500000055000005550000
// 088:00000000000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc
// 089:00000000c0000000cc000000cc000000cc000000cc000000cc000000ccc00000
// 090:0000000000000000000000cc00000ccc00000ccc00000ccc000000cc0000000c
// 091:0000000000000000c0000000cc000000cc000000cc000000cc000000cc000000
// 092:000000cc00000ccc00000ccc00000ccc000000cc0000000c000000cc0000000c
// 093:c0000000cc000000cc000000cc000000cc000000cc000000ccc00000cc000000
// 094:0000000000000000000ccccccccccccccccccccc0000cccc0000000000000000
// 100:5555555055055550550005505500055055005550550055505555550055555500
// 101:0005500000055000000550000055500000550000005500005555500055555000
// 102:0555550005555000055550000555550005555550055055500550055005500550
// 103:0550000005555555055555550550000005500000055000000555555505555555
// 104:0000000c0000000c0000000c0000000c000000c0000000c0000000c0000000c0
// 105:cc000000cc000000cc0000000c0000000cc0000000c0000000c0000000c00000
// 106:000000cc0000000c0000000c0000000c000000c0000000c0000000c000000000
// 107:ccc00000cc000000cc0000000c0000000cc0000000c0000000c0000000000000
// 108:0000000c0000000c000000c00000000c0000000c000000000000000000000000
// 109:cc0000000c0000000cc00000000c0000000c0000000000000000000000000000
// 113:00999900099999900991919009919190099a9a900999999009a99a90009a9090
// 115:009000000990000091990000999990090aa99999009999900a090a900a090a90
// 117:000000000000000000000000000ee000000ee000000000000000000000000000
// 118:000000000000000000000000000e000000000000000000000000000000000000
// 119:000000000000000000000000000e00000000e000000000000000000000000000
// 120:000000000000000000000000000ee0000000e000000000000000000000000000
// 121:0000000000000000000000000008800000088000000000000000000000000000
// 122:000000000000000000000000000cc000000cc000000000000000000000000000
// 123:000000000000000000000000000dd000000dd000000000000000000000000000
// 124:000000000000000000000000000d000000000000000000000000000000000000
// 125:000000000000000000000000000d00000000d000000000000000000000000000
// 126:000000000000000000000000000dd0000000d000000000000000000000000000
// 130:0aaaaaa0a999999a9009900990099009a999999aaa0101aaa910109a0aaaaaa0
// 133:0000000000000000000000000000000000000000000000000000000100000110
// 134:0000000000000000000000000000000000000000000000000110000010000000
// 135:0000000000000000000000000000000000000000000000000000000100001010
// 136:1000000010000000100000001000000010000000100000001100000010000000
// 137:0000000000000000000000000000000000000000000000000000000b00000bb0
// 138:0000000000000000000000000000000000000000000000000bb00000b0000000
// 139:0000000000000000000000000000000000000000000000000000000b0000b0b0
// 140:b0000000b0000000b0000000b0000000b0000000b0000000bb000000b0000000
// 145:0000000009999990090000900919919009199190099009900999999009099090
// 147:0aaaaaa0a999999a9109901991199119a999999aaa0000aaa901109a0aa11aa0
// 149:0001101100001101000011100000111100001111000001100000010100000011
// 150:0110000011010000001100000111000011110000111000001110000010000000
// 151:0000101100001101000011100000111100000111000000100000000100000011
// 152:0101000011010000001100000111000011110000111000001110000010000000
// 153:000bb0bb0000bb0b0000bbb00000bbbb0000bbbb00000bb000000b0b000000bb
// 154:0bb00000bb0b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 155:0000b0bb0000bb0b0000bbb00000bbbb00000bbb000000b00000000b000000bb
// 156:0b0b0000bb0b000000bb00000bbb0000bbbb0000bbb00000bbb00000b0000000
// 167:0000000000000000000000000000000000000000000000000000000100000000
// 168:0000000000000000000000000000000000000000000000000110000010000000
// 169:0000000000000000000000000000000000000000000000000000000100000000
// 170:0000000000000000000000000000000000000000000000000000000010000000
// 183:0001100000001100000011100000111100001111000001100000010100000011
// 184:0000000000010000001100000111000011110000111000001110000010000000
// 185:0001100000001100000011100000111100001111000001100000010100000011
// 186:0000000000010000001100000111000011110000111000001110000010000000
// 187:0001100000001100000011100000111100001111000001100000010100000011
// 188:0000000000010000001100000111000011110000111000001110000010000000
// 189:0000000000000000000000000000000000000000000000000000000100000011
// 190:0000000000010000001100000111000001110000111000001110000010000000
// 192:0000000000888800888888880222222000228220088888008088880000088000
// 193:0000000000888800888888880222222000228220088888008088880000800800
// 194:0088880088888888022222200022822008888800808888000800008000000000
// 195:0088880088888888000888000222222000228220088888008088880000800800
// 196:0000000000888800888888880222222000220220000000000000000000000000
// 197:0000000000000000000000000088880088888888022222200022022000000000
// 198:0000000000000000000000000000000000888800888888880222222000220220
// 208:0000000000888800888888880288882000888820088888008088880000088000
// 209:0000000000888800888888880288882000888820088888008088880000800800
// 210:0088880088888888028888200088882008888800808888000800008000000000
// 211:0088880088888888000888000288882000888820088888008088880000800800
// 217:8000000000000000000000000000000000000000000000000000000000000000
// 218:8000000080000000080000000000000000000000000000000000000000000000
// 219:8000000080000000080000000088800000000000000000000000000000000000
// 220:8000000080000008080000080088888000000000000000000000000000000000
// 221:0000000000000008000000080008888000000000000000000000000000000000
// 222:0000000000000008000000080000008000000000000000000000000000000000
// 223:0000000000000008000000000000000000000000000000000000000000000000
// 229:000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc
// 230:cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00
// 231:000ccc00000cc000000cc000000cc000000ccc00000cccc0000ccc00000cc0c0
// 232:0ccccc0000cccc0000cccc0000cc0c0000cc0c0000c0cc00000ccc0000cccc00
// 233:0000000800000000000000000000000000000000000000000000000000000000
// 234:0000000800000008000000800000000000000000000000000000000000000000
// 235:0000000800000008000000800000008000000800000080000000000000000000
// 236:0000000800000008000000808000008008000800008880000000000000000000
// 237:0000000000000000000000008000000008000800008880000000000000000000
// 238:0000000000000000000000008000000008000000008000000000000000000000
// 239:0000000000000000000000008000000000000000000000000000000000000000
// 245:000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc000ccccc
// 246:cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00cccccc00
// 247:000c0cc0000c0cc0000cccc0000ccc0c000ccc0c000ccc0c000ccc0c000ccc0c
// 248:00cccc0000cccc00c0cccc00c00ccc00cc0ccc00cc0ccc00cc0ccc00cc0ccc00
// 249:00000000000000000000000000000000000000000000000000000000e0000000
// 250:0000000000000000000000000000000000000000000000000e00000000000000
// 251:0000000000000000000000000000000000e000000eee000000e0000000000000
// 252:00000000000000000000000000e0e000000e000000e0e0000000000000000000
// 253:00000000000000000000e000000eee000000e000000000000000000000000000
// 254:000000000000000000000e000000000000000000000000000000000000000000
// 255:00000000000000e0000000000000000000000000000000000000000000000000
// </SPRITES1>

// <MAP>
// 000:1e1e1e1e2e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e
// 001:1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 002:1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 003:1e1e1e1e2e00000000000000000000000000000000000000000000000000003a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a390000000000000000000000000000000000000000000000000000000000000000000000f33363730043e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 004:1e1e1e1e2e000000000000000000000000000000000000000000000000000029000093440094440043b3d3730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 005:1e1e1e1e2e000000000000000000000000000000000000000000000000000029000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000000000000000000000000000000000000000000000000000000000000000000000029000000000000000000000000000000000000000000000000000000000000000009b4d6537444534463b3e3730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 006:1e1e1e1e2e000000000000000000001600000000000000000000000000000029000e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000290000000000000000000b00000b00000b00000b00000b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 007:1e1e1e1e2e000016000000000000000000000000000000000000000000000029000e1e2e414141000000000000000000000000000000000000000000000000000000000041414100000000000000000e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000029000000000000000000000000000000000000000000000000000000000000000009d333c433b3b300534463730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 008:1e1e1e1e2e000000000000000000000000000000000000000000000000000029000e1e2e000000000000000c000c0000000000000000000c00000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000e
// 009:1e1e1e1e2e00000000000000000000000000000000000000000000000000004a100e1e2e000000000000000000000000000a0000000000000000000a000000000000000000000000000000001600000e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000290000000000000000000b0000000000000000000000000000000000000000000009f333d3b3f33300934474d3e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 010:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e2e000c00000000000a0000160000000000000c000016000000000000000000009696969696000000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 011:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e2e000c0000000000000000000000000000000000000000000000000000000095a5a5959595a50000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000084547353b333e30094a33334d3840094440000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 012:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e2e000c0000001400000000000000000000000a00000000000000000000000095a5a5959695a500003d4d00000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000161600000000000000000016000000000000000000000000000000000000000000000000000e
// 013:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e2e000c0000000000000000000c00000a0000000000000c00000a000000000095a5a5959595a500003e4e00000f1f1f1f1f1f1f1f1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000c63744454d53433f37300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 014:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e2e000c000000000000000000000000000000000000000000000000000000009695a5959596a600003d4d000000000000000000000e1e1e2e0000000000000000000000000000000000a9b90000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 015:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e2e000c0000000b000b000016000000000000000000160000000000000000009796a6969697a700003e4e000000000000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000b84b3f3443453a373e3e3440000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000e
// 016:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e2e0000000000000000000000000000000000000000000000000000000000000097a79797a70000000000003a2a2a2a2a2a3900000e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d00000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 017:1e1e1e1e2e000000000000000000000000000000000000000000000000000000000e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d00000000004a0d1d1d2d002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e00000000004a0d1d1d1d1d1d1d1d1d1d2d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 018:1e1e1e1e2e000000000000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 019:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0043b3d37300b38400c4b3340000000000000000000e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 020:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e002916000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 021:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000001e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000004600000009000000000000000000000000000f1e1ecdddedcddded1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000001616000000000000000000000000000000000000000e
// 022:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000f1f1f1f1f1f1f1f1f1f1f2f0000000000000e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000009000000000002000000000000000000001f2f0000000000000e1e1e1e1e2e47474747474747474747474700000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000e
// 023:1e1e1e1e2e000000000000001600000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00001600003a2a2a2a39160016000000000000000000000000000000000000000e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e0000000000000009000000000000004600000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 024:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000004a0d1d2d4a390000000000000000000000000000000000001600000e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d2d0000090000000000000000000000000000000000000000000000000e1e1e1f1f2f00000b00000b000b0000000d1d2d0000006600000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 025:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2d4a2a2a2a2a2a2a2a2a2a2a2a390000000000000000000e1e1e2e004a10000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000900000000000000000000000000460000000d1d1d1d1d1e1e2e00000000000000000000000000000e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 026:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1d1d1d1d1d1d1d1d1d2d000029000d1d1d1d1d1d1d1d1e1e1e2e000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000009000000000000000d1d1d1d2d000000000000000e1e1e1e1e1e1e2e00130000000b00000b0066000b000e1e2e0000470000000f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 027:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e2e000029000e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000d1e1e1e1e1e2d0000000000000f1f1f1f1f1e1e2e00000000000000000000000000000e1e2e000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 028:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e2e000029000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000d1e1e1f1f1f1e1e2d000000000000000000000e1e1e1d2d000000000000000b000b00000e1e2e000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 029:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f0000000000000f1f1f1f1f1f1f1f1f1f1f1e1e2e000029000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000012000e1e2e0000000e1e1e2d0000660000000000000e1e1e1e1e2d000b000b000000000000000e1e2e000000003d4d0d1d2d000000000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 030:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000e1e2e000029000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000660000000e1e2e3a10000e1e1e1e1d1d2d0000000000000e1e1e1e1e2e00000000000000000b00000e1e2e000000003e4e0e1e2e000300000000000000000000000000000000000000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 031:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000b000a000b00000000000e1e1e000029000e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00004600000d1d1d1e1e2e4a39000e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e2e000b0b00000300000000000e1e1eccdcecccdcec1e1e2e00000000000000470000000100000900000a00000b00000c000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 032:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000003a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a3900000000000000660000000e1e2e000029000e1e1e1e1e1e1e1e1e1e1e2e00000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000e1e1e1e1e2e0029000e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e2e00000000000000000000000e1e1ecdddedcddded1e1e2e000000000000000000000000000000000000000000000000000e1e1e2e000000000000000000000000000016000000000000000000000016000000000000000000000000000000000000000000000e
// 033:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000d1d1d1d1d1d1d2d00000000004a0d1d1d1d1d1d1d2d003d4d0e1e2e000029000f1f1f1f1f1f1f1f1f1f1f2f000a000c000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000f1f1e1e1e2e0b290b0e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1e1e1eccdcecccdcec1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 034:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e2e003e4e0e1e2e0000290000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000e1e1e2e0c290c0e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0003000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000001616161616161616161616161616161616000e
// 035:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1d1d1d1e1e2e00002900000b00000b0000001600000900000014000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000004600000e1e1e2e0029000e1e1e1e1e1e2e3900000000001f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1f1f1f1f2f00000000003a0f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e0000000000000e1e1e2e00000000000000000000000000000000000000000000000000000000000000161616161616160a161616161616161616000e
// 036:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000029000a000e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1f1f1f1f1f1e1e1e1e1e2e0000290000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000e1e1e2e0b290b0f1f1f1f1f1f2f29000000000000000000000000000000000e1e1e2e000000000000000000004a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a390e1e2e0000005600000e1e1e2e000000000000000000000000000000000000000000000000000000000000001616161616161600161616161616161616000e
// 037:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1ecdddedcddded1e1e1e00000000000e1e1e1e1e2e00004a2a2a2a2a2a2a2a2a2a2a2a2a2a39000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2d0000000000000e1e1e2e00290000000000000000290000003d4d00000000000000000000000e1e1e2e0000000000000000000000000000000000004646000046460000000000290e1e2e0000000000000e1e1e2e00000000000000000000000000000000000000000000000000000000000000161616161616160c161616161609161616000e
// 038:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0025000029000a000e1e1e1e1e1e1e2e0000000000000f1f2f00007776000e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d002900000d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e004a2a2a2a2a2a2a2a2a490000003e4e00000000000000000000000e1e1e2e0000000012000000000000000000000000004646000046460000000b00290e1e2e0000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000001616161616000b00001616160000161616000e
// 039:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00290c000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e0000000000000000000000000000000000000000000000000000000e1e1e2e000000000000000000000d1d1d1d2d0000004646000046460000000000290e1e1eccdcecccdcec1e1e1e2e00000000000000000000000000000000000000000000000000000000000000161616160b0016160a0016000916161616000e
// 040:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e2e00000000000000000000000000000e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1e2e002900000e1e1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000d1d2d00000000000f1f1f2f00000000000000000c000e1e1e1e2e0000004646000046460000000b00290e1e1ecdddedcddded1e1e1e2e00000000000000000000000000000000000000000000000000000000000000161616161616161616000a001616161616000e
// 041:1e1e1e1e2e000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000029000c000e1e1e1e1e1e1e2e00000000000000000000000000000e1e1e1e1e1e2e0000000000000000000000000e2e004a10000e2e00000000000e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e2e000000000000000000000000000000000000000e1e1e1e2e0000004646000046460000000000290e1e1eccdcecccdcec1e1e1e2e000000000000000000000000000000000000000000000000000000000000001616161616160a16161600161616161616000e
// 042:1e1e1e1e2e000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00050000290000000e1e1e1e1e1e1e1e1d1d1d1d1d1d2d000000000000000f1f1f1e1e1e2e0000000000000000000c00000e2e000000000e2e00000000000e1e1e1e1f1f1f1f1f1f1f1f2f000000003a2a0f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1ecdddedcddded1e1e2e000000000000000000000009000000000000000e1e1e1e2e0000000000000000000000008a00290e1e1ecdddedcddded1e1e1e2e0000000000000000000000000000000000000000000000000000000000000016161616160b0b0b16160b161616161616000e
// 043:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000029000c000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e001600000000000000000e1e1e2e000b000015000000000000000e1e1d1d1d1d1e2e00000000000e1e1e2e00000000000000000000000000290000000000000000000000000e1e1e1e1e1eccdcecccdcec1e1e2e000000000000000000000000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e00000000003a0e1e1e2e000000000000000000000000160000000000000000000000000000000000001616161616161616001600001616161616000e
// 044:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000e1e1e2e0000000000000095a595a5950e1e1e1e1e1e1e2e00050000000e1e1e2e000000000046000a0000000000290000090000000000000000000e1e1e1e1e1ecdddedcddded1e1e2e000000000000000000000000000000000900000e1e1e1e2e4600004646000046460000000000290e1e2e0000000000290e1e1e2e0000000000000000000000000000000000000000000000000000000000000016161616160016160016160b1616161616000e
// 045:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00090009290009000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d2d0000000000000e1e1e2e0009000000000096a60ca6960f1f1f1f1f1f1f2f00000000000e1e1e2e00000000000000000000003d4d4a1000000000004600000000000e1e1e1f1f2f00000000003a1e1e2e000000000000000000000000000000000000000e1e1e1e2e0000000000000000000000008900290e1e2e000000102a490e1e1e2e0000000000000000000000000000000000000000000000000000000000000016161616000a16160c1616001616161616000e
// 046:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e2e0000000000000097a797a797475746564757465600000000000e1e1e2e00000000000000000000003e4e000000000000000000000000000e1e2e0000000000000000290e1e2e000000000000000900000000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e0000000d1d1d1e1e1e2e000000000000000000000000000000000000000000160000000000000000001616160b001616160016000c1616161616000e
// 047:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d2d004a10000d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f100000d1d1e1e1e2e000b00070000000000000000000000000000000000000000000e1e1e2edb0056474647570d1d1d1d1d1d1d1d1d2d0000090000000900000e1e2e84a344749453a494290e1e2e0000020000000000000000000c0000000000000e1e1e1e2e4600004646000046460000000000290e1e2e0001000e1e1e1e1e1e2e00000000004646464646464600000000000000000000000000000000000000161616160016161600160c161616161616000e
// 048:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f200000e1e1e1e1e2e0000000000000000000c000000003d4d0000000000000000000e1e1e2e00000a46460a460e1e1e708090a01e1e2e0000000000000000000e1e2e0000000000000000290e1e2e00000000000000000000000000000000000c000e1e1e1e2e0000000000000000000000008800290e1e2e0000000e1e1e1e1e1e2e00000000464600004600004646000000000000000000000000000000000000161616160c161616000000090016161616000e
// 049:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1e1d1d1d1d1e1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e2e000000000f1f1e1e1e2e00000000000000000000000000003e4e0000000000000000000e1e1e2eda0000000000000e1e1e718191a11e1e2e0001000011000001000e1e2e0000000000000000290e1e2e0000000000000000000c0000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e0000000e1e1e1e1e1e2e000000004600000000000000460000000000000000000000000000000000001616160000161616001616160900161616000e
// 050:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000e1e1e1e1e2e0000000000000000000000000e1e1e1e1e1e2e0000000000000e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d2d0000000007000000070000000e1e1e2e00000a00000a000e1e1e1e1e1e1e1e1e2e0000090000000900000e1e2e0000000000000000290e1e2e000000000000000000000000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e0000000e1e1e1e1e1e2e000000004600000000000000460000000000000000000000000000001600001616160b000a0000770016161600161616000e
// 051:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000f1f1f1f1f2f0000000000000000000000000e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000660000000e1e1e2e9b0056464646570e1e1e1e1e1e1e1e1e2e0000000000000000000e1e2e0000000000000000290e1e2e000000090000000000000000000000001200000e1e1e1e2e0068000a0069000a006a00000a00290e1e2e0000000e1e1e1e1e1e2e00000000464600000000004646000000000000000000000000000000000000161616161616161616001616160c000a16000e
// 052:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000b000b00000000820000000e1e1e1e1e1e2e0000000d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000e1e1e2e000046474647460f1f1f1f1f1f1f1f1f2f0000000000000000000e1e2e0000000000000000290e1e2e000000000000000000220000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e0066000e1e1e1e1e1e2e000000000046460000004646000000000000000000000000000000000000001616161616161616160b16161616161616000e
// 053:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000062000000000000000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000e1e1e2e00000000000000000000004600000000000000000000000000000e1e2e000a00000a00000a290e1e2e000c00000000000000000000000000000000000e1e1e1e2e000000102a2a2a2a2a2a2a2a2a2a490e1e2e0000000e1e1e1e1e1e2e00000000004646460046460000000000000016000000000000000000000000161616000c000b0016000c161616161616000e
// 054:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000b000b00000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095a595a595a50000000e1e1e2e00000000000000000000000000000000000000000000000000000e1e2e0000000000000000290e1e2e000000000000000c00000000000900000000000e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e2e0000000e1e1f1f1f1f2f000000000000004646460000000000000000000000000000000000000000001616160b1616160a161600161616161616000e
// 055:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f10000000000000000000000000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000096a696a696a60000000e1e1e2e00000000000000000000000000000000000000004600000000000e1e2e0000000000000000290e1e1e1d1d1d1d2d0000000000000d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000b000e2e000000000000000000000000000000000000000000000000000000000000000000000000161616001616160016160b161616161616000e
// 056:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000959595959595959595950000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000097a797a797a70000000e1e1e2e00000000460000000000000000000000000000000000000000000e1e2e000a00000a00000a290e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f0000000e2e2c2c2c2c2c2c2c2c3b0000000000000000000000000000000000000000000000160000001616160a16161609000a00161616161616000e
// 057:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f00000000095950000000000000000959500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f2f0000000000000000000000000e1e1e2e00000000000000000000460046000000000000000000000000000e1e2e0000003a2a2a2a2a490e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000e2ea48473e3738484002b0000000000000000000000000000000000000000000000000000001616160016161616161616161616161616000e
// 058:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000009500000000000b000000009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e00000000000000000000000057000066000000670000000e1e1e2e0000000000000000000000000000000d1d1d1d1d1d1d1d1d1d1d1e1e2e0000002900000000000e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e003d4d0009000a0009007600000046000000030000000056000e2e84739494b33493842b0000000000000000000000001600000000000000000000000000001616160916161616161616161616161616000e
// 059:1e1e1e1e2e000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f20000009595000000000000000000009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e00000900090009000000000000000000000000000000000e1e1e2e0000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000002900150000000e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e003e4e000000000000000000000000000000000000000000000e2e2c2c2c2c2c2c2c2c4b0900000000000000000000000000000000000000000000000000001616160016161616161616161616161616000e
// 060:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000009500000000000000000000009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e000000460047000000005600000000000d1d1d1d1d1d1d1e1e1e1e1d1d1d1d1d1d1d1d2d0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000002900000c00000e1e1e1e1e1f1f2f3900000000000e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000e2e34b393a3942a4000000a0000000000000000000000000000000000000000000000000000000000e500000000000000000000000000000e
// 061:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000095000000003a2a2a2a3900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e000009000c000c0000000000005600000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e00000029000c0c00000e1e1e1e2e0000002900000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000b000e2e0000000000000000000b00000000560000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 062:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000009500000000290d1d2d2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000004a2a2a2a2a390e1e1e1e2e0000104900465600000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f0000000e2e84a333d3732a4000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 063:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000959500000b00290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e0000460000000d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e2e0009000000000000290e1e1e1e2e000000004656570000000000000000000000000000000000000000000000000000000000000000000000000e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 064:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095950000000000290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e0000000000000000290e1e1e1e2e000000465657000000000000000300000000000b000c000b000000460000000300000000000000005600000e1e1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 065:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095000000000000290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000290e1e1e1e2e000000475700000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000c473e35344f3730094440000003d4d3d4d00000000000000000000000e
// 066:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095000000000000290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f00000000003a0f1f1f1f1f1f1f1f1f1e1e1e1e2e0009000000000000290e1e1e1e2e0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000003e4e3e4e00000000000000000000000e
// 067:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000b00950000003d4d00290e1e2e2900000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000290000000000000000000e1e1e1e2e0000003a2a2a2a2a490e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00e8f800000000000000003300433353d3744444f3840000000000000000000000000000000000000e
// 068:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000950000003e4e00290e1e2e2900000b00000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000003a2a2a2a2a2a2a2a2a2a1000290000000000000000000e1e1e1e2e0000002900000000000e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00e9f9000000000000000000000000000000000000000000000000000000000000000000000000000e
// 069:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095000000000000290e1e2e2900000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e2a2a2a2a2a390e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000290000000000000000000000290000000000000000000e1e1e1e2e00000029003d4d00000e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 070:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000290e1e2e4900000000000e1e1e1f1f1f2f0000000f1f1f1f1f1f1f1f2f0000000000290f1f1f1f1f1f1f1f1f1e1e1e1e2e00000000000000000029434444f3737433349300c6290000000000000000000e1e1e1e2e00000029003e4e00000e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e003a10000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d2d00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 071:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000290e1e1eccdcecccdcec1e1e2e000000000000000000000000000000000000000000290000000000000000000e1e1e1e2e000000000000000000290000000000000000000000290000000000000000000e1e1e1e2e0000002900000000000e1e1e1f2f00000000003a0f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f002900000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 072:1e1e1e1e2e000016000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000092000000000000290e1e1ecdddedcddded1e1e2e000000000000000000000000000000000000000000290000000000000000000e1e1e1e2e000000000000000000290000747394a47434000000290000000000000000000e1e1e1e2e0000004a2a2a2a2a390e1e2e570000000000004a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a49000000000000007a007a000000000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 073:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000290e1e1eccdcecccdcec1e1e2e000000000096a696a696a696a696a696a60000000029000000000c000000000e1e1e1e2e0000000000000000004a2a2a2a2a2a2a2a2a2a2a2a490000000000000000000e1e1e1e2e000a00000a00000a290e1e2e0076000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 074:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000b00000010490e1e1ecdddedcddded1e1e2e000000000097a797a797a797a797a797a70000102a490000000000000000000e1e1e1e2e000068000000000000090000000a0000000b0000000c0000006900006a00000e1e1e1e2e0000000000000000290e1e2e00000000000000000000000000000000000000000000000000000000000d1d1d1d1d2d0000000000000000007600000000000000030000003a1000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 075:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000e1e2e0000000000000f1f2f000000000096a60000000000000000000000000000000000000000000000000e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e0000000000000000290e1e2e00000000000000004600000000460000000000000000004600000000000e1e1e1e1e2e000000000046000000000000470000000000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 076:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1e1e2e000000000000000000000000000097a70000000000000000000000000000000000000000160000000e1e1e1e2e000000000000000000000000000000af0000000000000000000000000000000e1e1e1e2e000a00000a00000a290e1e2e0000003d4d0000000000000000000000000000000000000000000000000f1f2f0f1f2f000000000000000000000000000000000000460000290000000e1e2e00000000000000000000000000000000160000000000000000000000000000000000000000000e
// 077:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000096a696a696a696a696a696a600000000000000000000000000000c0000000000000000000e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e0000003a2a2a2a2a490e1e2e0000003e4e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 078:1e1e1e1e2e000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000097a797a797a797a797a797a70000000000000000000000000000000000000000000000000e1e1e1e2e00000000003c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c3b00000000000e1e1e1e2e0000002900000000000e1e2e00000000000000000000000000000d1d1d1d1d2d0000000000000000000000006a000000000000000000000000000d1d1d1d2d0000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 079:1e1e1e1e2e000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e00000000002b000000000000000000000000000000000000002b00000076000e1e1e1e2e0000002900000000000e1e2e00000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000d1d1d2d0000000000000e1e1e1e2e0000000000290088000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 080:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000d1d1d1d2d0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e2e00000000002b0000c4000000000000000000000000000000002b00000000570e1e1e1e2e0000002900000000000e1e2e00000000000000000000000000000e1e1e1e1e2e000000ca0000000000000000000000000e1e1e2e0000000000000e1e1e1e2e0000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 081:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000002b003384630000000000000000000000000000002b00000d1d1d1e1e1e1e2e0000002900000000000e1e1e1d1d1d1d1d1d2d000000000000000e1e1e1e1e2e000000000000000000000000470000000e1e1e2e0000000000000e1e1e1e2e3a2a2a2a2a490088000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 082:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f000000000000000e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000002b0000000000000000000000000000000000e5002b00000e1e1e1e1e1e1e2e00102a4900000000000e1e1e1e1e1e1e1e1e2e000000000000000e1e1e1e1e2e00000000000d1d1d1d1d2d00000000000f1f1f2f0000000000000f1f1f1f2f2900000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 083:1e1e1e1e2e000000000000000000000e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e2f00000000002b00000000000000000000000000000000f6e6f52b00000e1e1e1e1e1e1e2e0000000000000010390f1f1f1f1f1f1e1e1e2e000000000000000f1f1f1f1f2f00000000000e1e1e1e1e2e0000000000000000000000000000003a2a2a2a2a4900000000000000000e1e2e0000000000000000000000000000000000000000003a2a2a2a2a3900000000000000000000000e
// 084:1e1e1e1e2e000000160000000000000e1e1e1e1e2e000900000a00000b00000c00000c00000b00000a00000900000000000000000e1e1e1e1ecdddedcddded1e1e1e1e1e2ed1d1d1d1d1d1d1d2d2d200d2d2000e1e1e1e1e2e0000000000004c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c4b00000e1e1e1e1e1e1e2e0000000000000000290000000000000e1e1e2e0000000000000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000029000000000000000000000000000e1e2e00000000000000000000000000000000000000000029000000002900000000000000000000000e
// 085:1e1e1e1e2e000000000000000000000e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e2a2a2a3900000f1f1f1f1f2f00000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e2e0000000000000000290000000000000e1e1e2e0000000000000000000000000057000000000e1e1e1e1e2e00030000000000000000002300000029000047000000aa0000000000000e1e2e00000000000000000000000000000000000000000029000000002900000000000000000000000e
// 086:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e2e3a2a3929000000000000000000000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1d1d1d1d1d2d000c290c00000009000e1e1e2e0000000000000000680000000000000000000e1e1e1e1e2e00000000000046000000000000000029000000000000000000000d1d1d1e1e2e000000000000000000000000000d1d2d00000000004a0d1d2d002900000000000000000000000e
// 087:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e4a394a49000000000000000000000086000000000000860000000e1e1e1e1e2e00000000000000000000000000000000000046000000000d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e2e003a490000000000000e1e1e2e00004600000000000000000000000d1d1d1d1e1e1e1e1e2e0000000000000000000000000000004a2a2a2a390000000000000e1e1e1e1e2e000000000000000000000000000e1e1eccdcecccdcec1e1e2e002900000000000000000000000e
// 088:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1e1e1e2e004a100000000a000066000000000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0c2900000c000009000e1e1e2e000000000000000000000000ca000e1e1e1e1e1e1e1e1e2e00000d1d2d00000000000000000000000d1d2d290000000000000e1e1e1e1e2e000000000000000000000000000e1e1ecdddedcddded1e1e2e004a10000000000000000000000e
// 089:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000e1e1e2e00000000000000000000000e1e1e2e00000000000000000000000000000000000000000000000092000e1e1e1e1e2e00000046000000000000005600000000000000005600000e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e004a390000000000000e1e1e2e00000000000000000000000000000f1f1f1f1e1e1e1e1e2e00000e1e2eda000000000000000000000e1e2e290000000046000e1e1e1e1e2e000000160000000000000000000e1e1eccdcecccdcec1e1e2e000000000000000000000000000e
// 090:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000e1e1e2e00000000000000000000000e1e1e2e0000000000000000000a000000000086000000000000000000000e1e1e1e1e2e00000000464600090000000000000000000046000000000e1e2e00000000000000000000000000000e1e2e000c290c00000009000e1e1e2e000000000000000d2d3a2a2a2a2a2a2a2a391e1e1e1e1e2e00000f1f2f000000003a2a2a2a2a2a390e1e2e290000000000000e1e1e1e1e2e000000000000000000000000000e1e1ecdddedcddded1e1e2e000000000000000000000000000e
// 091:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000a2000000000e1e1e2e000000a2000000000000000e1e1e2e00000000b20000000000000000000000000000008600000000000e1e1e1e1e2e00005600000000000000000000000a00004646000c00000e1e2e00000000003a2a2a2a39003a10000e1e2e0000290000000000000e1e1e2e0000000000ca000e2e2900000000000000290e1e1e1e1e2e000000000000000000290000000000290e1e2e290000000000000e1e1e1e1e2e000000000000000000000000000f1f2f0000000000000f1f2f000000000000000014000000000e
// 092:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000f1f1f2f00000000000000000000000e1e1e2e000a0000000000000000000000000000000000000000000000000e1e1e1e1e2e00000000000900000009000056000000460000000000000e1e2e00005600002900000029002900000e1e1e1d2d4900000000000d1e1e1e2e000000000000000f2f2900000000000100290e1e1e1e1e2e000000000000000000290000000000290f1f2f290000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 093:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000e1e1e2e00000000000000000000000000000000000000000000000000000e1e1e1e1e2e0000000000000000000000000000004600000000000b000e1e2e00000000004a0d1d2d4a2a4900000e1e1e1e1eccdcecccdcec1e1e1e1e2e3a2a2a2a2a2a2a2a2a4900000000000000290f1f1f1f1f2f3a2a2a2a2a2a2a2a2a4900000000004a2a2a2a490000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000900090000000000000000000e
// 094:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e00102a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a390d1e1e1e2e0000000000000d1d1d1d1d1d1d1d2d00000000000000000000000e1e1e1e1e2e000000000046000a0056000000000046000009000000000e1e1eccdcecccdcec1e1e2e00000000000e1e1e1e1ecdddedcddded1e1e1e1e2e29000000000000000000000000000000004a2a2a2a2a2a2a49000000000000000000000000000000000000000000460000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 095:1e1e1e1e2e000000001600000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000290e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e00000000000000000000000e1e1e1e1e1e2d000b0000000000000000000c000000000000000000560e1e1ecdddedcddded1e1e2e00000046000e1e1e1e1eccdcecccdcec1e1e1e1e2e29000000000000000000001300000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000090000000e
// 096:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000e000290e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e00000000000000000000000e1e1e1e1e1e2e000c00160b00460016000000000066004646464600000e1e1eccdcecccdcec1e1e2e00000000000e1e1e1e1ecdddedcddded1e1e1e1e2e29000000000000460000000000000000000000460000000000000000000000000000000046000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000014000000000000140000000000000000000e
// 097:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000009000000000000090000000000290e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e00000000008600008600000e1e1e1e1e1e2e000000000000000000000000160000000000000000000e1e1ecdddedcddded1e1e2e00103900000e1e1e1f2f0000000000000e1e1e1e2e29000000000000000000000000000000000000000000000000004600000000680000000000000000000000000100000047470e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000a00000e
// 098:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000290e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e00000000000000000000000e1e1e1e1e1e2e000016000c0016000c00560000000c000000000c00000f1f2f0000000000000e1e2e00002900000e1e2e00000000000000000e1e1e1e2e29000000000000000000000000000000000000000000000000000000000000000000000000004600000000000000004747470e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 099:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000660000000000000000660000000000000000290f1f1f1f2f3900000000001f1f1f1f1f1f1f1f2f00000000000000000000000e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000046460000000e1e2e00002900000e1e2e00000000000000000e1e1e1e2e290000000000000000000000000000880000006800aa006a00000000000000000000000000000000000000000000474747470e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000001600000000000e
// 100:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e00000900000000000000000000000000000009000000004a2a2a2a2a2a49000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d2d00000c00160009000b00000c0000460000000e1e2e00002900000e1e2e00000000000046000e1e1e1e2e29000046000000000000000000000000000000000000000000000000000000000000000000000000000000000000474747470e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000a000000000000000000000e
// 101:1e1e1e1e2e000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008600000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000e1e2e00002900000e1e2e00004600000000000f1f1f1f2f2900000000000000000046460000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000000000000000000000000000e
// 102:1e1e1e1e2e003d4d3d4d00003a2a100e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000d1d2d0000000a00000000000a0000000000000000000000000000000000000e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1e1e1e2e0000000000000d1d1d1d1d1d1d1d1d1d1d1d1e1e2e00002900000e1e2e000000000000000000000000002900000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000090000000e
// 103:1e1e1e1e2e003e4e3e4e00002900000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000066000000000000000000000e1e2e000000000000000000000000000066000000000000009200000000000e1e1e1e1e1e2e0000000000000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00002900000e1e2e000000000000000000000000002900000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000090000000000000000000000000e
// 104:1e1e1e1e2e000000000000002900000e1e1e1e1e1e1e1e1e1e1e1e2e0000090000000000000009000000000000000000000000000f1f2f000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e2e00634434b5940016000e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1f1f1f1f1f2f00002900000e1e2e000000464600000000460000004a39000000000000000000000000460000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000a0000160000000000000e
// 105:1e1e1e1e2e000000000000002900000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000b2000000000000000000000000000000000000000000000000000000660000000000000000000000000000000000860000000e1e1e1e1e1e2e0000000000000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e00000000000000002900000e1e2e00000000000000000000000000004a390000000046000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000900000e
// 106:1e1e1e1e2e547473b4b373c42900000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000660000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e2e0054747384840074000e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e003d4d00005600002900000e1e2e0000000000000046000000000000004a3900000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000a0000000000090000000a000000000e
// 107:1e1e1e1e2e000000000000002900000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000090000000000000d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e2e0000160000001600000e1e1e1e00000000003a0f1f1f1f1f1f1f1f2f003e4e00000000002900000e1e2e000000000000000000000000000000004a39000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000001600000000000000000000000e
// 108:1e1e1e1e2e000000000000002900000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1e1e1e2e00160000002900000000000000000000000000000000002900000e1e1e1d1d1d1d1d1d1d1d1d1d1d2d00000000004a0d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000900000000000e
// 109:1e1e1e1e1e1d2d0000000000290d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000293a393a393a393a393a393a393a393a393a4900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000009000000000000000000000a00000e
// 110:1e1e1e1e1e1e2e00000000004a1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f2f00560016004a494a494a494a494a494a494a494a494a490000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000a000000000000000000000e
// 111:1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e003d4d3d4d000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 112:1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e003e4e3e4e000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000056000000160000001600000000000000000000000000000066000d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000161600000000000e
// 113:1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e2e000000001600000000000000000084a3a3a3a3d6d6d6000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f2f0000000000000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e2e000000000000000000000000000000000e
// 114:1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e0000000000000000000000000e1e1e2e00000c00000009000009000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 115:1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e003a100000000000000c00000e1e1e2e00000000000000000000000000a37300b3840084e3737354b3349300000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 116:1e1e1e1e1e1e2e0000000000000e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e0029000000000000000000000e1e1e2e16000000000000560000160000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000140000000014000000140000000e
// 117:1e1e1e1e1e1e2e0000000000000f1f1f2f00000000000000000000000000000000008a000e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f2f00000000003a0f1f1f2f0029000000000000000000000e1e1e2e00000c00000000000000000056000000001600000056000016000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000033747300e444a40074733363e40083447400000000000000000000000000000000000000000000000000000000000000000000000094a3730053a333e3e3733493730000000000b6000e1e1e1e1e2e000000000000000000000000000000000e
// 118:1e1e1e1e1f1f2f00000000000000000000003473b47374009474a48494000009000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000004a2a2a2a2a2a49000000000900000000000e1e1e2e00000000001400000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 119:1e1e1e2e00000000000000000000000000000000000000000000000000000000460000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000b000e1e1e2e000000000000000000160000000b00000b00000a00000a0000160000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000160000000000000000000e
// 120:1e1e1e2e000000000000000000000000000094a3730083e344c4737484000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000b0000000000000000000000000000000000000000000000000000000000000e1e1e2e00000c00000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 121:1e1e1e2e00000000004600000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000090000000000000000000000000000000000000000000a00000000000e1e1e2e160000000b000c000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000e1e1e1e1e2e00000c0000000000000b00000c0000000e
// 122:1e1e1e2e0000000000000000004600000000090046000a000b0047000c000000000700000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000a000000000000000000000e1e1e1e0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000e1e1e1e1e2e000000000000000000000000000000000e
// 123:1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000a00000000000000000000000000000000000000000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f000000000e1e1e1e1e2e000000000000000000000000000000000e
// 124:1e1e1e2e000a00aa00006b0000000086000d1d2d000000000000000000000d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000a00000000000000000000000000000a000009000000090000000000090000000e1e1e1ecdddedcddded1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f3a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a10000e1e1e1e1e2e000000000000000000000000001600000e
// 125:1e1e1e2e000000000000000000000000000e1e2e000008000038000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000b00000000000000000000000000000000000000000e1e1e1eccdcecccdcec1e1e1e2e3a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a49000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e00001600000b0000000c0000000000000e
// 126:1e1e1e2e000000000000000000000000000f1f2f000000000000000000000f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000009000000000000000000000000000000000000000000000000000000000e1e1e1ecdddedcddded1e1e1e2e290000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 127:1e1e1e2e000000102a2a2a2a2a2a2a2a2a2a2a2a390000000000000c00000900660e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000a00000000000000000000000000000000090000000a00000000000f1f1f2f00000000003a0f1f1f2f290000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e2e000000000000000b00000000000c00000e
// 128:1e1e1e2e00000000000000000000000000000000290000000000000000000000670e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000c0000000000000000000b00000000000a0000000000000000000000000000000000000000000000004a2a2a2a2a490000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 129:1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d4900000000000d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000001600000000000e
// 130:1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000b000000000000000000000e
// 131:1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0016000000000000000c0000000000000e
// 132:1e1e1e1e1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000001600000e
// 133:1e1e1e2e000000000e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000001600000000000000000000000e
// 134:1e1e1e2e000000000f1f1f1f1f1f1f1f1f1f1f2f0000090900000f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 135:1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e
// </MAP>

// <MAP1>
// 000:1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e
// 001:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 002:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 003:2e000000000000000000000000000000000000000000000000000000000000000000000000003a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a390000000000000000000000000000000000000000000000000000000000000000000000f33363730043e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 004:2e000000000000000000000000000000000000000000000000000000000000000000000000002900000093440094440043b3d373000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 005:2e000000000000000000000000000000000000000000000000000000000000000000000000002900000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000000000000000000000000000000000000000000000000000000000000000000000029000000000000000000000000000000000000000000000000000000000000000009b4d6537444534463b3e3730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 006:2e000000000000000000000000000016000000000000000000000000000000000000000000002900000e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000290000000000000000000b00000b00000b00000b00000b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 007:2e000000000000160000000000000000000000000000000000000000000000000000000000002900000e1e2e00000000000000000000000000000000000000000000004141414141000000000000000e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000029000000000000000000000000000000000000000000000000000000000000000009d333c433b3b300534463730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 008:2e000000000000000000000000000000000000000000000000000000000000000000000000002900000e1e2e000c0000000000000000000c00000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000e
// 009:2e000000000000000000000000000000000000000000000000000000000000000000000000004a10000e1e2e00000000000a0000000000000000000a000000000000000000000000000000001600000e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000290000000000000000000b0000000000000000000000000000000000000000000009f333d3b3f33300934474d3e400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 010:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e0000000000000000000c000016000000000000000000009696969696000000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 011:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e0000000016000c00000000000000000000000000000095a5a5959595a50000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000084547353b333e30094a33334d3840094440000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 012:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e0000240000000000000a00000000000000000000000095a5a5959695a50000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000161600000000000000000016000000000000000000000000000000000000000000000000000e
// 013:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e000000000000000000000000000c00000a000000000095a5a5959595a50000000000000e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000c63744454d53433f37300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 014:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e000000000000000c00000000000000000000000000009695a5959596a60000000000000e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000a9b90000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 015:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e00000c000016000000000000160000000000000000009796a6969697a70000000000000f1f1f1f1f1f1f1f1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000e
// 016:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e000000000000000000000000000000000000000000000097a79797a70000000000000000000000000000000e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d00000000002900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 017:2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e000000000000000000000000000000000000000000000000000000000000000000003a2a2a2a2a2a3900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e00000000004a0d1d1d1d1d1d1d1d1d1d2d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 018:2e00000000000000000000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d00000000004a0d1d1d2d002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 019:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0043b3d37300b38400c4b3340000000000000000000e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 020:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e002916000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 021:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000004600000009000000000000000000000000000f1e1ecdddedcddded1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000001616000000000000000000000000000000000000000e
// 022:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000009000000000002000000000000000000001f2f0000000000000e1e1e1e1e2e47474747474747474747474700000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000e
// 023:2e00000000000000000000001600000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f0000000000000e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e000000000000000900000000000000460000000000000000000000003d4d0e1e1e1e1e2e00000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 024:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000016000000000000000000000000000000000000000e1e1e2e002900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d2d000009000000000000000000000000000000000000000000003e4e0e1e1e1f1f2f00000b00000b000b0000000d1d2d0000006600000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 025:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000003a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a390000000000000000000e1e1e2e004a10000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000900000000000000000000000000460000000d1d1d1d1d1e1e2e00000000000000000000000000000e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 026:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000004a0d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d29000d1d1d1d1d1d1d1d1e1e1e2e000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000009000000000000000d1d1d1d2d000000000000000e1e1e1e1e1e1e2e00130000000b00000b0066000b000e1e2e0000470000000f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 027:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e29000e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000d1e1e1e1e1e2d0000000000000f1f1f1f1f1e1e2e00000000000000000000000000000e1e2e000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 028:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e29000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000d1e1e1f1f1f1e1e2d000000000000000000000e1e1e1d1d2d0000000000000b000b00000e1e2e000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 029:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e29000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000012000e1e2e0000000e1e1e2d0000860000000000000e1e1e1e1e2e000b000b000000000000000e1e2e00003d4d00000d1d2d000000000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 030:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e29000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000860000000e1e2e3a10000e1e1e1e1d1d2d0000000000000e1e1e1e1e2e00000000000000000b00000e1e2e00003e4e00000e1e2e000300000000000000000000000000000000000000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 031:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f0000000000000e1e1e1e1e1e1e1e1e1f1f1f1f1f1f2f29000e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00004600000d1d1d1e1e2e4a39000e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e2e000b0b00000300000000000e1e1eccdcecccdcec1e1e1e000000000000004700000001000000000000000000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 032:2e00000016000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e2e0000000000000029000e1e1e1e1e1e1e1e1e1e1e2e00000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000e1e1e1e1e2e0029000e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e2e00000000000000000000000e1e1ecdddedcddded1e1e1e000000000000000000000000000000000000000000005600000e1e1e2e000000000000000000000000000016000000000000000000000016000000000000000000000000000000000000000000000e
// 033:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000003a2a2a2a2a2a2a2a2a2a2a2a3900000000000e1e1e1e1e1e1e1e2e0000000000000029000e1e1e1e1e1e1e1e1e1e1e2e00000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000f1f1e1e1e2e0b290b0e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1e1e1eccdcecccdcec1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 034:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000d1d1d1d1d1d1d2d4900000000000e1e1e1e1e1e1e1e2e0000000000000029000e1e1e1e1e1e1e1e1e1e1e2e00001600000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000e1e1e2e0c290c0e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0003000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 035:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e0000001600000029000f1f1f1f1f1f1f1f1f1f1f2f00000016000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000004600000e1e1e2e0029000e1e1e1e1e1e2e3900000000001f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f00000000003a0f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 036:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e00000000000000290000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000e1e1e2e0b290b0f1f1f1f1f1f2f290000000000000000000000000000000000000000000000000000000000004a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a390e1e2e0000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 037:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e000000000000004a2a2a2a2a2a2a2a2a2a2a2a2a2a2a100000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2d0000000000000e1e1e2e002900000000000000002900000000000000000000000000000000000000000000000000000000000000000000000000004646000046460000000000290e1e2e0000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 038:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e004a2a2a2a2a2a2a2a2a490000000000000000000000008444f37394b3f373840083e344c47374840000000000000000004646000046460000000000290e1e2e0000000000000e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 039:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e2e0000000000000f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e0000000000000000000000000000000000000000000000e34484730094a373b3740074a3e494a3f3000d1d1d1d2d0000004646000046460000000000290e1e1eccdcecccdcec1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 040:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e2e00000000000000000000000000000e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000d1d2d000000000000000000000000000000000000000e1e1e1e2e0000004646000046460000000000290e1e1ecdddedcddded1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 041:2e00000000000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e2e00000000000000000000000000000e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e2e0073b47374e444347300f333d37384000000000e1e1e1e2e0000004646000046460000000000290e1e1eccdcecccdcec1e1e1e2e000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000e
// 042:2e00000000000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1e1d1d1d1d1d1d2d000000000000000e1e1e1e1e1e2e0000000000000000000c00000c00000c0000000000000000000e1e1e1e1f1f1f1f1f1f1f1f2f000000003a2a0f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1ecdddedcddded1e1e2e00f3b3849433d37384000000000000000000000e1e1e1e2e0000000000000000000000008a00290e1e1ecdddedcddded1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 043:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e001600000000000e1e1e1e1e1e2e000000150000000000000000000000000000000000050000000e1e1e2e00000000000000000000000000290000000000000000000000000e1e1e1e1e1eccdcecccdcec1e1e2e000000000000000000000000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e00000000003a0e1e1e2e000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000e
// 044:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000290000000e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000e1e1e1e1e1e2e0000000000000095a595a595a595a595a500000000000000000e1e1e2e000000000046000a0000000000290000090000000000000000000e1e1e1e1e1ecdddedcddded1e1e2e00634434b59400c3a46393730094a373f300000e1e1e1e2e4600004646000046460000000000290e1e2e0000000000290e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 045:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000004a1000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d2d0000000e1e1e1e1e1e2e0000000000000096a696a696a696a696a600000000000000000e1e1e2e00000000000000000000003d4d4a1000000000004600000000000e1e1e1f1f2f00000000003a1e1e2e000000000000000000000000000000000000000e1e1e1e2e0000000000000000000000008900290e1e2e000000102a490e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 046:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000e1e1e1e1e1e2e0000000000000097a797a797a797a797a700000000000000000e1e1e2e00000000000000000000003e4e000000000000000000000000000e1e2e0000000000000000290e1e2e00c3a4849400d3b3e3e30000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e0000000d1d1d1e1e1e2e000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000e
// 047:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000e1e1e1e1e1e2e000000070000000000000000000000000000000000000000000e1e1e2edb0000000000000d1d1d1d1d1d1d1d1d2d0000090000000900000e1e2e0000003a2a2a2a2a490e1e2e000000000000000000000000000000000000000e1e1e1e2e4600004646000046460000000000290e1e2e0001000e1e1e1e1e1e2e000000000046464646464646000000000000000000000000000000000000000000000000000000000000000000000000000e
// 048:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000e1e1e1e1e1e2e0000000000000000000c00000c00000c0000000000000000000e1e1e2e00000a00000a000e1e1e708090a01e1e2e0000000000000000000e1e2e0000002900000000000e1e2e000000000000000000000000000000000000000e1e1e1e2e0000000000000000000000008800290e1e2e0000000e1e1e1e1e1e2e000000004646000046000046460000000000000000000000000000000000000000000000000000000000000000000000000e
// 049:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e2e0000000e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000e1e1e2eda0000000000000e1e1e718191a11e1e2e0001000001000001000e1e2e0000002900000000000e1e2e000011000000000000000000000200000000000e1e1e1e2e0000000000000000000000000000290e1e2e0000000e1e1e1e1e1e2e000000004600000000000000460000000000000000000000000000000000000000000000000000000000000000000000000e
// 050:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d2d0000000007000000070000000e1e1e2e00000a00000a000e1e1e1e1e1e1e1e1e2e0000090000000900000e1e2e0000002900000000000e1e2e000000000000000000000000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e0000000e1e1e1e1e1e2e000000004600000000000000460000000000000000000000000000001600000000000000000000000000000000000000000e
// 051:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000e1e1e2e9b0000000000000e1e1e1e1e1e1e1e1e2e0000000000000000000e1e2e0000002900000000000e1e2e000000000000000000000000000000000000000e1e1e1e2e0068000000690000006a00000000290e1e2e0000000e1e1e1e1e1e2e000000004646000000000046460000000000000000000000000000000000000000000000000000000000000000000000000e
// 052:2e00000016000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000b000000000000000b00000000820000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000e1e1e2e000000000000000f1f1f1f1f1f1f1f1f2f0000000000000000000e1e2e0000004a2a2a2a2a390e1e2e000000000000000022000000000000000000000e1e1e1e2e0000000000000000000000000000290e1e2e0066000e1e1e1e1e1e2e000000000046460000004646000000000000000000000000000000000000000000000000000000000000000000000000000e
// 053:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000062000000000000000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000e1e1e2e00000046000000000000004600000000000000000000000000000e1e2e000a00000a00000a290e1e2e000000000000000000000000000000000000000e1e1e1e2e000000102a2a2a2a2a2a2a2a2a2a490e1e2e0000000e1e1e1e1e1e2e000000000046464600464600000000000000160000000000000000000000000000000000000000000000000000000000000e
// 054:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095a595a595a50000000e1e1e2e00000000000000000000000000000000000000000000000000000e1e2e0000000000000000290e1e2e000000000000000000000000000000000000000e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e2e0000000e1e1f1f1f1f2f000000000000004646460000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 055:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f10000000000000000000000000000000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000096a696a696a60000000e1e1e2e00000000000000000000000000000000000000004600000000000e1e2e0000000000000000290e1e1e1d1d1d1d2d0000000000000d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 056:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000959595959595959595950000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000097a797a797a70000000e1e1e2e00000000460000000000000000000000000000000000000000000e1e2e000a00000a00000a290e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f0000000e2e2c2c2c2c2c2c2c2c3b0000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000e
// 057:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f00000000095950000000000000000959500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f2f0000000000000000000000000e1e1e2e00000000000000000000460046000000000000000000000000000e1e2e0000003a2a2a2a2a490e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000e2ea48473e3738484002b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 058:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000009500000000000b000000009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000e1e1e2e0000000000000000000000000000000d1d1d1d1d1d1d1d1d1d1d1e1e2e0000002900000000000e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e003d4d000000000000007600000046000000030000000056000e2e84739494b33493842b0000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000e
// 059:2e00000000000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00f20000009595000000000000000000009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e0000000000000095a595a595a5000000000000000000000e1e1e2e0000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000002900150000000e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e003e4e000000000000000000000000000000000000000000000e2e2c2c2c2c2c2c2c2c4b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 060:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000009500000000000000000000009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e0000003d4d000096a696a696a60000000d1d1d1d1d1d1d1e1e1e1e1d1d1d1d1d1d1d1d2d0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000002900000c00000e1e1e1e1e1f1f2f3900000000000e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000e2ec5d543b3942a4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 061:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000095000000003a2a2a2a3900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e0000003e4e000097a797a797a70000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e00000029000c0c00000e1e1e1e2e0000002900000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000e2e0000000000000000000000000000560000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 062:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000009500000000290d1d2d2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000004a2a2a2a2a390e1e1e1e2e0000104900465600000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f0000000e2e84a333d3732a4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 063:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000959500000b00290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e0000000000000d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e2e0009000000000000290e1e1e1e2e000000004656570000000000000000000000000000000000000000000000000000000000000000000000000e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 064:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095950000000000290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e0000000000000000290e1e1e1e2e000000465657000000000000000100000000000000000000000000460000000300000000000000005600000e1e1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 065:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095000000000000290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000290e1e1e1e2e000000475700000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000c473e35344f3730094440000000000000000000000000000000000000e
// 066:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095000000000000290e1e2e2900009500000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f00000000003a0f1f1f1f1f1f1f1f1f1e1e1e1e2e0009000000000000290e1e1e1e2e0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 067:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000b00950000003d4d00290e1e2e2900000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000290000000000000000000e1e1e1e2e0000003a2a2a2a2a490e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00e8f800000000000000003300433353d3744444f3840000000000000000000000000000000000000e
// 068:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000950000003e4e00290e1e2e2900000b00000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000003a2a2a2a2a2a2a2a2a2a2a10290000000000000000000e1e1e1e2e0000002900000000000e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00e9f9000000000000000000000000000000000000000000000000000000000000000000000000000e
// 069:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000095000000000000290e1e2e2900000000000e1e1e1e1e1e2e0000000e1e1e1e1e1e1e1e2e2a2a2a2a2a390e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000029434444f3737433349300c6290000000000000000000e1e1e1e2e00000029003d4d76000e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e
// 070:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000290e1e2e4900000000000e1e1e1f1f1f2f0000000f1f1f1f1f1f1f1f2f0000000000290f1f1f1f1f1f1f1f1f1e1e1e1e2e000000000000000000290000000000000000000000290000000000000000000e1e1e1e2e00000029003e4e00000e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e003a10000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d2d00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 071:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000290e1e1eccdcecccdcec1e1e2e000000000000000000000000000000000000000000290000000000000000000e1e1e1e2e000000000000000000290000747394a47434000000290000000000000000000e1e1e1e2e0000002900000000000e1e1e1f2f00000000003a0f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f002900000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 072:2e00000000000016000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000092000000000000290e1e1ecdddedcddded1e1e2e000000000000000000000000000000000000000000290000000000000000000e1e1e1e2e0000000000000000004a2a2a2a2a2a2a2a2a2a2a2a490000000000000000000e1e1e1e2e0000004a2a2a2a2a390e1e2e000000000000004a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a49000000000000007a007a000000000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 073:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000290e1e1eccdcecccdcec1e1e2e000000000096a696a696a696a696a696a60000000029000000000c000000000e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e000a00000a00000a290e1e2e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 074:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000b00000010490e1e1ecdddedcddded1e1e2e000000000097a797a797a797a797a797a70000102a490000000000000000000e1e1e1e2e000068000000000000090000000a0000000b0000000c0000006900006a00000e1e1e1e2e0000000000000000290e1e2e00004600000000000000000000000000000000000000000000000000000d1d1d1d1d2d0000000000000000007600000000000000030000003a1000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 075:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000e1e2e0000000000000f1f2f000000000096a60000000000000000000000000000000000000000000000000e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e0000000000000000290e1e2e00000000000000004600000000460000000000000000004600000000000e1e1e1e1e2e000000000046000000000000470000000000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 076:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1e1e2e000000000000000000000000000097a70000000000000000000000000000000000000000160000000e1e1e1e2e000000000000000000000000000000af0000000000000000000000000000000e1e1e1e2e000a00000a00000a290e1e2e0000003d4d0000000000000000000000000000000000000000000000000f1f2f0f1f2f000000000000000000000000000000000000460000290000000e1e2e00000000000000000000000000000000160000000000000000000000000000000000000000000e
// 077:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000096a696a696a696a696a696a600000000000000000000000000000c0000000000000000000e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e0000003a2a2a2a2a490e1e2e0000003e4e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 078:2e00000000000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000097a797a797a797a797a797a70000000000000000000000000000000000000000000000000e1e1e1e2e00000000003c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c3b00000000000e1e1e1e2e0000002900000000000e1e2e00000000000000000000000000000d1d1d1d1d2d0000000000000000000000006a000000000000000000000000000d1d1d1d2d0000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 079:2e00000000000000000000160000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e2e00000000002b000000000000000000000000000000000000002b00000000000e1e1e1e2e0000002900000000000e1e2e00000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000d1d1d2d0000000000000e1e1e1e2e0000000000290088000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 080:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000d1d1d2d0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e2e00000000002b0000c4000000000000000000000000000000002b00000000000e1e1e1e2e0000002900000000000e1e2e00000000000000000000000000000e1e1e1e1e2e000000ca0000000000000000000000000e1e1e2e0000000000000e1e1e1e2e0000000000290000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 081:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000002b003384630000000000000000000000000000002b000d1d1d1d1e1e1e1e2e0000002900000000000e1e1e1d1d1d1d1d1d2d000000000000000e1e1e1e1e2e000000000000000000000000470000000e1e1e2e0000000000000e1e1e1e2e3a2a2a2a2a490088000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 082:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f2f003d4d000000000e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000002b0000000000000000000000000000000000e5002b000e1e1e1e1e1e1e1e2e00102a4900000000000e1e1e1e1e1e1e1e1e2e000000000000000e1e1e1e1e2e00000000000d1d1d1d1d2d00000000000f1f1f2f0000000000000f1f1f1f2f2900000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 083:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000003e4e000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e2e00000000002b00000000000000000000000000000000f6e6f52b000e1e1e1e1e1e1e1e2e0000000000000010390f1f1f1f1f1f1e1e1e2e000000000000000f1f1f1f1f2f00000000000e1e1e1e1e2e0000000000000000000000000000003a2a2a2a2a4900000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 084:2e00000000000000160000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000c00000c00000c0000000000000000000000000e1e1e1ecdddedcddded1e1e1e1e1e1e2ed1d1d1d1d1d1d1d2d2d200d2d2000e1e1e1e1e1e2e00000000004c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c4b000e1e1e1e1e1e1e1e2e0000000000000000290000000000000e1e1e2e0000000000000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000029000000000000000000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 085:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000e1e1e2e3900000000000f1f1f1f1f1f2f00000000000000000000000000000e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e2e0000000000000000290000000000000e1e1e2e0000000000000000000000000057000000000e1e1e1e1e2e00030000000000000000002300000029000047000000aa0000000000000e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 086:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e2f4a39000000000000000000000000000000000000000000000000000e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1d1d1d1d1d2d000c290c00000009000e1e1e2e0000000000000000680000000000000000000e1e1e1e1e2e00000000000046000000000000000029000000000000000000000d1d1d1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 087:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e003a49000000000000000000000000000086000000000000860000000e1e1e1e1e1e2e000000000000000000000000000000000046000000000d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e003a490000000000000e1e1e2e00004600000000000000000000000d1d1d1d1e1e1e1e1e2e0000000000000000000000000000004a2a2a2a390000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 088:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e004a3900000000000a000066000000000000000000000000000000000e1e1e1e1e1e2e000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0c2900000c000009000e1e1e2e000000000000000000000000ca000e1e1e1e1e1e1e1e1e2e00000d1d2d00000000000000000000000d1d2d290000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 089:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000e1e2e00004a100000000000000000000000000000000000000000000000000e1e1e1e1e1e2e000046000000000000005600000000000000005600000e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e2e004a390000000000000e1e1e2e00000000000000000000000000000f1f1f1f1e1e1e1e1e2e00000e1e2eda000000000000000000000e1e2e290000000046000e1e1e1e1e2e00000016000000000000000000000000000000000000000000000000000000000000000000000e
// 090:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000e1e2e00000000000000000000000a000000000086000000000000000000000e1e1e1e1e1e2e000000464600090000000000000000000046000000000e1e2e00000000000000000000000000000e1e2e000c290c00000009000e1e1e2e000000000000000d2d3a2a2a2a2a2a2a2a391e1e1e1e1e2e00000f1f2f000000003a2a2a2a2a2a390e1e2e290000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000160000000000000000000000000e
// 091:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000a2000000000000000009000000a200000000000e1e2e000000000000660000000000000000000000000000008600000000000e1e1e1e1e1e2e005600000000000000000000000a00004646000c00000e1e2e00000000003a2a2a2a39003a10000e1e2e0000290000000000000e1e1e2e0000000000ca000e2e2900000000000000290e1e1e1e1e2e000000000000000000290000000000290e1e2e290000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 092:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000660000000000000000000000000e1e2e0000000a0000000000000000000000000000000000000000000000000e1e1e1e1e1e2e000000000900000009000056000000460000000000000e1e2e00005600002900000029002900000e1e1e1d2d4900000000000d1e1e1e2e000000000000000f2f2900000000000100290e1e1e1e1e2e000000000000000000290000000000290f1f2f290000000000000e1e1e1e1e2e00000000000000000000000000000016000000000000000000000000000000000000000000000e
// 093:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000e1e2e000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e2e00000000000000000000000000004600000000000b000e1e2e00000000004a0d1d2d4a2a4900000e1e1e1e1eccdcecccdcec1e1e1e1e2e3a2a2a2a2a2a2a2a2a4900000000000000290f1f1f1f1f2f3a2a2a2a2a2a2a2a2a4900000000004a2a2a2a490000000000000e1e1e1e1e2e00000000000000000000000000001600000000000000000000000000000000000000000000000e
// 094:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e00102a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a390e1e2e0000000000000d1d1d1d1d1d1d1d1d1d2d00000000000000000000000e1e1e1e1e1e2e0000000046000a0056000000000046000009000000000e1e1eccdcecccdcec1e1e2e00000000000e1e1e1e1ecdddedcddded1e1e1e1e2e29000000000000000000000000000000004a2a2a2a2a2a2a49000000000000000000000000000000000000000000460000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 095:2e00000000000000001600000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000290e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000e1e1e1e1e1e2e000b0000000000000000000c000000000000000000560e1e1ecdddedcddded1e1e2e00000046000e1e1e1e1eccdcecccdcec1e1e1e1e2e29000000000000000000001300000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 096:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000e0290e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000e1e1e1e1e1e2e000c00160b00460016000000000066004646464600000e1e1eccdcecccdcec1e1e2e00000000000e1e1e1e1ecdddedcddded1e1e1e1e2e29000000000000460000000000000000000000460000000000000000000000000000000046000000000000000000000000000e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 097:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000009000000000000090000000000290e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e2e00000000008600008600000e1e1e1e1e1e2e000000000000000000000000160000000000000000000e1e1ecdddedcddded1e1e2e00103900000e1e1e1f2f0000000000000e1e1e1e2e29000000000000000000000000000000000000000000000000004600000000680000000000000000000000000100000047470e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 098:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000290e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000e1e1e1e1e1e2e000016000c0016000c00560000000c000000000c00000f1f2f0000000000000e1e2e00002900000e1e2e00000000000000000e1e1e1e2e29000000000000000000000000000000000000000000000000000000000000000000000000004600000000000000004747470e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 099:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000660000000000000000660000000000000000290f1f2f3900000000000f1f1f1f1f1f1f1f1f1f2f00000000000000000000000e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000046460000000e1e2e00002900000e1e2e00000000000000000e1e1e1e2e290000000000000000000000000000880000006800aa006a00000000000000000000000000000000000000000000474747470e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000001600000000000e
// 100:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e00000900000000000000000000000000000009000000004a2a2a2a490000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d2d00000c00160009000b00000c0000460000000e1e2e00002900000e1e2e00000000000046000e1e1e1e2e29000046000000000000000000000000000000000000000000000000000000000000000000000000000000000000474747470e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000e
// 101:2e00000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008600000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000e1e2e00002900000e1e2e00004600000000000f1f1f1f2f2900000000000000000046460000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000000000000000000000000000e
// 102:2e00001039000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000d1d2d0000000a00000000000a0000000000000000000000000000000000000e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1e1e1e2e0000000000000d1d1d1d1d1d1d1d1d1d1d1d1e1e2e00002900000e1e2e000000000000000000000000002900000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 103:2e00000029000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000066000000000000000000000e1e2e000000000000000000000000660000000000000000009200000000000e1e1e1e1e1e2e0000000000000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00002900000e1e2e000000000000000000000000002900000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 104:2e00000029000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000090000000000000009000000000000000000000000000f1f2f000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e2e00634434b5940016000e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1f1f1f1f1f2f00002900000e1e2e000000464600000000460000004a39000000000000000000000000460000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000160000000000000e
// 105:2e00000029000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000b2000000000000000000000000000000000000000000000000000000660000000000000000000000000000000000860000000e1e1e1e1e1e2e0000000000000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e2e00000000000000002900000e1e2e00000000000000000000000000004a390000000046000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 106:2e00000029547473b4b373c40000000e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000660000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e2e0054747384840074000e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e2e003d4d00005600002900000e1e2e0000000000000046000000000000004a3900000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 107:2e00000029000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000090000000000000d1d1d1d1d1d1d1d1d1d1d1d1d2d0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e2e0000160000001600000e1e1e1e00000000003a0f1f1f1f1f1f1f1f2f003e4e00000000002900000e1e2e000000000000000000000000000000004a39000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000001600000000000000000000000e
// 108:2e00000029000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1e1e1e2e00160000002900000000000000000000000000000000002900000e1e1e1d1d1d1d1d1d1d1d1d1d1d2d00000000004a0d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 109:1e2d0000290000000d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000293a393a393a393a393a393a393a393a393a4900000e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 110:1e2e00004a2a2a2a1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f2f00560016004a494a494a494a494a494a494a494a494a490000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 111:1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 112:1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000056000000160000001600000000000000000000000000000066000d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000161600000000000e
// 113:1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e2e000000001600000000000000000084a3a3a3a3d6d6d6000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f2f0000000000000f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e2e000000000000000000000000000000000e
// 114:1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e0000000000000000000000000e1e1e2e00000c00000009000009000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 115:1e2e0000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e2e003a100000000000000c00000e1e1e2e00000000000000000000000000a37300b3840084e3737354b3349300000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 116:1e2e0000000000000e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e2e0029000000000000000000000e1e1e2e16000000000000560000160000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 117:1e2e0000000000000f1f1f1f1f1f1f1f2f00000000000000000000000000000000008a000e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f2f00000000003a0f1f1f2f0029000000000000000000000e1e1e2e00000c00000000000000000056000000001600000056000016000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000033747300e444a40074733363e40083447400000000000000000000000000000000000000000000000000000000000000000000000094a3730053a333e3e3733493730000000000b6000e1e1e1e1e2e000000000000000000000000000000000e
// 118:1e2f000000000000000000000000000000003473b47374009474a48494000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000004a2a2a2a2a2a49000000000900000000000e1e1e2e00000000001400000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 119:2e00000000000000000000000000000000000000000000000000000000000000460000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000000000000000000000b000e1e1e2e000000000000000000160000000b00000b00000a00000a0000160000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000160000000000000000000e
// 120:2e000000000000000000000000003800000094a3730083e344c4737484000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000b0000000000000000000000000000000000000000000000000000000000000e1e1e2e00000c00000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 121:2e00000000000000004600000000000000000000000000000000000000000000001800000e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000900000000000000000000000b0000000000000000000a00000000000e1e1e2e160000000b000c000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d000000000e1e1e1e1e2e000000000000000000000000000000000e
// 122:2e00000000000000000000000046000000006600460066006600470066000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000000000000000000000000000000000000000000000a000000000000000000000e1e1e1e0000000000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000e1e1e1e1e2e000000000000000000000000000000000e
// 123:2e00000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000a00000000000000000000000000000000000000000000000e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f000000000e1e1e1e1e2e000000000000000000000000000000000e
// 124:2e000000000000aa00006b000000008600000000000000000000000000000d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000a000000000000000000003d4d00000a000009000000090000000000090000000e1e1e1ecdddedcddded1e1e1e1e1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f2f3a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a10000e1e1e1e1e2e000000000000000000000000000000000e
// 125:2e00000000000000000000000000000000000000000007000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000003e4e000000000000000000000000000000000000000e1e1e1eccdcecccdcec1e1e1e2e3a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a49000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000016000000000000000000000000000e
// 126:2e00000000000000000000000000000000000000000000000000000000000f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000009000000000000000000000000000000000000000000000000000000000e1e1e1ecdddedcddded1e1e1e2e290000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e2e000000000000000000000000000000000e
// 127:2e000000000000102a2a2a2a2a2a2a2a2a2a2a2a390000000000007600000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000a00000000000000000000000000000000090000000a00000000000f1f1f2f00000000003a0f1f1f2f290000000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e2e000000000000000000000000000000000e
// 128:2e00000000000000000000000000000000000000290000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e0000000c0000000000000000000b00000000000a0000000000000000000000000000000000000000000000004a2a2a2a2a490000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 129:2e00000d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d2d4900000000000d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000001600000000000e
// 130:2e00000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 131:2e00000e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 132:2e00000f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1eccdcecccdcec1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 133:2e000000000000000e1e1e1e1e1e1e1e1e1e1e1ecdddedcddded1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 134:2e000000000000000f1f1f1f1f1f1f1f1f1f1f2f0000000000000f1f1f1f1f1f1f1f1f1f1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e2e000000000000000000000000000000000e
// 135:1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1e1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1e
// </MAP1>

// <WAVES>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// 003:457acdeffffefedbabbcdefffedcb986
// 004:56565656565656565656565656565656
// 005:34443223554356624565246735524332
// 007:4456978999bb98765678899999acba77
// 011:5d4466f5870c4777b7f0b66bab865000
// 012:0033007e01550b7bba01b00cc3ccc88c
// 013:dddddddddddddcccccc8cdcc3ccccccc
// 014:5acb9766557889654444444333221000
// 015:1111111111aaaaaaaaa66666666ddddd
// </WAVES>

// <WAVES1>
// 000:00000000ffffffff00000000ffffffff
// 001:0123456789abcdeffedcba9876543210
// 002:0123456789abcdef0123456789abcdef
// 003:457acdeffffefedbabbcdefffedcb986
// 004:56565656565656565656565656565656
// 005:34443223554356624565246735524332
// 007:4456978999bb98765678899999acba77
// 011:5d4466f5870c4777b7f0b66bab865000
// 012:0033007e01550b7bba01b00cc3ccc88c
// 013:dddddddddddddcccccc8cdcc3ccccccc
// 014:5acb9766557889654444444333221000
// 015:1111111111aaaaaaaaa66666666ddddd
// </WAVES1>

// <SFX>
// 000:030003000300030003000300030003000300030013001300230033005300630073009300a300b300b300c300d300e300f300f300f300f300f300f300234000000000
// 001:a100a100a100a100a100b100b100c100c100c100c100c100d100d100d100d100e100e100e100e100f100f100f100f100f100f100f100f100f100f100307000000000
// 002:630073008300830093009300a300b300c300d300d300d300d300d300e300e300e300f300f300f300f300f300f300f300f300f300f300f300f300f300312000000000
// 004:030003000300030003000300030003000300030003000300030003000300030003000300030003000300030003000300030003000300030003000300202000060000
// 008:ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00309000000000
// 012:9803987bf808f809f809f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f8003fb000000000
// 013:060766008600b600d600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600312000000000
// 016:0c000c00fc00fc005c006c006c006c007c007c007c008c008c009c009c009c009c009c00ac00ac00ac00ac00ac00dc00dc00dc00dc00ec00ec00ec00289000000000
// 017:58d088d0a800d800e800f800f800e800e800e800d800d800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800300000000000
// 018:be308e9e8e9c7eaa8ec89e889e6a9e6aae6bfe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00300000000000
// 019:48008800a800d800e800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800302000000000
// 020:0800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800401000000000
// 028:0d081d081d082d092d093d093d0a4d0a5d0b5d0b6d0b6d0b7d0b7d0b7d0c8d0c9d0c9d0cad0dad0dad0dbd0dbd0ebd0ecd0edd0edd0eed0eed0efd0e372000000000
// 029:4d003d002d000d000d000d001d002d002d003d004d004d003d003d002d002d001d001d002d003d004d004d004d003d002d001d001d002d004d00fd00402000000000
// 030:ed00ed00ed00ed00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00cd00cd00bd00bd00ad00ad009d008d007d006d004d000d00fd00001000000000
// 031:1700270027003700370037004700470047005700570067006700770077008700970097009700a700b700b700b700c700c700e700e700e700f700f700236000000000
// 032:e500d500c500b500a5009500850075006500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500444000000000
// 033:f500f500f500f500f500f500f500f500f5006500750085009500a500b500c500d500e500f500f500f500f500f500f500f500f500f500f500f500f500341000000000
// 042:13002300330033004300530063007300730083009300a300b300c300c300c300c300d300d300e300f300f300f300f300f300f300f300f300f300f300309000000000
// 048:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000307000000000
// 054:c000c000a0008000700060105010201020102010201020102010301030105010b010d010e010e010f000f000f000f000f000f000f000f000f000f000009000001b00
// 055:5300730083009300f300f300f300f3009300a300b300c300d300f300f300f300f300f300c300c300d300f300f300e300e300e300e300e300e300f300500000000000
// 056:b000b000b000b000a010a010a010a0109060906090609060a010a010a060a060a060a060a060a060a060f000f000f000f000f000f000f000f000f000430000000000
// 057:d900b900b92089301940f950f950f950f960f900f970f980f990f9a049a069809960b950d940f920f910f900f900f900f900f900f900f900f900f900405000000000
// 058:0a000a000a000a000a000a00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00409000000000
// 059:d000c000c000c000b000b000a000700040002000100010001000500070008000a000b000c000d000d000e000e000e000f000e000f000e000f000f000605000000000
// 062:e900e900d910d910c910b920b920a9309950897075c075c09900d900e900e900f900f900f900f900f900f900f900f900f900f900f900f900f900f900417000000000
// 063:410771078107a107b107b107c107c107d107d107e107e107e107e107e107e107e107e107f107f107f107f107f107f107f107f107f107f107f107f107415000000000
// </SFX>

// <SFX1>
// 000:030003000300030003000300030003000300030013001300230033005300630073009300a300b300b300c300d300e300f300f300f300f300f300f300234000000000
// 001:a100a100a100a100a100b100b100c100c100c100c100c100d100d100d100d100e100e100e100e100f100f100f100f100f100f100f100f100f100f100307000000000
// 002:630073008300830093009300a300b300c300d300d300d300d300d300e300e300e300f300f300f300f300f300f300f300f300f300f300f300f300f300312000000000
// 004:030003000300030003000300030003000300030003000300030003000300030003000300030003000300030003000300030003000300030003000300202000060000
// 008:ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00ab00309000000000
// 012:9803987bf808f809f809f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f8003fb000000000
// 013:060766008600b600d600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600f600312000000000
// 016:0c000c00fc00fc005c006c006c006c007c007c007c008c008c009c009c009c009c009c00ac00ac00ac00ac00ac00dc00dc00dc00dc00ec00ec00ec00289000000000
// 017:58d088d0a800d800e800f800f800e800e800e800d800d800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800300000000000
// 018:be308e9e8e9c7eaa8ec89e889e6a9e6aae6bfe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00fe00300000000000
// 019:48008800a800d800e800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800302000000000
// 020:0800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800f800401000000000
// 028:0d081d081d082d092d093d093d0a4d0a5d0b5d0b6d0b6d0b7d0b7d0b7d0c8d0c9d0c9d0cad0dad0dad0dbd0dbd0ebd0ecd0edd0edd0eed0eed0efd0e372000000000
// 029:4d003d002d000d000d000d001d002d002d003d004d004d003d003d002d002d001d001d002d003d004d004d004d003d002d001d001d002d004d00fd00402000000000
// 030:ed00ed00ed00ed00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00dd00cd00cd00bd00bd00ad00ad009d008d007d006d004d000d00fd00001000000000
// 031:1700270027003700370037004700470047005700570067006700770077008700970097009700a700b700b700b700c700c700e700e700e700f700f700236000000000
// 032:e500d500c500b500a5009500850075006500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500f500444000000000
// 033:f500f500f500f500f500f500f500f500f5006500750085009500a500b500c500d500e500f500f500f500f500f500f500f500f500f500f500f500f500341000000000
// 048:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000307000000000
// 054:c000c000a0008000700060105010201020102010201020102010301030105010b010d010e010e010f000f000f000f000f000f000f000f000f000f000009000001b00
// 055:5300730083009300f300f300f300f3009300a300b300c300d300f300f300f300f300f300c300c300d300f300f300e300e300e300e300e300e300f300500000000000
// 056:b000b000b000b000a010a010a010a0109060906090609060a010a010a060a060a060a060a060a060a060f000f000f000f000f000f000f000f000f000430000000000
// 057:d900b900b92089301940f950f950f950f960f900f970f980f990f9a049a069809960b950d940f920f910f900f900f900f900f900f900f900f900f900405000000000
// 058:0a000a000a000a000a000a00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00fa00409000000000
// 059:d000c000c000c000b000b000a000700040002000100010001000500070008000a000b000c000d000d000e000e000e000f000e000f000e000f000f000605000000000
// 062:e900e900d910d910c910b920b920a9309950897075c075c09900d900e900e900f900f900f900f900f900f900f900f900f900f900f900f900f900f900417000000000
// 063:410771078107a107b107b107c107c107d107d107e107e107e107e107e107e107e107e107f107f107f107f107f107f107f107f107f107f107f107f107415000000000
// </SFX1>

// <PATTERNS>
// 000:bff102000000b88104baa1029ff1020000009881049aa1027ff1020000007881047aa1026ff1020000006881046aa102000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 001:000000b0001a000000b0001a00000090001a00000090001a000000b0001a000000b0001a000000b0001a000000b0031a000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 002:000000e0001a000000e0001a000000d0001a000000d0001a000000e0001a000000e0001a000000d0001a000000d0031a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 003:00000060001c00000060001c00000060001c00000060001c00000060001c00000060001c00000060001c00000060031c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 011:600006000000c00006000000600006c00006000200600006000300000000000000e00004000000a00004000000d00006000000a00004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </PATTERNS>

// <PATTERNS1>
// 000:bff102000000b88104baa1029ff1020000009881049aa1027ff1020000007881047aa1026ff1020000006881046aa102000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 001:000000b0001a000000b0001a00000090001a00000090001a000000b0001a000000b0001a000000b0001a000000b0031a000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 002:000000e0001a000000e0001a000000d0001a000000d0001a000000e0001a000000e0001a000000d0001a000000d0031a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 003:00000060001c00000060001c00000060001c00000060001c00000060001c00000060001c00000060001c00000060031c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 011:600006000000c00006000000600006c00006000200600006000300000000000000e00004000000a00004000000d00006000000a00004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// </PATTERNS1>

// <TRACKS>
// 000:180301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070
// 001:c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ec0080
// </TRACKS>

// <TRACKS1>
// 000:180301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070
// 001:c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ec0080
// </TRACKS1>

// <SCREEN>
// 000:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9999000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b0000000000000000000
// 001:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa999000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bbbbb000000000000000
// 002:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa99000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b0bbbbbb0000000000000
// 003:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa999000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb0bbbb0b000000000000
// 004:a00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00aa00aa9990000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b0bb0bb0bb000000000000
// 005:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000550050005555500055005000555550005555000000000000055550005555000055005000055550000555500000000000000000000000000000000000000000000000b0b00bbbb000000000000
// 006:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000055505000556660005500500055666000556650000000000006556000556650005500500055566000065560000000000000000000000000000000000000000000000b0bb0bbbb0000000000000
// 007:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000055555000555500005500500055550000550050000000000000550000550050005500500065550000005500000000000000000000000000000000000000000000000b0b0bbbbb0000000000000
// 008:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000055655000556600006555600055660000555560000000000000550000555560005500500006555000005500000000000000000000000000000000000000000000000000bbbb000000000000000
// 009:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000550650005555500006560000555550005566500000000000005500005566500065556000555560000055000000000000000000000000000000000000000000000000000000000000000000000
// 010:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000660060006666600000600000666660006600600000000000006600006600600006660000666600000066000000000000000000000000000000000000000000000000000000000000000000000
// 011:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 012:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 013:0001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00a0000000000000000000000000000000000000000
// 014:0001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000a000000000000000000000000000000000000000
// 015:0001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000a000000000000000000000000000000000000000
// 016:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a0000000000000000000000000000000000000
// 017:0001110000000000000000000000000000000000000000000000ee0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000a0a0000000000000000000000000000000000000
// 018:0001110000000000000000000000000000000000000000000000ee00ee0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000a0000000000000000000000000000000000000
// 019:0001110000000000000000000000000000000000000000000ee00000ee0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a00a0000000000000000000000000000000000000
// 020:0001110000000000000000000000000000000000000000000ee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a0000000000000000000000000000000000000000
// 021:00011100000000000000000000000000000000000000000000000eee00ee000000000000000000000000000055550005500500055555000000000005555500055000000055500005000500055555000555500000555500000000000000000000000000000000000000000000000000000000000000000000
// 022:0001110000000000000000000000000000000000000000000000eeeee0ee00000000000000000000000000006556000550050005566600000000000556660005500000055665000505050005566600055665000555660000000000000000000000000000000ee00ee0000000000000000000000000000000
// 023:000111000000000000000000000000000000000000000000ee00eeeee00000000000000000000000000000000550000555550005555000000000000555500005500000055005000555550005555000055005000655500000000000000000000000000000000ee00ee0000000000000000000000000000000
// 024:000111000000000000000000000000000000000000000000ee00eeeee0000000000000000000000000000000055000055665000556600000000000055660000550000005500500055555000556600005555600006555000000000000000000000000000ee0000000000ee000000000000000000000000000
// 025:00011100000000000000000000000000000000000000000000000eee0ee00000000000000000000000000000055000055005000555550000000000055000000555550006555600055655000555550005566500055556000000000000000000000000000ee0000000000ee000000000000000000000000000
// 026:00011100000000000000000000000000000000000000000000ee00000ee0000000000000000000000000000006600006600600066666000000000006600000066666000066600006606600066666000660060006666000000000000000000000000000000000000000000000000000000000000000000000
// 027:00011100000000000000000000000000000000000000000000ee00ee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eee00000000000000000000000000000000
// 028:000111000000000000000000000000000000000000000000000000ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000eeeeeee000ee0000000000000000000000000
// 029:000111000000a00a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000eeeeeee000ee0000000000000000000000000
// 030:000111000000a000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeee00000000000000000000000000000
// 031:000111000000a000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeee00000000000000000000000000000
// 032:0001110000000000a0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee000eeeeeeeee00ee0000000000000000000000000
// 033:000111000000a000a0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000eeeeeee000ee0000000000000000000000000
// 034:0001110000000a0000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeee000000000000000000000000000000
// 035:0001110000000a0a00a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eee00000000000000000000000000000000
// 036:0001110000000a0a0000000000000000000000000000000000000000000000000000000000000ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000000000ee000000000000000000000000000
// 037:00011100000000000000000000000000000000000000a00a00000000000000000000000000000ee000000000000000000000a00a000000000000000000000000000000000000000000000a000a000000000000000000000000000000000000000000000ee0000000000ee000000000000000000000000000
// 038:00011100000000000000000000000000000000000000a000a000000000000000000000000000000000000000000000000000a000a0000000000000000000000000000000000000000000a000a00000000000000000000000000000000000000000000000000ee00ee0000000000000000000000000000000
// 039:00011100000000000000000000000000000000000000a000a000000000000000000000000000000000000000020000000000a000a0000000000000009900000000000000002000000000a000a00000000000001619000000000000000000000000000000000ee00ee0000000000000000000000000000000
// 040:000111000000000000000000000000000000000000000000a0a00000000000000000000000000000000000000e00000000000000a0a0000000000009a000000000000000f200000000000000a00a0000000000111a0000000000000000000000000000000000000000000000000000000000000000000000
// 041:00011100000000000000000000000000000000000000a000a0a0000000000000000000000000000000000000e80000000000a000a0a0000000000090a00000000000000f4f00000000000a00a0a0000000000061690000000000000000000000000000000000000000000000000000000000000000000000
// 042:000111000000000000000000000000000000000000000a0000a000000000000000000000000000000000000e8000000000000a0000a000000000011011000000000000f4f400000000000a0000a000000000009a9a0000000000000000000000000000000000000000000000000000000000000000000000
// 043:000111000000000000000000000000000000000000000a0a00a00000000000000000000000000000000000e80000000000000a0a00a0000000000110110000000000004f4000000000000a0a00a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 044:000111000000000000000000000000000000000000000a0a00000000000000000000000000000000000000000000000000000a0a000000000000000000000000000000000000000000000a0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 045:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 046:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 047:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000000000000000000000000000000000000000000000000000000000
// 048:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000000000000000000000000000000000000000000000000000000000
// 049:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 050:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 051:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 052:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 053:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009990999009909990099099900990999009909990099099900990990000
// 054:00011100000000000000000000000000000000000000000000000000000000200020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999aa999999aa999999aa999999aa999999aa999999aa9999990000
// 055:000111000000000000000000000000000000000000000000000000000000000202000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 056:000111000000000000000000000000000000000000000000000000000000002220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 057:0001110000000000000000000000000000000000000000000000000000000200222000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9999999999999999999999999999999999999999999999999999990000
// 058:0001110000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009a9999999999999999999999999999999999999999999999999999990000
// 059:000111000000000000000000000101100000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 060:101111000000000000000000011010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 061:101101010000000000000001101101100000000000000000000000000000000000000000000000000000000000000000000000000000000000000088880000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 062:110111010000000000000000110111010000000000000000000000000000000000000000000000000000000000000000000000000000000000008888888800000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 063:111000110000000000000000111000110000000000000000000000000000000000000000000000000000000000000000000000000000000000000222222000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 064:111101110000000000000000111101110000000000000000000000000000000000000000000000000000000000000000000000000000000000000022822000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 065:0111111100000000000000001111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000008888800000000000000000000000000000000000000000000000000000000000a9999999999999999999999999999999999999999999999999999990000
// 066:001011100000000000000000011011100000000000000000000000000000000000000000000000000000000000000000000000000000000000008088880000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 067:000111100000000000000000010111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000080080000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 068:001110000000000000000000001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 069:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999aa9a999aa9aa999aa9aa9999999999999999999999999999999990000
// 070:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099aaaa9aaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 071:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 072:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 073:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099aaaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 074:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 075:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 076:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099a0aaaa0aaaa00a0aaaa00a999999999999999999999999999999990000
// 077:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000000000000999999999999999999999999999999990000
// 078:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000999999999999999999999999999999990000
// 079:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000000000000999999999999999999999999999999990000
// 080:200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000099999999999999999999999999999990000
// 081:2222444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444440000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000a9999999999999999999999999999990000
// 082:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000099999999999999999999999999999990000
// 083:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000099999999999999999999999999999990000
// 084:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 085:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 086:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 087:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 088:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999990000
// 089:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9999999999999999999999999999990000
// 090:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999990000
// 091:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999990000
// 092:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 093:909990099099900990999009909990099099900990999009909990099099900990999009909990099099900990990990990000004000000000000000000000000000000000000000000000999099900990999009909990099099900990999009909990099099999999999999999999999999999999990000
// 094:9999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa9999999999999000004000000000000000000000000000000000000000000099999999aa999999aa999999aa999999aa999999aa999999aa999999999999999999999999999999999999990000
// 095:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999900004000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 096:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999900004000000000000000000000000000000000000000000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 097:99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999904444400000000000000000000000000000000000000000000a999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 098:99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999a00000000000000000000000000000000000000000000000009a999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 099:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 100:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999900000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 101:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999988888888888888888888888888888888888888888888888899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 102:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 103:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 104:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 105:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 106:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 107:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 108:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 109:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 110:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 111:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 112:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 113:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 114:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 115:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 116:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 117:9aa999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 118:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 119:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 120:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 121:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 122:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 123:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 124:a00a99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 125:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 126:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 127:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 128:000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 129:00000a999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 130:000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 131:000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 132:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999988888888888888888888888888888888888888888888888899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// </SCREEN>

// <SCREEN1>
// 000:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa9999000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b0000000000000000000
// 001:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa999000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bbbbb000000000000000
// 002:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa99000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b0bbbbbb0000000000000
// 003:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa999000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb0bbbb0b000000000000
// 004:a00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00a0aaaa00aa00aa9990000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b0bb0bb0bb000000000000
// 005:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000550050005555500055005000555550005555000000000000055550005555000055005000055550000555500000000000000000000000000000000000000000000000b0b00bbbb000000000000
// 006:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000055505000556660005500500055666000556650000000000006556000556650005500500055566000065560000000000000000000000000000000000000000000000b0bb0bbbb0000000000000
// 007:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000055555000555500005500500055550000550050000000000000550000550050005500500065550000005500000000000000000000000000000000000000000000000b0b0bbbbb0000000000000
// 008:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000055655000556600006555600055660000555560000000000000550000555560005500500006555000005500000000000000000000000000000000000000000000000000bbbb000000000000000
// 009:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000550650005555500006560000555550005566500000000000005500005566500065556000555560000055000000000000000000000000000000000000000000000000000000000000000000000
// 010:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000660060006666600000600000666660006600600000000000006600006600600006660000666600000066000000000000000000000000000000000000000000000000000000000000000000000
// 011:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 012:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 013:0001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00a0000000000000000000000000000000000000000
// 014:0001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000a000000000000000000000000000000000000000
// 015:0001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000a000000000000000000000000000000000000000
// 016:00011100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a0000000000000000000000000000000000000
// 017:0001110000000000000000000000000000000000000000000000ee0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000a0a0000000000000000000000000000000000000
// 018:0001110000000000000000000000000000000000000000000000ee00ee0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000a0000000000000000000000000000000000000
// 019:0001110000000000000000000000000000000000000000000ee00000ee0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a00a0000000000000000000000000000000000000
// 020:0001110000000000000000000000000000000000000000000ee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0a0000000000000000000000000000000000000000
// 021:00011100000000000000000000000000000000000000000000000eee00ee000000000000000000000000000055550005500500055555000000000005555500055000000055500005000500055555000555500000555500000000000000000000000000000000000000000000000000000000000000000000
// 022:0001110000000000000000000000000000000000000000000000eeeee0ee00000000000000000000000000006556000550050005566600000000000556660005500000055665000505050005566600055665000555660000000000000000000000000000000ee00ee0000000000000000000000000000000
// 023:000111000000000000000000000000000000000000000000ee00eeeee00000000000000000000000000000000550000555550005555000000000000555500005500000055005000555550005555000055005000655500000000000000000000000000000000ee00ee0000000000000000000000000000000
// 024:000111000000000000000000000000000000000000000000ee00eeeee0000000000000000000000000000000055000055665000556600000000000055660000550000005500500055555000556600005555600006555000000000000000000000000000ee0000000000ee000000000000000000000000000
// 025:00011100000000000000000000000000000000000000000000000eee0ee00000000000000000000000000000055000055005000555550000000000055000000555550006555600055655000555550005566500055556000000000000000000000000000ee0000000000ee000000000000000000000000000
// 026:00011100000000000000000000000000000000000000000000ee00000ee0000000000000000000000000000006600006600600066666000000000006600000066666000066600006606600066666000660060006666000000000000000000000000000000000000000000000000000000000000000000000
// 027:00011100000000000000000000000000000000000000000000ee00ee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eee00000000000000000000000000000000
// 028:000111000000000000000000000000000000000000000000000000ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000eeeeeee000ee0000000000000000000000000
// 029:000111000000a00a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000eeeeeee000ee0000000000000000000000000
// 030:000111000000a000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeee00000000000000000000000000000
// 031:000111000000a000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeee00000000000000000000000000000
// 032:0001110000000000a0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee000eeeeeeeee00ee0000000000000000000000000
// 033:000111000000a000a0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000eeeeeee000ee0000000000000000000000000
// 034:0001110000000a0000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeee000000000000000000000000000000
// 035:0001110000000a0a00a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eee00000000000000000000000000000000
// 036:0001110000000a0a0000000000000000000000000000000000000000000000000000000000000ee000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000000000ee000000000000000000000000000
// 037:00011100000000000000000000000000000000000000a00a00000000000000000000000000000ee000000000000000000000a00a000000000000000000000000000000000000000000000a000a000000000000000000000000000000000000000000000ee0000000000ee000000000000000000000000000
// 038:00011100000000000000000000000000000000000000a000a000000000000000000000000000000000000000000000000000a000a0000000000000000000000000000000000000000000a000a00000000000000000000000000000000000000000000000000ee00ee0000000000000000000000000000000
// 039:00011100000000000000000000000000000000000000a000a000000000000000000000000000000000000000020000000000a000a0000000000000009900000000000000002000000000a000a00000000000001619000000000000000000000000000000000ee00ee0000000000000000000000000000000
// 040:000111000000000000000000000000000000000000000000a0a00000000000000000000000000000000000000e00000000000000a0a0000000000009a000000000000000f200000000000000a00a0000000000111a0000000000000000000000000000000000000000000000000000000000000000000000
// 041:00011100000000000000000000000000000000000000a000a0a0000000000000000000000000000000000000e80000000000a000a0a0000000000090a00000000000000f4f00000000000a00a0a0000000000061690000000000000000000000000000000000000000000000000000000000000000000000
// 042:000111000000000000000000000000000000000000000a0000a000000000000000000000000000000000000e8000000000000a0000a000000000011011000000000000f4f400000000000a0000a000000000009a9a0000000000000000000000000000000000000000000000000000000000000000000000
// 043:000111000000000000000000000000000000000000000a0a00a00000000000000000000000000000000000e80000000000000a0a00a0000000000110110000000000004f4000000000000a0a00a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 044:000111000000000000000000000000000000000000000a0a00000000000000000000000000000000000000000000000000000a0a000000000000000000000000000000000000000000000a0a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 045:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 046:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 047:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000000000000000000000000000000000000000000000000000000000
// 048:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ee0000000000000000000000000000000000000000000000000000000000
// 049:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 050:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 051:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 052:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 053:000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009990999009909990099099900990999009909990099099900990990000
// 054:00011100000000000000000000000000000000000000000000000000000000200020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999aa999999aa999999aa999999aa999999aa999999aa9999990000
// 055:000111000000000000000000000000000000000000000000000000000000000202000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 056:000111000000000000000000000000000000000000000000000000000000002220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 057:0001110000000000000000000000000000000000000000000000000000000200222000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9999999999999999999999999999999999999999999999999999990000
// 058:0001110000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009a9999999999999999999999999999999999999999999999999999990000
// 059:000111000000000000000000000101100000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 060:101111000000000000000000011010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 061:101101010000000000000001101101100000000000000000000000000000000000000000000000000000000000000000000000000000000000000088880000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 062:110111010000000000000000110111010000000000000000000000000000000000000000000000000000000000000000000000000000000000008888888800000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 063:111000110000000000000000111000110000000000000000000000000000000000000000000000000000000000000000000000000000000000000222222000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 064:111101110000000000000000111101110000000000000000000000000000000000000000000000000000000000000000000000000000000000000022822000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 065:0111111100000000000000001111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000008888800000000000000000000000000000000000000000000000000000000000a9999999999999999999999999999999999999999999999999999990000
// 066:001011100000000000000000011011100000000000000000000000000000000000000000000000000000000000000000000000000000000000008088880000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 067:000111100000000000000000010111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000080080000000000000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999990000
// 068:001110000000000000000000001110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999999999999999999999999999990000
// 069:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999aa9a999aa9aa999aa9aa9999999999999999999999999999999990000
// 070:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099aaaa9aaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 071:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 072:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 073:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099aaaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 074:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 075:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099aaaaaaaaaaaaaaaaaaaaa999999999999999999999999999999990000
// 076:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099a0aaaa0aaaa00a0aaaa00a999999999999999999999999999999990000
// 077:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000000000000999999999999999999999999999999990000
// 078:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000999999999999999999999999999999990000
// 079:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010100000000000000000000000000000000000000000999999999999999999999999999999990000
// 080:200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000099999999999999999999999999999990000
// 081:2222444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444440000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000a9999999999999999999999999999990000
// 082:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000099999999999999999999999999999990000
// 083:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000099999999999999999999999999999990000
// 084:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 085:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 086:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 087:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 088:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999990000
// 089:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a9999999999999999999999999999990000
// 090:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999990000
// 091:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099999999999999999999999999999990000
// 092:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999999999999999999999999999999990000
// 093:909990099099900990999009909990099099900990999009909990099099900990999009909990099099900990990990990000004000000000000000000000000000000000000000000000999099900990999009909990099099900990999009909990099099999999999999999999999999999999990000
// 094:9999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa999999aa9999999999999000004000000000000000000000000000000000000000000099999999aa999999aa999999aa999999aa999999aa999999aa999999999999999999999999999999999999990000
// 095:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999900004000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 096:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999900004000000000000000000000000000000000000000000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 097:99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999904444400000000000000000000000000000000000000000000a999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 098:99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999a00000000000000000000000000000000000000000000000009a999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 099:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999000000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 100:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999900000000000000000000000000000000000000000000000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 101:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999988888888888888888888888888888888888888888888888899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 102:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 103:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 104:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 105:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 106:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 107:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 108:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 109:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 110:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 111:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 112:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 113:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 114:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 115:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 116:999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 117:9aa999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 118:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 119:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 120:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 121:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 122:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 123:aaaa99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 124:a00a99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 125:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 126:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999982882882882882882882882882882882882882882882882899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 127:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 128:000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 129:00000a999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 130:000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 131:000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999902802802802802802802802882082082082082082082082099999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// 132:000099999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999988888888888888888888888888888888888888888888888899999999999999999999999999999999999999999999999999999999999999999999999999999999999999990000
// </SCREEN1>

// <PALETTE>
// 000:3f1f3cdd37458956548cdaff464b8cd6aece000000ff6d00ffaa6e919b455c5d41ffccd0ffffff8cff9bffe091b483ef
// 001:1c2638f14e5289565495e0cc39707ad6aece000000ff6d00ffaa6e39707a23495dffccd0ffffff8cff9bf14e52b483ef
// </PALETTE>

// <PALETTE1>
// 000:3f1f3cdd37458956548cdaff464b8cd6aece000000ff6d00ffaa6e919b455c5d41ffccd0ffffff8cff9bffe091b483ef
// </PALETTE1>

