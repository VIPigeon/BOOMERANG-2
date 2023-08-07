Metronome = {}

--
-- ms_per_beat explanation :D
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
        ms_per_beat = (60 * 1000) / bpm,
        on_beat = false,
        
        onOddBeat = false,
        onEvenBeat = false,
        beatCount = 0,
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end

function Metronome:msBeforeNextBeat()
    return self.ms_per_beat - (self.time % self.ms_per_beat)
end

function Metronome:_onBeat()
    self.on_beat = true
end

function Metronome:_onOddBeat()
    self.onOddBeat = true
end

function Metronome:_onEvenBeat()
    self.onEvenBeat = true
end

function Metronome:update()
    if self.on_beat then
        self.on_beat = false
        self.onEvenBeat = false
        self.onOddBeat = false
    end

    if self.time >= self.ms_per_beat then
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
