CutScene = {}

function CutScene:new(plr, bk)
	local obj = {
        player = plr,
        bike = bk,
        bike_x = (game.bike.x) - gm.x*8 + gm.sx,
        bike_y = (game.bike.y) + 8 - gm.y*8 + gm.sy,
        status = '0xDEADC0DE',
        TIMERCRUTCH = true,
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
	self.bike_x = (game.bike.x) - gm.x*8 + gm.sx
    self.bike_y = (game.bike.y) + 8 - gm.y*8 + gm.sy
end
--todo сделать дымок, заволакивающий глаза и весь экран в конце
--сделать дым больше
--подключить таймер
function CutScene:make_smokkkkk()
	local crutchy = make_smoke_ps(self.bike_x, self.bike_y, 200, 2000, 1, 2, 2, 3)
	local cringy = make_explosion_ps(self.bike_x, self.bike_y, 100,500, 9,14,1,3)
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