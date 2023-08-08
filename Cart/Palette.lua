ADDR = 0x3FC0

palette = {}

function palette.ghostColor(GC)
    -- я понятия не имею как это работает
    -- здесь GC = 11
    local id = GC  -- id цвета
    poke(ADDR+(id*3)+2, peek(ADDR+2))  -- red
    poke(ADDR+(id*3)+1, peek(ADDR+1))  -- green
    poke(ADDR+(id*3), peek(ADDR))  -- blue

    -- savePalette()
    -- exportpal(palette)
end

return palette