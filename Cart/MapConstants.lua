MC = {
-- (0 o 0) Use a function for this later
-- Turned off wire id --> Turned on wire id
turnedOffWires = {
    [146] = 146 + 32,
    [147] = 147 + 32,
    [148] = 148 + 32,
    [146 + 16] = 146 + 16 + 32,
    [147 + 16] = 147 + 16 + 32,
    [148 + 16] = 148 + 16 + 32,
},
-- Later generate this??
-- Turned on wire id --> Turned off wire id
turnedOnWires = {
    [146 + 32] = 146,
    [147 + 32] = 147,
    [148 + 32] = 148,
    [146 + 16 + 32] = 146 + 16,
    [147 + 16 + 32] = 147 + 16,
    [148 + 16 + 32] = 148 + 16,
}
}

return MC
