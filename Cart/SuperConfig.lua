
-- Я добавил фабричный метод, чтобы ты мог делать конфиги, пока делаешь конфиги

RoseHP = {weak=20, strong=120}
BulletHellHP = {small=32, medium=64, big=128}

silence = {
    beatMap = {0, 0, 0, 0},
    sfxMap = {{0, 'E-3', -1, 0, 10, 0}}
}

strongrose = {
    name = 'MusicRose',
    startingHealth = RoseHP.strong,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
    direction = 0,
    isWeak = false,
}
weakrose = {
    name = 'MusicWeakRose',
    startingHealth = RoseHP.weak,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
    direction = 0,
    isWeak = true,
}

common = {
    small = {
        name = 'MusicBulletHell',
        circleDiameter = 5,
        bulletSpreadRadius = 5,
        bulletRotationSpeed = 0.002,
        bulletCount = 8,
        bulletSpeed = 0.95,
        deathBulletSpeed = 0.18,
        color = 14,
        hp = BulletHellHP.small,
    },
    medium = {
        name = 'MusicBulletHell',
        circleDiameter = 8,
        bulletSpreadRadius = 8,
        bulletRotationSpeed = 0.0009,
        bulletCount = 12,
        bulletSpeed = 1.1,
        deathBulletSpeed = 0.1,
        color = 14,
        hp = BulletHellHP.medium,
    },
    big = {
        name = 'MusicBulletHell',
        circleDiameter = 16,
        bulletSpreadRadius = 11,
        bulletRotationSpeed = 1,
        bulletCount = 16,
        bulletSpeed = 1.5,
        deathBulletSpeed = 0.1,
        color = 14,
        hp = BulletHellHP.big,
    },
}

autobullethellprefab = {
    small = {
        name = 'MusicAutoBulletHell',
        circleDiameter = 5,
        bulletSpreadRadius = 5,
        bulletRotationSpeed = 0.002,
        bulletCount = 8,
        bulletSpeed = 1,
        deathBulletSpeed = 0.03,
        color = 13,
        hp = BulletHellHP.small,
    },
    medium = {
        name = 'MusicAutoBulletHell',
        circleDiameter = 8,
        bulletSpreadRadius = 8,
        bulletRotationSpeed = 0.0009,
        bulletCount = 12,
        bulletSpeed = 3,
        deathBulletSpeed = 0.03,
        color = 13,
        hp = BulletHellHP.medium,
    },
    big = {
        name = 'MusicAutoBulletHell',
        circleDiameter = 16,
        bulletSpreadRadius = 11,
        bulletRotationSpeed = 1,
        bulletCount = 16,
        bulletSpeed = 4.1,
        deathBulletSpeed = 0.03,
        color = 13,
        hp = BulletHellHP.big,
    },
}

-- prefab contains common parameters, like name, hp, graphics, etc.
function data.add_enemy(id, prefab, music)
    if not (prefab.name == "MusicRose" or prefab.name == "MusicWeakRose") then
        data.EnemyConfig[id] = table.copy(prefab)
        data.EnemyConfig[id].music = music
        return
    end
    for i = 0, 3 do
        local rose = table.copy(prefab)
        rose.music = music
        rose.direction = i
        data.EnemyConfig[id + i] = rose
    end
end

function data.add_all_bullethell_sizes(id, music)
    data.EnemyConfig[id] = table.copy(common.small)
    data.EnemyConfig[id+1] = table.copy(common.medium)
    data.EnemyConfig[id+2] = table.copy(common.big)
    data.EnemyConfig[id].music = music
    data.EnemyConfig[id+1].music = music
    data.EnemyConfig[id+2].music = music
end


function data.add_all_autobullethell_sizes(id, music)
    data.EnemyConfig[id] = table.copy(autobullethellprefab.small)
    data.EnemyConfig[id+1] = table.copy(autobullethellprefab.medium)
    data.EnemyConfig[id+2] = table.copy(autobullethellprefab.big)
    data.EnemyConfig[id].music = music
    data.EnemyConfig[id+1].music = music
    data.EnemyConfig[id+2].music = music
end


--IEnemyable
data.EnemyConfig = {
    -- dict: [tileId : EnemyConfigLol]
    [65] = {
        name = 'Snowman',
        color = 12,
        speed = 12, -- data.Player.speed - 0.41,
        speedWithWhirl = 0.8, --data.Player.speed - 0.61,
        hp = 100,
        prepareJumpTime = 20,
        --jumpTime = 20,
        resetJumpTime = 24,

        deathParticleCountMin = 100,
        deathParticleCountMax = 300,
        deathAnimationParticleSpeed = 1,
        deathAnimationParticleSpeedNormalizer = 0.4,
        deathParticleMinSpeed = 1,
        deathParticleSprite = Sprite:new({378}, 1),

        specialTaraxacum = {
            radius = 3,
            bodyLength = 15,
            shiftForCenterX = 12,
            shiftForCenterY = -3,
            startStickX = 0,
            startStickY = 0,
            bodyColor = 10,
            color = 12,
            reloadAnimationTime = 18, -- in tics should divide by 3
        },

        music = {
            beatMap = {1, 0, 0, 0, 0, 0, 1, 1,},
            sfxMap = {
                {28, 'D-3', -1, 0, 8, 0},
                {28, 'A-3', -1, 0, 8, 0},
                {28, 'F-4', -1, 1, 10, 0},
                {28, 'F-4', -1, 2, 14, 0},
                {28, 'F-5', -1, 0, 14, 0},
                {28, 'F-4', -1, 1, 14, 0},
                {28, 'E-3', -1, 2, 14, 0},
            },
            -- intro = silence,
            -- altBeatMap = {1, 0, 0, 0, 1, 0, 0, 0}
        },

        sprites = {
            chill = Sprite:new({312}, 2),
            prepareJump = Sprite:new({312, 344}, 2),
            flyJump = Sprite:new(anim.gen60({346,348,346}), 2),
            resetJump = Sprite:new({348,344,312}, 2),
            death = Sprite:new(anim.gen60({312,314,312,314,312}), 2)
        },
    },
    [97] = {
        name = 'StaticTaraxacum',
        speed = 2,
        color = 12,

        radius = 2,
        staticRadius = 3,
        bodyLength = 10,
        staticTaraxacumSpawnTile = { 97 },

        deathBulletCount = 6,
        deathBulletSlowCount = 3,
        deathBulletFastCount = 3,

        deathBulletSpeed = 0.37,
        deathSlowBulletSpeed = 0.2,
        deathFastBulletSpeed = 0.5,

        deathBulletSpread = 2,

        deathBulletSprite = Sprite:new({378}, 1),
    }, -- mb static idk
}

