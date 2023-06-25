-- Создать противника, стреляющего лазером
-- Лазер строго вертикальный или горизонтальный, является линией толщиной в три пикселя, которая идет от розы до первого препятствия (стены на глобальной карте)
-- Направление лазера зависит от направления розы. Роза никуда не поворачивается и не двигается
-- Лазер появляется мгновенно по всей вертикали (горизонтали)
-- У розы есть два состояния: включена и выключена. в выключенном состоянии роза переходит в "сплюснутый" вид. При включенном -- выпускает лазер.
-- Помимо противника, создать отдельный модуль с методами Game, в котором противники подписываются на ивенты. (для удобства, чтобы подписывание объектов на ивенты было изолировано)
-- Лазер должен появляться четко в ритм. Но появлению лазера предшествует быстрая анимация "вытягивания" розы. Поэтому запускать анимацию вытягивания нужно на опережение.

Rose = table.copy(Body)

Rose.sprite = Sprite:new({389, 391, 393, 395, 397, 421}, 2)

-- ЧТО??!
local ROSE_ANIMATION_DURATION_MS = 80

function Rose:on_beat()
    self.ticks = self.ticks + 1

    if not self.shooting then
        if self.ticks == self.ticksBeforeShot then
            self:shoot()
            self.shooting = true
            self.ticks = 0
        end
    else
        if self.ticks == self.ticksShooting then
            self.sprite:set_frame(1)
            self.shooting = false
            self.ticks = 0
        end
    end
end

function Rose:new(x, y, direction)
    -- direction:
    -- 0 - up
    -- 1 - down
    -- 2 - left
    -- 3 - right
    local flip = 0
    if direction == 1 then
        flip = 2
    elseif direction == 2 then
        flip = 1
    end
    local rotate = 0
    if direction == 2 or direction == 3 then
        rotate = 1
    end

    obj = {
        sprite = Rose.sprite:copy(),
        x = x,
        y = y,
        flip = flip,
        rotate = rotate,
        
        hitbox = Hitbox:new(x, y, x + 8, y + 8),
        laserHitbox = Hitbox:new(x + 7, y + 11 - 20, x + 7 + 3, y + 11),
        direction = direction,

        hp = 200,
        isDead = false,

        shooting = false,
        ticks = 0,
        ticksBeforeShot = 1,
        ticksShooting = 2,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Rose:update()
    if self.shooting then
        self.animation_playing = false
        self.laserHitbox:draw(1)
        -- And handle collisions
    elseif self.metronome:ms_before_next_beat() <= ROSE_ANIMATION_DURATION_MS and not self.animation_playing then
        self.animation_playing = true
    end

    if self.animation_playing and not self.sprite:animation_end() then
        self.sprite:next_frame()
    end
end

function Rose:shoot()
    local laserHitbox = Hitbox:new(self.x + 7, self.y - 9, self.x + 3, self.y + 1)

    while laserHitbox:mapCheck() and laserHitbox.y1 > 0 and laserHitbox.y2 < 256 do
        laserHitbox:set_xy(laserHitbox.x1, laserHitbox.y1 - 1)
    end

    local x = laserHitbox.x1
    local y = laserHitbox.y1 + 1

    local newHitbox = Hitbox:new(x, y, self.x + 7 + 3, self.y + 9)

    self.laserHitbox = newHitbox
end
