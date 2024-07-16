C0 = 0  -- прозрачный цвет

require("Heap")
require("Aim")
require("Math")
require("Animation")
require("AnimeParticles")
require("CutScene")
require("Body")
require("Table")
require("Hitbox")
require("HitCircle")
require("Sprite")

require("Drums")
require("BassLine")
require("Data")
require("SuperConfig")

require("Palette")
require("Rect")
require("Queue")
require("Stack")
require("Particle")
require("Whirl")
require("AnimationOver")
require("Fruit")

require("MapAreas")
require("GlobalMap")

require("Time")
require("Timer")
require("Metronome")
require("Metronome4_4")

require("Enemy")

require("BulletHell")
require("HellBullet")
require("AutoHellBullet")
require("AutoBulletHell")
require("MusicBulletHell")
require("MusicAutoBulletHell")

require("Rose")
require("LongRose")
require("MusicRose")
require("Decorations")

require("Bullet")
require("Taraxacum")
require("JustTaraxacum")
require("StaticTaraxacum")
require("SpecialTaraxacum")
require("Snowman")
require("MusicSnowman")
require("SnowmanBox")
require("SnowmanWhirlAttack")

require("DoorMechanic")
require("Lever")
require("Door")

require("EnemyFactory")

require("Checkpoint")
require("Player")
require("Bike")
require("Boomerang")
require("CameraWindow")
require("Settings")
require("Game")

function TIC()
    cls(C0)
    game.update()
end