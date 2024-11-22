math.randomseed(12412)

--Эпиграф: 

        --"-- Я дурак 😫"

data = {}

-- 14, 15, 30, 31 - Резервные тайлы (почему бы и нет)

GAME_BPM = 160

C0 = 0

KEY_W = 23
KEY_A = 01
KEY_S = 19
KEY_D = 04
KEY_R = 18
KEY_UP = 58
KEY_DOWN = 59
KEY_LEFT = 60
KEY_RIGHT = 61

KEY_to_btn = {
    [KEY_W] = 0,
    [KEY_S] = 1,
    [KEY_A] = 2,
    [KEY_D] = 3,
    [KEY_UP] = 7,
    [KEY_DOWN] = 4,
    [KEY_LEFT] = 6,
    [KEY_RIGHT] = 5,
}


KEY_B = 02 -- Что это?? Это круто. 🙂 ЁЯЩа<😎>

MAP_WIDTH = 239
MAP_HEIGHT = 135

PLAYER_START_Y = 76 * 8 -- 128 * 8 -- 😋😋
PLAYER_START_X = 105 * 8 -- 42 * 8  -- 😲😲
-- PLAYER_START_X = 8* 114
-- PLAYER_START_Y = 8* 14

-- PLAYER_END_Y = 89 * 8 -- BYKE 😎😎
-- PLAYER_END_X = 118 * 8 -- G🤠T🤠 BYKE

DECORATION_IDS = {
    100,
    101,
    102,
    103,
    104
}
DECORATION_ANIMATION_OFFSET = 16

CAMERA_WINDOW_WIDTH = 40
CAMERA_WINDOW_HEIGHT = 20
CAMERA_WINDOW_START_X = PLAYER_START_X - CAMERA_WINDOW_WIDTH / 2
CAMERA_WINDOW_START_Y = PLAYER_START_Y - CAMERA_WINDOW_HEIGHT / 2
CAMERA_SPEED = 0.3

MAP_WIDTH = 239
MAP_HEIGHT = 135

M44 = 24  -- константа для Metronome4_4

data.fruitSFX = {
    [144] = {63, 'B-5', -1, 3, 5, 0},
    [160] = {63, 'D-6', -1, 3, 5, 0},
    [176] = {63, 'E-6', -1, 3, 5, 0},
    [192] = {63, 'F-6', -1, 3, 5, 0},
}

data.Player = {
    movementNormalizerStraight = 1,
    movementNormalizerDiagonal = 0.7,
    speed = 1.03,
    -- speed = 0.1,
    deathParticleSprite = StaticSprite:new(377, 1),
    deathAnimationDurationMs = 1000,
    deathParticleCountMin = 10,
    deathParticleCountMax = 20,
    deathAnimationParticleSpeed = 0.4,

    sfx = {
        -- leverOn = {56, 'E-6', -1, 3, 1, -2},
        leverOn = {57, 'E-6', -1, 3, 5, 0},
        leverOff = {57, 'E-5', -1, 3, 5, 0},
        closeDoor = {58, 'D-2', -1, 3, 8, 1},
        checkpoint = {59, 'E-5', -1, 3, 2, -1},
    }
}

function plr_death_anim()
    res = {}
    for i = 272, 278 do
        for _ = 1, 8 do
            table.insert(res, i)
        end
    end
    for _ = 1, 4 do
        table.insert(res, 279)
    end
    return res
end

data.Player.sprites = {
    stayFront = Sprite:new({257}, 1),
    runFront = Sprite:new(anim.gen60({256, 257, 258, 259, 256, 257, 258, 259, 256, 257, 258, 259}), 1),
    death = Sprite:new({452, 453, 454}, 1),
    hat = Sprite:new(anim.gen60({279}), 1),
    stayBack = Sprite:new({465}, 1),
    runBack = Sprite:new(anim.gen60({464, 465, 466, 467, 464, 465, 466, 467, 464, 465, 466, 467}), 1),
}

