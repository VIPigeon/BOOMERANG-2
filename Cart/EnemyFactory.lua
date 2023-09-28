enemyFactory = {}

function enemyFactory.spawn(x, y, template)
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

function enemyFactory.create(tilex, tiley, id)
    local x = 8 * tilex;
    local y = 8 * tiley;

    if id == data.Enemy.defaultEnemyFlagTile then
        return Enemy:new(8 * x, 8 * y)
    elseif table.contains(data.Taraxacum.staticTaraxacumSpawnTile, id) then
        local radius = data.Taraxacum.staticRadius
        local bodyLength = data.Taraxacum.staticBodyLength
        return StaticTaraxacum:new(8 * x, 8 * y, radius, bodyLength)
    elseif table.contains(data.Snowman.spawnTiles, id) then
        table.insert(game.enemyRespawnTiles, {x=x, y=y, tileid = id, type='snowman'})
        mset(x, y, C0)
    elseif musicrose.bassline then
        local tile = {x=x, y=y, tileid=id, type='musicrose',
        bassline=musicrose.bassline, direction=musicrose.direction}
        table.insert(game.enemyRespawnTiles, tile)
        mset(x, y, C0)
    elseif musicbullethell.drums then
        local tile = {x=x, y=y, tileid=id, type='musicbullethell',
        drums=musicbullethell.drums}
        table.insert(game.enemyRespawnTiles, tile)
        mset(x, y, C0)
    end
end
