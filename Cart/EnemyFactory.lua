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

-- Move to data
Rose.sprite = Sprite:new({389, 391, 393, 395, 397, 421}, 2)
Rose2sprite = Sprite:new({393, 395, -1, -1, -1, 275}, 2)

function enemyFactory.create(tileX, tileY, tileID)
    local x = 8 * tileX;
    local y = 8 * tileY;

    local config = enemyFactory.getConfig(tileID)
    config = addDebugValidation(config)
    local type = config.name

    -- Здесь раньше другое имя было
    -- Заметка(kawaii-Code): В идеальном мире всё так и будет работать.
    -- Однако мир не идеален. 🦍🦍
    -- 🤠☝

    if type == 'Enemy' then
        return Enemy:new(x, y)
    elseif type == 'StaticTaraxacum' then
        return StaticTaraxacum:new(x, y, config), {noCollisions = true}
    elseif type == 'Snowman' then
        return SnowmanBox:new(x, y, config, music), {noCollisions = true}
    elseif type == 'MusicRose' then
        local musicRose = MusicRose:new(x, y, config.direction, data.Rose.sprites, 1, config)
        -- musicRose:tuning(config.music.beatMap, config.music.sfxMap)
        musicRose:tuning(config.music)
        return musicRose
    elseif type == 'MusicWeakRose' then
        local musicRose = MusicRose:new(x, y, config.direction, data.WeakRose.sprites, 11, config)
        -- musicRose:tuning(config.music.beatMap, config.music.sfxMap)
        musicRose:tuning(config.music)
        return musicRose
    elseif type == 'MusicBulletHell' then
        local musicBulletHell = MusicBulletHell:new(x, y, config)
        -- musicBulletHell:tuning(config.music.beatMap, config.music.sfxMap)
        musicBulletHell:tuning(config.music)
        return musicBulletHell
    elseif type == 'MusicAutoBulletHell' then
        local musicAutoBulletHell = MusicAutoBulletHell:new(x, y, config)
        -- musicAutoBulletHell:tuning(config.music.beatMap, config.music.sfxMap)
        musicAutoBulletHell:tuning(config.music)
        return musicAutoBulletHell
    end
end
