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
    if cccrutch == data.Cutscene.smoke_frequency_ms then
        self.lol = make_smoke_ps(x, y, 300, 5000, 1, 7, 4, 6)
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

    trace("sceeeeeeeeeeeeeeee")
end

function CutScene:draw()
	draw_psystems()
end

function CutScene:update()
	update_psystems()
end
