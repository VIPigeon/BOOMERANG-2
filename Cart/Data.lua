data = {}


C0 = 0

KEY_W = 23
KEY_A = 01
KEY_S = 19
KEY_D = 04
KEY_UP = 58
KEY_DOWN = 59
KEY_LEFT = 60
KEY_RIGHT = 61


data.Player = {}

function plr_death_anim()
    res = {}
    for i=272, 278 do
        for _=1, 8 do
            table.insert(res, i)
        end
    end
    for _=1, 4 do
        table.insert(res, 279)
    end
    return res
end

data.Player.sprites = {
    stay_front =Sprite:new({257}, 1),
    run_front = Sprite:new(anim.gen60({256, 257, 258, 259, 256, 257, 258, 259, 256, 257, 258, 259}), 1),
    death = Sprite:new(anim.gen60(plr_death_anim()), 1),
    born = Sprite:new(table.reversed(anim.gen60(plr_death_anim())), 1),
    hat = Sprite:new(anim.gen60({279}), 1),
    stay_back = Sprite:new({465}, 1),
    run_back = Sprite:new(anim.gen60({464, 465, 466, 467, 464, 465, 466, 467, 464, 465, 466, 467}), 1),
}


data.Boomerang = {}
data.Boomerang.sprites = {
    spinning = Sprite:new(anim.gen60({264, 265, 266, 264, 265, 266, 264, 265, 266, 264, 265, 266}), 1),
}


data.Door = {}
data.Door.tiles = {
    upper_left = 204,
    upper_right = 206,
    bottom_right = 222,
}


data.solid_tiles = {
    1, 2, 3,
    208, 209, 210,
    224, 225, 226,
    240, 241, 242,
}


data.Lever = {}
data.Lever.sprites = {
    on = Sprite:new({3},1),
    off = Sprite:new({2},1),
}


data.Rose = {}
data.Rose.sprites = {
    transition = Sprite:new({389, 391, 393, 395, 397, 421}, 2)
}
data.Rose.animation_frame_duration_ms = 16
data.Rose.rose_animation_duration_ms = data.Rose.animation_frame_duration_ms * #data.Rose.sprites.transition.animation


return data