
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

verystrongrose = {
    name = 'MusicRose',
    startingHealth = RoseHP.strong*3,
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
        bulletSpeed = 2,
        deathBulletSpeed = 0.1,
        color = 13,
        hp = BulletHellHP.small,
    },
    medium = {
        name = 'MusicAutoBulletHell',
        circleDiameter = 8,
        bulletSpreadRadius = 8,
        bulletRotationSpeed = 0.0009,
        bulletCount = 12,
        bulletSpeed = 4,
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
        bulletSpeed = 5,
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
        speed = 15, -- data.Player.speed - 0.41,
        speedWithWhirl = 0.8, --data.Player.speed - 0.61,
        hp = 200,
        prepareJumpTime = 20,
        --jumpTime = 20,
        resetJumpTime = 24,

        deathParticleCountMin = 100,
        deathParticleCountMax = 300,
        deathAnimationParticleSpeed = 1,
        deathAnimationParticleSpeedNormalizer = 0.4,
        deathParticleMinSpeed = 1,
        deathParticleSprite = StaticSprite:new(378, 1),

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
            beatMap = {0, 0, 0, 0, 0, 0, 0, 0,},
            sfxMap = {
                -- {4, 'A-2', 16, 0, 4, -1},
                -- {4, 'C-3', 16, 0, 4, -1},
                {1, 'A-4', -1, 2, 10, 0},
                {1, 'G-4', -1, 2, 10, 0},
                {1, 'A-4', -1, 2, 10, 0},
                {1, 'G-4', -1, 2, 10, 0},
            },
            altBeatMap = {0,0,0,0, 1, 1, 1, 1}
        },

        sprites = {
            chill = StaticSprite:new(312, 2),
            prepareJump = Sprite:new({312, 344}, 2),
            flyJump = Sprite:new(anim.gen60({346,348,346}), 2),
            resetJump = Sprite:new({348,344,312}, 2),
            death = Sprite:new(anim.gen60({312,314,312,314,312}), 2)
        },
    },

    [66] = {
        name = 'Snowman',
        color = 12,
        speed = 15, -- data.Player.speed - 0.41,
        speedWithWhirl = 0.8, --data.Player.speed - 0.61,
        hp = 150,
        prepareJumpTime = 20,
        --jumpTime = 20,
        resetJumpTime = 24,

        deathParticleCountMin = 100,
        deathParticleCountMax = 300,
        deathAnimationParticleSpeed = 1,
        deathAnimationParticleSpeedNormalizer = 0.4,
        deathParticleMinSpeed = 1,
        deathParticleSprite = StaticSprite:new(378, 1),

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
            beatMap = {0, 0, 0, 0, 0, 0, 0, 0,},
            sfxMap = {
                -- {4, 'A-2', 16, 0, 4, -1},
                -- {4, 'C-3', 16, 0, 4, -1},
                {1, 'A-4', -1, 2, 10, 0},
                {1, 'G-4', -1, 2, 10, 0},
                {1, 'A-4', -1, 2, 10, 0},
                {1, 'G-4', -1, 2, 10, 0},
            },
            altBeatMap = {0,0,0,0, 1, 1, 1, 1}
        },

        sprites = {
            chill = StaticSprite:new(312, 2),
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

        deathBulletSprite = StaticSprite:new(378, 1),
    }, -- mb static idk
}

data.add_all_autobullethell_sizes(
    80,
    {
        beatMap = {1,0,0,0,0,0,0,0},
        sfxMap = {
            {16, 'B-2', 50, 0, 15, 0},
            {16, 'A-2', 50, 0, 10, 0},
            {16, 'F#2', 50, 0, 10, 0},
            {16, 'G#2', 50, 0, 10, 0},
            {16, 'A-2', 50, 0, 10, 0},
            {16, 'B-2', 50, 0, 15, 0},
            {16, 'A-2', 50, 0, 10, 0},
            {16, 'F#2', 50, 0, 10, 0},
        },
        intro = silence,
    }
)
-- drum theme --------------------------------------

data.add_all_bullethell_sizes(
    112,
    {
        beatMap = {
            0,0,1,0,
            0,1,0,0,
            1,0,0,1,
            0,0,1,1,
        },
        sfxMap = {
            {20, 'A-8', -1, 1, 9, 0},
            {20, 'A-8', -1, 1, 9, 0},
            {20, 'A-8', -1, 1, 9, 0},
            {20, 'E-8', -1, 1, 9, 0},
            {20, 'A-8', -1, 1, 9, 0},
        },
    }
)

data.add_all_bullethell_sizes(
    131,
    {
        beatMap = {
            1,0,1,0,
            1,0,1,0,
            1,0,1,0,
            1,0,1,0,
        },
        sfxMap = {
            {17, 'B-8', -1, 2, 6, 0},{17, 'B-8', -1, 2, 8, 0},{17, 'B-8', -1, 2, 10, 0},{17, 'B-8', -1, 2, 12, 0},
            {19, 'B-8', -1, 2, 14, 0},{17, 'B-8', -1, 2, 12, 0},{17, 'B-8', -1, 2, 10, 0},{17, 'B-8', -1, 2, 8, 0},
        },
    }
)

data.add_all_bullethell_sizes(
    128,
    {
        beatMap = {
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,
            0,1,0,1,
        },
        sfxMap = {
            {17, 'B-8', -1, 2, 5, 0},
        },
    }
)
-----------------------------------------------------

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


-- second theme --------------------------------------------------------------------------------------------------------------------------------------------------
data.add_enemy(
    12,
    strongrose,
    {
        beatMap = {1,0, 0,0, 1,0, 0,0},
        sfxMap = {
            {2, 'D-3', -1, 1, 11, 0},
            {2, 'D-4', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},

            {2, 'D-4', -1, 1, 11, 0},
            {2, 'D-4', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},
            {2, 'B-3', -1, 1, 11, 0},
        },
        intro = {
            beatMap = {0,0, 0,0, 1,0, 1,0},
            sfxMap = {
                {2, 'A-3', -1, 1, 4, 0},
                {2, 'F#3', -1, 1, 4, 0},
            },  
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
        intro = silence,
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
        intro = silence,
    }
)

data.add_all_bullethell_sizes(38,
    {
        beatMap = {0,0, 0,0, 0,0, 0,0,},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'F#6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
            {19, 'A-6', -1, 0, 4, 0},
        },
        intro = silence,
        altBeatMap = {1,0,1,0, 1,0,1,0,}
    }
)
data.add_all_bullethell_sizes(41,
    {
        beatMap = {0,0, 1,0, 0,1, 0,0},
        sfxMap = {
            -- {18, 'C#3', -1, 2, 5, 0},
            {19, 'C#7', -1, 0, 4, 0},
            {19, 'C#7', -1, 0, 4, 0},
            {19, 'B-6', -1, 0, 4, 0},
            {19, 'B-6', -1, 0, 4, 0},
        },
        intro = silence,
        -- altBeatMap = {1,1,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0,}
    }
)
------------------------------------------------------------------------------------------------------------------------------------------------------------------

data.add_enemy(19, verystrongrose,
    {
        beatMap = {1,1,1,1, 1,1,1,0},
        sfxMap = {
            {8, 'A-2', 90, 1, 6, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},
            {1, 'A-2', 16, 3, 0, 0},

            {8, 'C-3', 60, 1, 10, 0},
            {1, 'C-3', 16, 3, 0, 0},
            {1, 'C-3', 16, 3, 0, 0},
            {1, 'C-3', 16, 3, 0, 0},
        },
        intro = silence,
        altBeatMap = {1,1,1,1, 0,0,0,0},
    })
