Time = {
    t = 0,
    delta = 0,
}

function Time.update()
    local time = time()
    Time.delta = time - Time.t
    Time.t = time
end

function Time.dt()
    return Time.delta
end
