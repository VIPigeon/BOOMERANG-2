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
        rect(0, MAP_HEIGHT-40, 40, 40, 8)
        goToBikeSprite:draw(4, MAP_HEIGHT-36)
        return
    end

    if self.timeOnScreen < self.timeToStay then
        rect(0, MAP_HEIGHT-16, 40, 20, 8)
        print(
            fruitsCollection.collected .. '/' .. fruitsCollection.needed,
            3,
            MAP_HEIGHT-12,
            1,
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

    if self.hitbox:collide(game.player.hitbox) then
        FruitPopup:show(1000) -- 2 Секунды, ни больше ни меньше 😎
        fruitsCollection.collected = fruitsCollection.collected + 1

        table.removeElement(game.fruits, self) -- Чтобы не респавнился после смерти игрока 👍

        table.insert(game.deleteSchedule, self)
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
