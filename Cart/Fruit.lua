fruitsCollection = {
    collected = 0,
    needed = 0,
}

FruitPopup = {
    timeOnScreen = 0,
    timeToStay = 0,
}

function FruitPopup:show(stayTimeMilliseconds)
    self.timeOnScreen = 0
    self.timeToStay = stayTimeMilliseconds
end

local goToBikeSprite = Sprite:new({308}, 4)

function FruitPopup:draw()
    if fruitsCollection.collected == fruitsCollection.needed then
        rect(0, MAP_HEIGHT-30, 54, 40, 8)
        print('GoTo\nBike', 4, MAP_HEIGHT-26, 0, true, 2)
        return
    end

    if self.timeOnScreen < self.timeToStay then
        local digitCount = math.ceil(math.log(fruitsCollection.collected + 1, 10)) +
                           math.ceil(math.log(fruitsCollection.needed, 10))
        width = 16 + 12 * digitCount
        rect(0, MAP_HEIGHT-16, width, 20, 8)

        print(
            fruitsCollection.collected .. '/' .. fruitsCollection.needed,
            3,
            MAP_HEIGHT-12,
            0,
            true,
            2
        )
        self.timeOnScreen = self.timeOnScreen + Time.dt()
    end
end

local Fruit = table.copy(Body)

function Fruit:new(id, x, y)
    local sprite1 = Sprite:new({id}, 1)
    local sprite2 = Sprite:new({id+1}, 1)

    local obj = {
        x = x,
        y = y,
        id = id,
        collected = false,
        sprite = sprite1,
        sprite1 = sprite1,
        sprite2 = sprite2,
        hitbox = Hitbox:new(x, y, x+8, y+8),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end


function Fruit:update()
    if game.metronome.beat4 then
        if self.sprite == self.sprite1 then
            self.sprite = self.sprite2
        else
            self.sprite = self.sprite1
        end
    end

    if self.collected then
        table.insert(game.deleteSchedule, self) -- Чтобы не респавнился после смерти игрока 👍
    end

    if not self.collected and self.hitbox:collide(game.player.hitbox) then
        fruitsCollection.collected = fruitsCollection.collected + 1

        -- 🔊🤯
        local sound = data.fruitSFX[self.id]
        sfx(sound[1], sound[2], sound[3], sound[4], sound[5], sound[6])

        table.removeElement(game.fruits, self) -- Чтобы не респавнился после смерти игрока 👍
        table.insert(game.deleteSchedule, self)

        self.collected = true

        FruitPopup:show(1000) -- 2 Секунды, ни больше ни меньше 😎
    end
end

function isFruit(tileID)
    local fruitIDs = {144, 145, 160, 161, 176, 177, 192, 193}
    return table.contains(fruitIDs, tileID)
end

function getFruitSprite(tileID)
    return Sprite:new({tileID}, 1)
end

function createFruits()
    local fruits = {}
    for x = 0, MAP_WIDTH do
        for y = 0, MAP_HEIGHT do
            local id = mget(x, y)
            if isFruit(id) then
                local fruit = Fruit:new(id, 8*x, 8*y)
                table.insert(fruits, fruit)
                mset(x, y, 0)
            end
        end
    end
    return fruits
end
