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
        onBass = true,
        
        onOddBeat = false,
        onEvenBeat = false,
        beatCount = 0,
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

function Metronome:_onOddBeat()
    self.onOddBeat = true
end

function Metronome:_onEvenBeat()
    self.onEvenBeat = true
end

function Metronome:update()
    if self.onBeat then
        self.onBeat = false
        self.onEvenBeat = false
        self.onOddBeat = false
    end

    if self.time >= self.msPerBeat then
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
