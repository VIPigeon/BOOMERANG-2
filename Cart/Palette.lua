ADDR = 0x3FC0
-- eADDR = 0x4000

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


-- function palette.exportpal(pal)  -- я не знаю, зачем это здесь
--     for i=1,#pal do
--         poke4((eADDR*2)+64+#pal-i,tonumber(pal:sub(i,i),16))
--     end 
-- end


-- function palette.savePalette()  -- я не знаю, зачем это здесь
--     local palette = ""
--     for i=0, 15 do
--         for j=0, 2 do
--             palette = palette..string.format("%02x",peek(ADDR+(i*3)+j))
--         end
--     end
--     return palette
-- end


function palette.colorChange(id, red, green, blue)
    -- id -- color index in tic80 palette
    -- red, green, blue -- new color parameters
    poke(ADDR+(id*3)+2, red)
    poke(ADDR+(id*3)+1, green)
    poke(ADDR+(id*3), blue)

    -- local p = palette.savePalette()
    -- palette.exportpal(p)
end


return palette