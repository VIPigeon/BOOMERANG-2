
Metronome4_4 = table.copy(Metronome)


function Metronome4_4:new(bpm)
    bpm = bpm * 12  -- теперь на одну четверть приходится 12 ударов вместо 1
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
