-- Создать противника, стреляющего лазером
-- Лазер строго вертикальный или горизонтальный, является линией толщиной в три пикселя, которая идет от розы до первого препятствия (стены на глобальной карте)
-- Направление лазера зависит от направления розы. Роза никуда не поворачивается и не двигается
-- Лазер появляется мгновенно по всей вертикали (горизонтали)
-- У розы есть два состояния: включена и выключена. в выключенном состоянии роза переходит в "сплюснутый" вид. При включенном -- выпускает лазер.
-- Помимо противника, создать отдельный модуль с методами Game, в котором противники подписываются на ивенты. (для удобства, чтобы подписывание объектов на ивенты было изолировано)
-- Лазер должен появляться четко в ритм. Но появлению лазера предшествует быстрая анимация "вытягивания" розы. Поэтому запускать анимацию вытягивания нужно на опережение.

Rose = table.copy(Body)

Rose.sprite = Sprite:new({389, 391, 393, 395, 397, 421}, 2)

function Rose:new(x, y)
    obj = {
        sprite = Rose.sprite:copy(),
        x = x,
        y = y,
        
        hitbox = Hitbox:new(x, y, x + 8, y + 8),
        laserHitbox = Hitbox:new(x + 7, y + 9 - 20, x + 7 + 3, y + 9),

        hp = 200,
        isDead = false,

        time = 0,
        cooldown = 1 * 1000,
        shootEnd = 2 * 1000,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Rose:update()
    if self.time <= self.cooldown then
        self.laserHitbox:draw(1)
    end

    if self.time > self.shootEnd then
        self:shoot()
        self.time = 0
    end

    self.time = self.time + Time.dt()
end

function Rose:shoot()
    local laserHitbox = Hitbox:new(self.x + 7, self.y - 9, self.x + 3, self.y + 1)

    while laserHitbox:mapCheck() and laserHitbox.y1 > 0 and laserHitbox.y2 < 256 do
        laserHitbox:set_xy(laserHitbox.x1, laserHitbox.y1 - 1)
    end

    local x = laserHitbox.x1
    local y = laserHitbox.y1

    local newHitbox = Hitbox:new(x, y, self.x + 7 + 3, self.y + 9)

    -- trace('Laser: ' .. newHitbox.x1 .. ', ' .. newHitbox.y1 .. ' and ' .. newHitbox.x2 .. ', ' .. newHitbox.y2)

    self.laserHitbox = newHitbox
end
