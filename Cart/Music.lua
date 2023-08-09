
function Metronome:_drums()
    if self.i == 12 or self.i == 18 or self.i == 0 then
        if self._drums_flag then
            sfx(2, 'G-2', -1, 0, 15, 0)
            self._drums_flag = false
        end
    else
        self._drums_flag = true
    end
end


return Metronome
