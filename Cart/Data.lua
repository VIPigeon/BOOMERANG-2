data = {}

-- 14, 15, 30, 31 - Резервные тайлы (почему бы и нет)

GAME_BPM = 60

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

MAP_WIDTH = 239
MAP_HEIGHT = 135

PLAYER_START_Y = 10
PLAYER_START_X = 10

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

data.Player = {
    movementNormalizerStraight = 1,
    movementNormalizerDiagonal = 1 / math.sqrt(2),
    speed = 0.7,
    deathParticleSprite = Sprite:new({377}, 1),
    deathAnimationDurationMs = 1000,
    deathParticleCountMin = 10,
    deathParticleCountMax = 20,
    deathAnimationParticleSpeed = 0.4,
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
    stayFront =Sprite:new({257}, 1),
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

data.mapConstants = {}

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
    speed = 2,
    color = 12,

    radius = 2,

    staticRadius = 3,
    bodyColor = 3,
    staticBodyLength = 10,
    staticTaraxacumSpawnTile = { 34 },

    deathBulletSpread = 1,
    deathBulletCount = 12,
    deathBulletSpeed = 0.5,
    deathBulletSprite = Sprite:new({378}, 1),
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
    turnedOffSprite = Sprite:new({0}, 1),
    turnedOnSprite = Sprite:new({248}, 1),
    justUsedSprite = Sprite:new({249}, 1),
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

data.Lever = {}
data.Lever.sprites = {
    on = Sprite:new({3},1),
    off = Sprite:new({2},1),
}

data.SettingLever ={}
data.SettingLever.sprites = {
    on = Sprite:new({6}, 1),
    off = Sprite:new({5}, 1),
}

data.Enemy = {
    defaultHP = 5,
    defaultEnemyFlagTile = 33,
}
data.Enemy.sprites = {
    defaultSprite = Sprite:new({403}, 1),
    --ahegaoDeath = Sprite:new({386, 387, 388, 389, 390}, 1)
}
data.Enemy.sprites.hurtEffect = {
    hurtingHorizontal = Sprite:new(anim.gen({473, 474, 475, 476, 477, 478, 479}, 3), 1),
    hurtingVertical = Sprite:new(anim.gen({473 + 16, 474 + 16, 475 + 16, 476 + 16, 477 + 16, 478 + 16, 479 + 16}, 3), 1),
    hurtingNull0 = Sprite:new({0}, 1),
    hurtingNull1 = Sprite:new({0}, 1),
    hurtingNull2 = Sprite:new({0}, 1),
    hurtingNull3 = Sprite:new({0}, 1),
}

data.Rose = {
    startingHealth = 50,
    metronomeTicksReloading = 1,
    metronomeTicksSpentShooting = 1,
}

data.LongRose = {}
data.LongRose.spawnTiles = {166, 167, 168, 169}

data.Rose.spawnTiles = {150, 151, 152, 153}
data.Rose.anotherRoseFlagTile = 15
data.Rose.sprites = {
    transition = Sprite:new({389, 391, 393, 395, 397, 421}, 2),
    death = Sprite:new(anim.gen60({423, 425, 427, 429}), 2),
}
data.Rose.animation_frame_duration_ms = 16
data.Rose.rose_animation_duration_ms = data.Rose.animation_frame_duration_ms * #data.Rose.sprites.transition.animation

data.BulletHell = {
    circleDiameter = {4, 8, 16},
    bulletSpeadRadius = {5, 8, 11},
    bulletRotateSpeed = {1,1,1},
    bulletCount = {8, 12, 16},
    bulletSpeed = {0.6, 0.7, 0.8},
    deathBulletSpeed = {0.7, 0.2, 0.1},
    deathTimeMs = 1000,
    hp = {1, 1, 1}
}

data.BulletHell.spawnTiles = {48, 49, 50}
data.BulletHell.sprites = {
    defaultSprite = 999,
}

data.Bullet = {
    defaultSpeed = 0.5,
    defaultSprite = Sprite:new({373}, 1),
    reloadAnimation = Sprite:new(anim.gen({373, 0, 374, 375, 376}, 4), 1),
}

data.Snowman = {
    speed = data.Player.speed - 0.41,
    hp = 10,
    prepareJumpTime = 20,
    --jumpTime = 20,
    resetJumpTime = 24,
}

data.Snowman.specialTaraxacum = {
    radius = 3,
    bodyLength = 13,
    shiftForCenterX = 12,
    shiftForCenterY = -3,
    startStickX = 0,
    startStickY = 0,
    bodyColor = 10,
    color = 12,
    reloadAnimationTime = 18, -- in tics should divide by 3
}

data.Snowman.spawnTiles = {65}

data.Snowman.sprites = {
    chill = Sprite:new({312}, 2),
    prepareJump = Sprite:new({312, 344}, 2),
    flyJump = Sprite:new(anim.gen60({346,348,346}), 2),
    resetJump = Sprite:new({348,344,312}, 2),
    death = Sprite:new(anim.gen60({312,314,312,314,312}), 2)
}

-- Я дурак 😫
data.SnowmanBox = {}
data.SnowmanBox.playerCheckFrequencyMs = 1000
data.SnowmanBox.wakeUpDistanceToPlayer = 48
data.SnowmanBox.sleepSprite = Sprite:new({485}, 2)
data.SnowmanBox.wokeupSprite = Sprite:new({487}, 2)

return data
