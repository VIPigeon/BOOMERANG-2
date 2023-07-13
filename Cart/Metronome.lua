Metronome = {}

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
    obj = {
        time = 0,
        ms_per_beat = (60 * 1000) / bpm,
        callbacks = {},
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end

function Metronome:addBeatCallback(callback)
    table.insert(self.callbacks, callback)
end

function Metronome:msBeforeNextBeat()
    return self.ms_per_beat - (self.time % self.ms_per_beat)
end

function Metronome:_onBeat()
    for _, callback in ipairs(self.callbacks) do
        callback()
    end
end

function Metronome:update()
    if self.time >= self.ms_per_beat then
        self:_onBeat()
        self.time = 0
    end

    self.time = self.time + Time.dt()
end
