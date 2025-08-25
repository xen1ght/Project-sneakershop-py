from backend import settings



def scan(s, label):
    bad = [ (i, hex(ord(ch))) for i,ch in enumerate(s) if ord(ch) > 127 ]
    print(label, "=", repr(s))
    print("Non-ASCII at:", bad or "None")
    print()



cfg = settings.DATABASES["default"]
for k in ("NAME","USER","PASSWORD","HOST","PORT"):
    scan(str(cfg[k]), k)