data.Boomerang = {
    flightNormalizerStraight = 1,
    flightNormalizerDiagonal = 1 / math.sqrt(2),
    speed = 0.1,
    decelerationConstant = 80, -- in context: CurentSpeed -= (StartSpeed / this)
    damagePerMillisecond = 0.1,
}
data.Boomerang.sprites = {
    spinning = Sprite:new(anim.gen60({264, 265, 266, 264, 265, 266, 264, 265, 266, 264, 265, 266}), 1),
    hurtingHorizontal = Sprite:new(anim.gen60({473, 474, 475, 476, 477, 478, 479}), 1),
    hurtingVertical = Sprite:new(anim.gen60({473 + 16, 474 + 16, 475 + 16, 476 + 16, 477 + 16, 478 + 16, 479 + 16}), 1),
}

data.Bike = {}

data.Bike.sprites = {
    waitingForHero = StaticSprite:new(138,2),
    himAgain = StaticSprite:new(140, 2),
    sparklualCycleModifier = 10,
}
data.Bike.sprites.animations = {
    sparkingWhileWaitingMyBoy = Sprite:new(anim.gen({505, 506, 507, 508, 509, 510}, 6), 1),
    notSparklingBecauseSandnessComeAgain = StaticSprite:new(0, 1),
    -- notSparklingBecauseSandnessCameAgain = StaticSprite:new({0}, 1),
    notSparklingBecauseBoring = StaticSprite:new(0, 1),
    -- notSparkling = Sprite:new({0}, 1),
    -- notSparklingAgain = Sprite:new({0}, 1),
    -- notSparklingAndAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAndAgain = Sprite:new({0}, 1),
    sparklingWhileExhaustedWaitingMyBoy = Sprite:new(anim.gen({457, 458, 459, 460, 461, 462, 463}, 6), 1),
    -- notSparklingAgainAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAndAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAgainAgainAgain = Sprite:new({0}, 1),
    -- notSparklingAgainAgainAgainAgainAgainAgainAgina = Sprite:new({0}, 1),
}

--Map и mapConstants должны быть уничтожены

data.Map = {}

data.Map.WallTileIds = {
    208, 209, 210, 224, 225, 226, 240, 241, 242, 142, 143, 158, 159
}

data.mapConstants = {}

--🤣😂😅😓😥😪🤤
data.mapConstants.bikeTiles = {
    --['comparator'] = 138, 
    --['comparaptor'] = 139,
    ['comparader'] = 138 + 16,
    ['comparactor'] = 139 + 16,
}
--🥶😱😨😰😭😢🤤

-- (0 o 0) Use a function for this later
-- Turned off wire id --> Turned on wire id
data.mapConstants.turnedOffWires = {
    [146] = 146 + 32,
    [147] = 147 + 32,
    [148] = 148 + 32,
    [146 + 16] = 146 + 16 + 32,
    [147 + 16] = 147 + 16 + 32,
    [148 + 16] = 148 + 16 + 32,
}

-- Turned on wire id --> Turned off wire id
data.mapConstants.turnedOnWires = {
    [146 + 32] = 146,
    [147 + 32] = 147,
    [148 + 32] = 148,
    [146 + 16 + 32] = 146 + 16,
    [147 + 16 + 32] = 147 + 16,
    [148 + 16 + 32] = 148 + 16,
}

-- Door tile id --> Offset from left top tile
data.mapConstants.doorOffsetsIds = {
    [41] = {x = 0, y = 0},
    [42] = {x = -1, y = 0},
    [41 + 16] = {x = 0, y = -1},
    [42 + 16] = {x = -1, y = -1},
}

data.mapConstants.doorIds = {
    [204] = 204,
    [205] = 205,
    [206] = 206,
    [204 + 16] = 204 + 16,
    [205 + 16] = 205 + 16,
    [206 + 16] = 206 + 16,
}


data.mapConstants.leverIds = {
    [1] = 1,
    [2] = 2,
    [3] = 3,
}

data.mapConstants.settingLeverIds = {
    [1] = 4,
    [2] = 5,
    [3] = 6,
}

data.Door = {
    speed = 0.1,
    closingAcceleration = 0.01,
    widthTiles = 6,
    heightTiles = 4,
    shakeTimeTics = 20,
    closedGapInPixels = 4,
    solidTileId = 207,
}
data.Door.spriteTiles = {
    upperLeft = 204,
    upperMid = 205,
    upperRight = 206,
    bottomLeft = 204 + 16,
    bottomMid = 205 + 16,
    bottomRight = 206 + 16,
}
data.Door.sprite = {
    leftPart = -1,
    rightPart = -1,
}