data.add_all_autobullethell_sizes(
    80,
    {
        beatMap = {1,0,0,0,0,0,0,0},
        sfxMap = {
            {16, 'F#3', -1, 2, 10, 0},
        },
        intro = {
            beatMap = {0, 0, 0, 1},
            sfxMap = {
                {16, 'F#3', -1, 2, 10, 0},
            },  
        }
    }
)

-- main theme ------------------------------------------------------------------------------------------------------------------------------------------------------------------
data.add_enemy(
    182,
    strongrose,
    {
        beatMap = {1,0,0,0,0,0,0,0},
        sfxMap = {
            {31, 'D-3', -1, 0, 10, 0},
            {31, 'C#3', -1, 0, 10, 0},
            {31, 'D-3', -1, 0, 10, 0},
            {31, 'C#3', -1, 0, 10, 0},
            {31, 'A-2', -1, 0, 10, 0},
            {31, 'B-2', -1, 0, 10, 0},
            {31, 'A-2', -1, 0, 10, 0},
            {31, 'B-2', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)
data.add_enemy(
    186,
    strongrose,
    {
        beatMap = {0,0,0,0,1,0,0,0},
        sfxMap = {{31, 'G#3', -1, 0, 12, 0}},
        -- intro = silence
    }   
)
data.add_enemy(
    170,
    strongrose,
    {
        beatMap = {0,0,1,0,0,0,1,0},
        sfxMap = {
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'F#3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
            {31, 'E-3', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)

data.add_enemy(
    134,
    weakrose,
    {
        beatMap = {1,0,0,0,0,0,0,0},
        sfxMap = {
            {0, 'D-3', -1, 0, 10, 0},
            {0, 'C#3', -1, 0, 10, 0},
            {0, 'D-3', -1, 0, 10, 0},
            {0, 'C#3', -1, 0, 10, 0},
            {0, 'A-2', -1, 0, 10, 0},
            {0, 'B-2', -1, 0, 10, 0},
            {0, 'A-2', -1, 0, 10, 0},
            {0, 'B-2', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)
data.add_enemy(
    166,
    weakrose,
    {
        beatMap = {0,0,0,0,1,0,0,0},
        sfxMap = {{0, 'G#3', -1, 0, 12, 0}},
        -- intro = silence
    }   
)
data.add_enemy(
    150,
    weakrose,
    {
        beatMap = {0,0,1,0,0,0,1,0},
        sfxMap = {
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'F#3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
            {0, 'E-3', -1, 0, 10, 0},
        },
        -- intro = silence
    }
)


data.add_all_bullethell_sizes(
    16,
    {
        beatMap = {0,0, 0,0, 1,0, 0,0},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
        },
    }
)

data.add_all_bullethell_sizes(
    32,
    {
        beatMap = {0,0, 0,0, 1,0, 0,0},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
            {17, 'C#6', -1, 2, 10, 0},
        },
        altBeatMap = {0,0, 0,1, 1,0, 0,0},
    }
)
data.add_all_bullethell_sizes(
    48,
    {
        beatMap = {0,0,0,0, 0,0,0,0, 0,1,0,0, 0,1,0,1,},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},{17, 'C#7', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},
            {17, 'B-6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},{17, 'G#6', -1, 2, 10, 0},
        },
        altBeatMap = {1,1,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0,}
    }
)

------------------------------------------------------------------------------------------------------------------------------------------------------------------

data.add_enemy(
    12,
    weakrose,
    {
        beatMap = {1,0, 0,0, 1,0, 0,0},
        sfxMap = {
            {2, 'D-4', -1, 1, 4, 0},
            {2, 'D-4', -1, 1, 4, 0},
            {2, 'B-3', -1, 1, 4, 0},
            {2, 'B-3', -1, 1, 4, 0},
        },
    }
)
data.add_enemy(
    28,
    weakrose,
    {
        beatMap = {0,0, 1,0, 0,1, 0,0},
        sfxMap = {
            {1, 'C#5', -1, 2, 15, 0},
            {1, 'C#5', -1, 2, 15, 0},
            {1, 'B-4', -1, 2, 15, 0},
            {1, 'B-4', -1, 2, 15, 0},
        },
    }
)
data.add_enemy(
    44,
    weakrose,
    {
        beatMap = {0,0, 1,0, 0,1, 0,0},
        sfxMap = {
            {1, 'A-4', -1, 1, 15, 0},
            {1, 'A-4', -1, 1, 15, 0},
            {1, 'F#4', -1, 1, 15, 0},
            {1, 'F#4', -1, 1, 15, 0},
        },
    }
)

-- double_beatMap_of_all()
