
-- Я добавил фабричный метод, чтобы ты мог делать конфиги, пока делаешь конфиги

RoseHP = {weak=15, strong=200}
BulletHellHP = {small=25, medium=50, big=100}

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
        bulletSpeed = 1.1,
        deathBulletSpeed = 0.1,
        color = 14,
        hp = BulletHellHP.small,
    },
    medium = {
        name = 'MusicBulletHell',
        circleDiameter = 8,
        bulletSpreadRadius = 8,
        bulletRotationSpeed = 0.0009,
        bulletCount = 12,
        bulletSpeed = 0.7,
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
        bulletSpeed = 0.7,
        deathBulletSpeed = 0.1,
        color = 14,
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

