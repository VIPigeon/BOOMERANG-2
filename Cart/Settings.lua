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

