
anim = {}

function anim.gen(t, n)
    res = {}
    for _, e in ipairs(t) do
        for i = 1, n do
            table.insert(res, e)
        end
    end
    return res
end


function anim.gen60(t)
    -- #t -- делитель 60
    res = {}
    for _, pict in ipairs(t) do
        for i=1, 60 // (#t) do
            table.insert(res, pict)
        end
    end
    return res
end

return anim
