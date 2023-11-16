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

function FruitPopup:draw()
    if self.timeOnScreen < self.timeToStay then
        print(
            fruitsCollection.collected .. '/' .. fruitsCollection.needed,
            0,
            MAP_HEIGHT-12,
            5,
            true,
            2
        )
        self.timeOnScreen = self.timeOnScreen + Time.dt()
    end
end

local Fruit = table.copy(Body)

function Fruit:new(sprite, x, y, respawn)
    local obj = {
        x = x,
        y = y,
        sprite = sprite,
        respawn = respawn,
        hitbox = Hitbox:new(x, y, x+8, y+8),
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

fruitRespawn = {}

function showGotoBike()
    error('todo')
end

function Fruit:update()
    if self.hitbox:collide(game.player.hitbox) then
        FruitPopup:show(2000) -- 2 Секунды, ни больше ни меньше 😎
        fruitsCollection.collected = fruitsCollection.collected + 1

        if fruitsCollection.collected == fruitsCollection.needed then
            showGotoBike()
        end

        table.removeElement(fruitRespawn, self.respawn) -- Чтобы не респавнился после смерти игрока 👍

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
    if #fruitRespawn == 0 then
        for x = 0, MAP_WIDTH do
            for y = 0, MAP_HEIGHT do
                local id = mget(x, y)
                if isFruit(id) then
                    table.insert(fruitRespawn, {x=x, y=y, id=id})
                    mset(x, y, 0)
                end
            end
        end
    end

    for _, fruitInfo in ipairs(fruitRespawn) do
        local fruit = Fruit:new(getFruitSprite(fruitInfo.id), 8*fruitInfo.x, 8*fruitInfo.y, fruitInfo)
        table.insert(fruits, fruit)
    end

    return fruits
end
