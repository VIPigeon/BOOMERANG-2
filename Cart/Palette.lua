ADDR = 0x3FC0

palette = {
    defaultColors={},
    whiteColor = {r=255, g=255, b=255},
    bgColor = {r=63, g=31, b=60},
    isOneBit = false
}

function palette.toggle1Bit()
    for id = 1, 15 do
        local color
        if not palette.isOneBit then
            if id == 6 then
                color = palette.bgColor
            else
                color = palette.whiteColor
            end
        else
            color = palette.defaultColors[id]
        end

        palette.colorChange(id, color.r, color.g, color.b)
    end

    palette.isOneBit = not palette.isOneBit
end

function palette.getColor(id)
    color = {}
    color.r = peek(ADDR+(id*3)+2)
    color.g = peek(ADDR+(id*3)+1)
    color.b = peek(ADDR+(id*3))
    return color
end

function palette.colorChange(id, red, green, blue)
    -- id -- color index in tic80 palette
    -- red, green, blue -- new color parameters
    poke(ADDR+(id*3)+2, red)
    poke(ADDR+(id*3)+1, green)
    poke(ADDR+(id*3), blue)
end

function palette.ghostColor(GC)
    -- я понятия не имею как это работает
    -- я тоже 😎😎
    -- Всем привет, ребята 🤠
    -- здесь GC = 11
    local id = GC  -- id цвета
    poke(ADDR+(id*3)+2, peek(ADDR+2))  -- red
    poke(ADDR+(id*3)+1, peek(ADDR+1))  -- green
    poke(ADDR+(id*3), peek(ADDR))  -- blue
end

for i = 1, 15 do
    local color = palette.getColor(i)
    table.insert(palette.defaultColors, color)
end

return palette
