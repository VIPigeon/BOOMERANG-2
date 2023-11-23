
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