data.Taraxacum = {
    color = 12,
    speed = 2,

    radius = 2,
    staticRadius = 3,
    bodyColor = 10,
    staticBodyLength = 10,
    staticTaraxacumSpawnTile = { 97 },

    deathBulletCount = 6,
    deathBulletSlowCount = 3,
    deathBulletFastCount = 3,

    deathBulletSpeed = 0.37,
    deathSlowBulletSpeed = 0.2,
    deathFastBulletSpeed = 0.5,

    deathBulletSpread = 2.5,

    deathBulletSprite = StaticSprite:new(378, 1),
}

data.StaticTaraxacum = {
    bodyColor = 9,
    -- radius = 2,
    -- speed = 2,
    -- deathBulletCount = 6,
    -- deathBulletSlowCount = 3,
    -- deathBulletFastCount = 3,
    -- deathBulletSpread = 2,
}

local turnOnAnimationFrames = {}
for i = 213, 217 do
    table.insert(turnOnAnimationFrames, i)
end
for i = 213 + 16, 217 + 16 do
    table.insert(turnOnAnimationFrames, i)
end
for i = 213 + 32, 217 + 32 - 1 do
    table.insert(turnOnAnimationFrames, i)
end

data.Checkpoint =  {
    width = 8,
    height = 8,
    flagTile = 211,
    turnedOffSprite = StaticSprite:new(0, 1),
    turnedOnSprite = StaticSprite:new(248, 1),
    justUsedSprite = StaticSprite:new(249, 1),
    turnOnAnimation = Sprite:new(anim.gen(turnOnAnimationFrames, 3), 1),
}

data.solidTiles = {
    1, 2, 3,
    208, 209, 210,
    224, 225, 226,
    240, 241, 242,
}

-- table.concatTable(data.solidTiles,) --> (ノ｀Дa почему??)ノ - да потому!
-- for i, t in ipairs(data.solidTiles) do
--     trace(t..' ')
-- end

data.bfs = {'😎'}

data.bfs.solidTiles = {
    207, -- special tile for door to make it fit SOLID principles
}

data.Lever = {
    hitboxShiftX = 2,
    hitboxShiftY =2,
    hitboxWidth = 2,
    hitboxHeight = 4,
}
data.Lever.sprites = {
    on = StaticSprite:new(3,1),
    off = StaticSprite:new(2,1),
}

data.SettingLever ={}
data.SettingLever.sprites = {
    on = StaticSprite:new(6, 1),
    off = StaticSprite:new(5, 1),
}

data.EnemyDeathSounds = {  -- i cancel it :-<
    WeakRose = {1, 'A-5', -1, 3, 0, 3},
    Rose = {1, 'B-5', -1, 3, 0, 3},
    BulletHell = {1, 'D-5', -1, 3, 0, 0},
    Snowman = {1, 'E-5', -1, 1, 0, 0},
}
data.EnemyDamageSounds = {
    WeakRose = {62, 'A-4', 8, 3, 8, 0},
    Rose = {62, 'B-4', -1, 3, 8, 0},
    BulletHell = { 62, 'D-4', -1, 3, 8, 0  },
    Snowman = { 62, 'E-4', -1, 3, 8, 0  },
}

RoseHP = {weak=15, strong=200}
BulletHellHP = {small=25, medium=50, big=100}

-- EnemyConfig look in SuperConfig

data.BulletHell = {
    -- circleDiameter = {5, 8, 16},
    -- bulletSpeadRadius = {5, 8, 11},
    -- bulletRotationSpeed = {1,1,1},
    -- bulletCount = {8, 12, 16},
    -- bulletSpeed = {0.8, 0.7, 0.8},
    -- deathBulletSpeed = {0.3, 0.2, 0.1},
    -- hp = {12, 25, 40},
    deathTimeMs = 1000,
}

-- data.BulletHell.spawnTiles = {48, 49, 50}
data.BulletHell.sprites = {
    defaultSprite = 999,
}

data.AutoBulletHell = {
    -- spawnTiles = {32,33,34},

    -- circleDiameter = {5, 8, 16},
    -- bulletSpeadRadius = {5, 8, 11},
    -- bulletRotationSpeed = {1,1,1},
    -- bulletCount = {8, 12, 16},
    -- bulletSpeed = {0.8, 0.7, 0.8},
    -- deathBulletSpeed = {0.3, 0.2, 0.1},
    -- hp = {12, 25, 40},
    deathTimeMs = 1000,
}

