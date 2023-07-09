
music = {}
music.k = 24  -- сколько "мелких"" ударов приходится на одни "большой"
music.bar_size = 4 * music.k  -- размер такта
music.i = 0  -- номер текущего бита


function music.update()
    music.i = (music.i + 1) % music.bar_size
    if music.i % music.k == 0 then
        sfx(1, 'G-2', -1, 0, 15, 0)
    end
end


return music
