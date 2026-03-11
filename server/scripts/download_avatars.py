import os
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base = '/Users/S.A/Desktop/sensivity-calculator'

def dl(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx) as response, open(dest, 'wb') as out_file:
            out_file.write(response.read())
            print("Downloaded", dest)
    except Exception as e:
        print("Failed to download", url, e)

print("Downloading avatars")
dl('https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop', os.path.join(base, 'assets/avatars/avatar-1.jpg'))
dl('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop', os.path.join(base, 'assets/avatars/avatar-2.jpg'))
dl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', os.path.join(base, 'assets/avatars/avatar-3.jpg'))
dl('https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop', os.path.join(base, 'assets/avatars/avatar-4.jpg'))

print("Done")
