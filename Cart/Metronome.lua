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
        onBass = false,
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

function Metronome:update()
    if self.onBeat then
        self.onBeat = false
    end

    if self.time >= self.msPerBeat then
        self:_onBeat()
        self.time = 0
    end

    if self.time >= self.smallTick then
        self.onBass = true
    else
        self.onBass = false
    end
    self.onBass = true

    self.time = self.time + Time.dt()
end
