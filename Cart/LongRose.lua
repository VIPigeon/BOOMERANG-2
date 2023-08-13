LongRose = table.copy(Rose)

function LongRose:onBeat()
    self.ticks = self.ticks + 1

    if self.status == 'shootBegin' then
        if self.ticks == self.ticksBeforeShot then
            self.status = 'shooting'
            self:shoot()
            self.ticks = 0
        end
    elseif self.status == 'shooting' then
        if self.ticks == self.ticksShooting then
            self.status = 'shootEnd'
            self.ticks = 0
        end
    end
end

function LongRose:handleBeat()
    if game.metronome.onBass and self.status == 'shootBegin' then
        self.status = 'shooting'
        self:shoot()
    end

    if self.status == 'shooting' and not game.metronome.onBass then
        self.status = 'shootEnd'
    end
end
