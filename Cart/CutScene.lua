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
        bike_speed = 0.01,
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
	local crutchy = make_smoke_ps(self.x, self.y, 200, 2000, 1, 2, 2, 3)
	local cringy = make_explosion_ps(self.x, self.y, 200,500, 9,14,1,3) --100, 500
end

function CutScene:go_away()
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