-- ТЗ НА МЕТРОНОМ

-- Создать класс Metronom, экземпляр которого:
-- 1) Имеет счетчик кадров, зацикленный по определенному числу
-- 2) на определенные кадры возвращает "команду", показывающую, что сейчас время для определенного звука 
-- и действия (в основном, выстрела противника). Это можно реализовать с помощью полей или функций, не принципиально
-- 3) является полем Game

-- Также нужно реализовать обработку метронома внутри Game

-- Для демонстрации работы сделать "пульсирующие" декорации

Metronome = {}

function Metronome:new(frames_per_beat)
    -- TODO: This is not frame-independent. Use tstamp() to calculate delta time.
    obj = {
        tick = 0,
        frames_per_beat = frames_per_beat,
        callbacks = {},
    }

    setmetatable(obj, self)
    self.__index = self; return obj
end

function Metronome:add_beat_callback(callback)
    self:add_on_frame_callback(self.frames_per_beat, callback)
end

function Metronome:add_on_frame_callback(frame, callback)
    local fun = function(tick)
        if tick == frame then
            callback()
        end
    end

    table.insert(self.callbacks, fun)
end

function Metronome:update()
    self.tick = self.tick + 1

    for i, callback in ipairs(self.callbacks) do
        callback(self.tick)
    end

    if self.tick >= self.frames_per_beat then
        self.tick = 0
    end
end
