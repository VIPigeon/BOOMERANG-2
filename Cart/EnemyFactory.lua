enemyFactory = {}

function enemyFactory.getConfig(tileID)
    return data.enemyConfig[tileID]
end

function enemyFactory.create(tileX, tileY, tileID)
    local x = 8 * tileX;
    local y = 8 * tileY;

    local config = enemyFactory.getConfig(tileID)
    local type = config.name

    -- Заметка(Каня): В идеальном мире всё так и будет работать.
    -- Однако мир не идеален. 🦍🦍

    if type == 'Enemy' then
        return Enemy:new(x, y)
    elseif type == 'StaticTaraxacum' then
        return StaticTaraxacum:new(x, y, config.radius, config.bodyLength), {noCollisions = true}
    elseif type == 'Snowman' then
        return SnowmanBox:new(x, y), {noCollisions = true}
    elseif type == 'MusicRose' then
        local musicRose = MusicRose:new(x, y, config.direction)
        musicRose:tuning(config.bassline.beatMap, config.bassline.sfxMap)
        return musicRose
    elseif type == 'MusicBulletHell' then
        local musicBulletHell = MusicBulletHell:new(x, y, config.bulletHellType)
        musicBulletHell:tuning(config.drums.beatMap, config.drums.sfxMap)
        return musicBulletHell
    end
end
