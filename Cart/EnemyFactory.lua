enemyFactory = {}

--[[
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

local function getMusic(spawnTileId, type)
    if type == 'musicrose' then
        for bassline, tiles in pairs(data.MusicRose.spawnTiles) do
            if tiles[1] <= spawnTileId and spawnTileId <= tiles[4] then
                return {
                    direction = spawnTileId - tiles[1],
                    bassline = bassline,
                }
            end
        end
    elseif type == 'musicbullethell' then
        return {
            drums = drums[spawnTileId]
        }
    end
    return {}
end
--]]

function enemyFactory.getConfig(tileID)
    return data.enemyConfig[tileID]
end

function enemyFactory.create(tileX, tileY, tileID)
    local x = 8 * tileX;
    local y = 8 * tileY;

    local config = enemyFactory.getConfig(tileID)

    if config.type = 'enemy' then -- id == data.Enemy.defaultEnemyFlagTile then
        return Enemy:new(x, y)
    elseif config.type == 'static_taraxacum' then -- table.contains(data.Taraxacum.staticTaraxacumSpawnTile, id) then
        return StaticTaraxacum:new(x, y, config.radius, config.bodyLength)
    elseif config.type == 'snowman' then -- table.contains(data.Snowman.spawnTiles, id) then
        return SnowmanBox:new(x, y) -- а дверь его теперь как убивать будет, ты подумал? 🙁🙁🙁🙁🙁🙁🙁🙁🙁🙁🙁
    elseif config.type == 'music_rose' then -- musicrose.bassline then
        local musicRose = MusicRose:new(x, y, config.direction)
        musicRose:tuning(config.bassline.beatMap, config.bassline.sfxMap)
        return musicRose
    elseif config.type == 'music_bullet_hell' then -- musicbullethell.drums then
        local musicBulletHell = MusicBulletHell:new(x, y, config.bulletHellType)
        musicBulletHell:tuning(config.drums.beatMap, config.drums.sfxMap)
    end
end
