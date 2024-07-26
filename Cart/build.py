s = ""

print('-- title:  BOOMERANG 2: RETURN')
print('-- author: V. Crocodile')
print('-- desc:   A little game about killing flowers.')
print('-- script: lua')

while s != "end":
    s = input()
    if not "require" in s:
        print(s)
        continue
    print(f"-- {s[9:-2]}.lua")
    with open(f'{s[9:-2]}.lua', "r") as f:
        print(f.read())
