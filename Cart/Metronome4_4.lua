
Metronome4_4 = table.copy(Metronome)


function Metronome4_4:new(bpm)
    bpm = bpm * 12  -- теперь на одну четверть приходится 12 ударов вместо 1
    local obj = {
        time = 0,
        msPerBeat = (60 * 1000) / bpm,
        onBeat = false,
        beatCount = 0,

        beat4 = false,
        beat4Count = 0,  -- число от 0 до 3
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end


function Metronome4_4:_onBeat()
    self.onBeat = true
    self.beatCount = self.beatCount + 1

    if self.beatCount % 12 == 0 then
        self.beat4 = true
        -- debug
        -- local sound = bassLine.roseD.sfxMap[1]
        -- sfx(sound[1],
        -- sound[2],
        -- sound[3],
        -- sound[4],
        -- sound[5],
        -- sound[6]
        -- )
        --
        self.beat4Count = (self.beat4Count + 1) % 4
    end
end

function Metronome4_4:_beatsOff()
    self.onBeat = false
    self.beat4 = false
end

function Metronome4_4:update()
    self:_beatsOff()

    if self.time >= self.msPerBeat then
        self:_onBeat()
        self.time = 0
    end

    self.time = self.time + Time.dt()
end
