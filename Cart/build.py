s = ""
while s != "end":
    s = input()
    if not "require" in s:
        print(s)
        continue
    print(f"-- {s[9:-2]}.lua")
    with open(f'{s[9:-2]}.lua', "r") as f:
        print(f.read())