data.Bullet = {
    defaultSpeed = 0.5,
    defaultSprite = StaticSprite:new(373, 1),
    reloadAnimation = Sprite:new(anim.gen({373, 0, 374, 375, 376}, 4), 1),
}

data.Enemy = {
    defaultHP = 5,
    defaultEnemyFlagTile = 98,
}
data.Enemy.sprites = {
    defaultSprite = StaticSprite:new(403, 1),
    --ahegaoDeath = Sprite:new({386, 387, 388, 389, 390}, 1)
}
data.Enemy.sprites.hurtEffect = {
    hurtingHorizontal = Sprite:new(anim.gen({473, 474, 475, 476, 477, 478, 479}, 3), 1),
    hurtingVertical = Sprite:new(anim.gen({473 + 16, 474 + 16, 475 + 16, 476 + 16, 477 + 16, 478 + 16, 479 + 16}, 3), 1),
    hurtingNull0 = StaticSprite:new(0, 1),
    hurtingNull1 = StaticSprite:new(0, 1),
    hurtingNull2 = StaticSprite:new(0, 1),
    hurtingNull3 = StaticSprite:new(0, 1),
}

data.Rose = {
    startingHealth = 50,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
}

data.LongRose = {}
data.LongRose.spawnTiles = {166, 167, 168, 169}

data.MusicRose = {}
data.MusicRose.spawnTiles = {
    D2 = {182, 183, 184, 185},
    Fd2 = {170, 171, 172, 173},
    Gd2 = {186, 187, 188, 190},
}

data.Rose.spawnTiles = {150, 151, 152, 153}
data.Rose.anotherRoseFlagTile = 15
data.Rose.sprites = {
    transition = Sprite:new({389, 391, 393, 395, 397, 421}, 2),
    death = Sprite:new(anim.gen60({423, 425, 427, 429}), 2),
    idle = StaticSprite:new(389, 2),
    shooting = StaticSprite:new(391, 2),
}
data.Rose.animation_frame_duration_ms = 16
data.Rose.rose_animation_duration_ms = data.Rose.animation_frame_duration_ms * #data.Rose.sprites.transition.animation

data.WeakRose = {}
data.WeakRose.sprites = {
    death = Sprite:new(anim.gen60({277, 279, 281, 283}), 2),
    idle = StaticSprite:new(393, 2),
    shooting = StaticSprite:new(395, 2),
}

data.Snowman = {}

data.Snowman.whirl = {
    fadeTimeMs = 150, -- Время до исчезания частички вихря
    sprite = StaticSprite:new(350, 1),
    rotationSpeed = 0.012, -- Скорость вращения палки. Так мало, потому что миллисекунды 😏
    particleEmitDelayMs = 4, -- Задержка между спавном частиц вихря
    taraxacum = {
        radius = 7, -- Радиус одуванчика на палке при вращении

        deathBulletCount = 12, -- Количество пуль после смерти одуванчика
        deathSlowBulletCount = 6,
        deathFastBulletCount = 6,
    },
    endTaraxacumSpeed = 1.5, -- Скорость одуванчика, который запускается после конца атаки.
}

-- Выделил 😎
    data.Snowman.specialTaraxacum = {
        radius = 3,
        bodyLength = 15,
        shiftForCenterX = 12,
        shiftForCenterY = -3,
        startStickX = 0,
        startStickY = 0,
        bodyColor = 10,
        color = 12,
        reloadAnimationTime = 18, -- in tics should divide by 3
    }

data.SnowmanBox = {}
data.SnowmanBox.playerCheckFrequencyMs = 1000
data.SnowmanBox.wakeUpDistanceToPlayer = 48
data.SnowmanBox.sleepSprite = StaticSprite:new(485, 2)
data.SnowmanBox.wokeupSprite = StaticSprite:new(487, 2)


data.Cutscene = {
    smoke_dx = -0.012,
    smoke_dy = -0.018,
    -- smoke_frequency_ms = 3,
    smoke_minlifetime = 300,
    smoke_maxlifetime = 5000,
    smoke_frequency = 3, -- More - less particles
}   

return data
