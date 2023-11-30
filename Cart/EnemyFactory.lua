enemyFactory = {}

function enemyFactory.getConfig(tileID)
    return data.EnemyConfig[tileID]
end

local function addDebugValidation(t)
    wrapper = {t}
    local metatable = {
        __index = function(_, k)
            if t[k] == nil then
                error("Config value '" .. k .. "' is missing!")
            end
            return t[k]
        end
    }
    setmetatable(wrapper, metatable)
    return wrapper
end

function enemyFactory.create(tileX, tileY, tileID)
    local x = 8 * tileX;
    local y = 8 * tileY;

    local config = enemyFactory.getConfig(tileID)
    config = addDebugValidation(config)
    local type = config.name

    -- Заметка(Каня): В идеальном мире всё так и будет работать.
    -- Однако мир не идеален. 🦍🦍
    -- 🤠☝

    if type == 'Enemy' then
        return Enemy:new(x, y)
    elseif type == 'StaticTaraxacum' then
        return StaticTaraxacum:new(x, y, config), {noCollisions = true}
    elseif type == 'Snowman' then
        return SnowmanBox:new(x, y, config, music), {noCollisions = true}
    elseif type == 'MusicRose' then
        local musicRose = MusicRose:new(x, y, config.direction)
        musicRose:tuning(config.music.beatMap, config.music.sfxMap)
        return musicRose
    elseif type == 'MusicBulletHell' then
        local musicBulletHell = MusicBulletHell:new(x, y, config)
        musicBulletHell:tuning(config.music.beatMap, config.music.sfxMap)
        return musicBulletHell
    elseif type == 'MusicAutoBulletHell' then
        local musicAutoBulletHell = MusicAutoBulletHell:new(x, y, config)
        musicAutoBulletHell:tuning(config.music.beatMap, config.music.sfxMap)
        return musicAutoBulletHell
    end
end
