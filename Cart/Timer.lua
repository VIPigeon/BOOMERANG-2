GameTimers = {
    timers = {}
}

Timer = {}

function GameTimers.addTimer(timer)
    table.insert(GameTimers.timers, timer)
    timer:onEnd(function()
        table.removeElement(GameTimers.timers, timer)
    end)
end

function GameTimers.update()
    for _, timer in ipairs(GameTimers.timers) do
        timer:update()
    end
end

function Timer:new(durationMs)
    local obj = {
        durationMs = durationMs,
        elapsed = 0,
        onElapsed = {},
    }

    setmetatable(obj, self)
    self.__index = self;
    GameTimers.addTimer(obj)
    return obj
end

function Timer:onEnd(onElapsed)
    table.insert(self.onElapsed, onElapsed)
    return self
end

function Timer:update()
    self.elapsed = self.elapsed + Time.dt()

    if self:ended() then
        for _, onElapsed in ipairs(self.onElapsed) do
            onElapsed()
        end
    end
end

function Timer:ended()
    return self.elapsed >= self.durationMs
end

function Timer:reset()
    self.elapsed = 0
end
