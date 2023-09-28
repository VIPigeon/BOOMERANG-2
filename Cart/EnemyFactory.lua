enemyFactory = {}

function enemyFactory.getConfig(tileID)
    return data.enemyConfig[tileID]
end

function enemyFactory.create(tileX, tileY, tileID)
    local x = 8 * tileX;
    local y = 8 * tileY;

    local config = enemyFactory.getConfig(tileID)
    local type = config.name

    if type == 'enemy' then
        return Enemy:new(x, y)
    elseif type == 'static_taraxacum' then
        return StaticTaraxacum:new(x, y, config.radius, config.bodyLength), {noCollisions = true}
    elseif type == 'snowman' then
        return SnowmanBox:new(x, y), {noCollisions = true}
    elseif type == 'music_rose' then
        local musicRose = MusicRose:new(x, y, config.direction)
        musicRose:tuning(config.bassline.beatMap, config.bassline.sfxMap)
        return musicRose
    elseif type == 'music_bullet_hell' then
        local musicBulletHell = MusicBulletHell:new(x, y, config.bulletHellType)
        musicBulletHell:tuning(config.drums.beatMap, config.drums.sfxMap)
        return musicBulletHell
    end
end
