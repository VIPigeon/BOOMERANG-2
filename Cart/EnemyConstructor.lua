
enemyConstructor = {}


function enemyConstructor.spawn(x, y, template)
    if template.type == 'rose' then
        local rose = MusicRose:new(x, y, template.direction)
        rose:tuning(template.music.beatMap, template.music.sfxMap)
        return rose
    elseif template.type == 'bullethell' then
        if template.autoaim then
            assert(false, 'autobullethell isnt finished')
        end
        local bullethell = MusicBulletHell:new(x, y, template.size)
        bullethell:tuning(template.music.beatMap, template.music.sfxMap)
        return bullethell
    elseif template.type == 'snowman' then
        assert(false, 'snowman isnt finished')
    end
end


--[[
template -- это таблица с именными полями
template определяет тип противника и характристики в зависимости от типа
Всегда содержит в себе поля type и music (см. Drums.lua и BassLine.lua)
]]
