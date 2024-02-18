Decorations = {}

local decorationTiles = {
    100, 101, 102, 103, 104,
}
local decorations = {}

local function nextFrame(decoration)
    local x = decoration.x
    local y = decoration.y

    mset(x, y, 0);
    if decoration.c then
        mset(x, y, decoration.nxt)
    else
        mset(x, y, decoration.cur)
    end

    decoration.c = not decoration.c
end

function Decorations.init()
    for x = 0, MAP_WIDTH do
        for y = 0, MAP_HEIGHT do
            local tile = mget(x, y)
            local decoration
            if table.contains(decorationTiles, tile) then
                decoration = {x=x, y=y, c=true, cur=tile, nxt=tile+16}
            elseif table.contains(decorationTiles, tile - 16) then
                decoration = {x=x, y=y, c=false, cur=tile - 16, nxt=tile}
            end
            table.insert(decorations, decoration)
        end
    end
end

function Decorations:update()
    if game.metronome.beat4 then
        for _, decoration in ipairs(decorations) do
            nextFrame(decoration)
        end
    end
end
