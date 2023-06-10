Metronome = {}

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
function Metronome:new(bpm)
    obj = {
        time = 0,
        ms_per_beat = (60 * 1000) / bpm,
        callbacks = {},
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end

function Metronome:add_beat_callback(callback)
    table.insert(self.callbacks, callback)
end

function Metronome:on_beat()
    for _, callback in ipairs(self.callbacks) do
        callback()
    end
end

function Metronome:update()
    if self.time >= self.ms_per_beat then
        self:on_beat()
        self.time = 0
    end

    self.time = self.time + Time.dt()
end
