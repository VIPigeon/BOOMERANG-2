Time = {}

local time_passed = 0
local delta_time = 0

function Time.update()
    local time = time()
    delta_time = time - time_passed
    time_passed = time
end

function Time.dt()
    return delta_time
end

return Time
