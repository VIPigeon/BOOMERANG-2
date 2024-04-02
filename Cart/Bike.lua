Bike = table.copy(Body)

function Bike:new(x, y)
    local obj = {
        x = x,
        y = y,
        hitbox = Hitbox:new(x, y, x + 16, y + 16), -- left top again 😒
        sprite = data.Bike.sprites.waitingForHero:copy(),
        currentAnimations = {},
        status = 'forgotten',

        area = MapAreas.findAreaWithTile(x // 8, y // 8),
        cutscene = nil,
        beforeCutsceneTime = 0,
        beforeCutsceneMaxTime = 120,
    }

    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Bike:sparkle()
    trace('sparkling~~')
end

function Bike:_drawAnimations()
    --trace('yay2')
    for _, anime in ipairs(self.currentAnimations) do
        anime:play()
    end
end

function Bike:draw()
    --trace('yay')
    self.sprite:draw(self.x - gm.x*8 + gm.sx, self.y - gm.y*8 + gm.sy, self.flip, self.rotate)
    self:_drawAnimations()
    if self.cutscene then
        self.cutscene:draw()
    end
end

function Bike:_focusAnimations()
    local center = self.hitbox:get_center()
    local width = self.hitbox:getWidth()
    local height = self.hitbox:getHeight()
    -- чтобы анимация проигрывалась вокруг байканура где-то

    local x1 = center.x - width / 2
    local x2 = center.x + width / 2
    local y1 = center.y - height / 2
    local y2 = center.y + height / 2
    -- self.hitbox:draw(2)
    rect(x1,y1, x2 - x1, y2 - y1, 2)
    for _, anime in ipairs(self.currentAnimations) do
        anime:focus(x1, y1, x2, y2 - 8)
    end
end

function Bike:onStatus()
    --trace('heyday')

    rand = math.random(14)
    if rand == 7 then
        local anime = AnimationOver:new(table.chooseRandomElement(data.Bike.sprites.animations), 'randomOn', 'activeOnes')
        --need refactoring
        if anime.sprite.animation[1] == 457 then
            anime.right_sided = true
            anime.left_sided = false
        end
        table.insert(self.currentAnimations, anime)

        self:_focusAnimations()
    end
end



--TODO: CUT scene
function Bike:scene()
    
    
    --😈😈😈😈😈😈😈😈😈 - a bit laggy
    --for i = 1, 10000000 do
    --    if (true) then
    --        local lol = 1
    --    end
    --end
    --😈😈😈😈😈😈😈😈😈
    --game.player:die()
end

function Bike:endspiel()
    
end

function Bike:update()
    --trace('yay1')\

    if self.status == 'endgame' then
        self.beforeCutsceneTime = self.beforeCutsceneTime + 1
        if (self.beforeCutsceneTime > self.beforeCutsceneMaxTime and self.cutscene.TIMERCRUTCH) then --useless bigdata
            self.cutscene:updateGMXGMSXGMYGMSY()
            self.cutscene:make_smokkkkk()
            self.cutscene.TIMERCRUTCH = false
        end
        self.cutscene:update()
        return
    end

    if self.status ~= 'endgame' and self.hitbox:collide(game.player.hitbox) then
        self.sprite = data.Bike.sprites.himAgain:copy()
        trace('Ugh, rolled around in the sandbox again, drunkard!😞')
        
        self.cutscene = CutScene:new(game.player, game.bike)
        self.cutscene:init()
        self.status = 'endgame' --yose
        return
    end

    if self.area == game.playerArea then
        self.status = 'blossomed'
    else
        self.status = 'forgotten'
    end

    if self.status == 'blossomed' then
        self:onStatus()
    end
end
