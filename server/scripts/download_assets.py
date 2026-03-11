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

print("Downloading images")
dl('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop', os.path.join(base, 'assets/images/video-guide.jpg'))
dl('https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop', os.path.join(base, 'assets/images/featured-clip.jpg'))
dl('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop', os.path.join(base, 'assets/images/og-image.jpg'))

print("Downloading FontAwesome")
dl('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', os.path.join(base, 'assets/fontawesome/css/all.min.css'))

fonts = ['fa-solid-900', 'fa-regular-400', 'fa-brands-400', 'fa-v4compat']
exts = ['woff2', 'woff', 'ttf']
for f in fonts:
    for e in exts:
        dl(f'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/{f}.{e}', os.path.join(base, f'assets/fontawesome/webfonts/{f}.{e}'))

print("Updating HTML files")
for file in os.listdir(base):
    if file.endswith('.html'):
        p = os.path.join(base, file)
        with open(p, 'r') as f:
            content = f.read()
        content = content.replace('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', 'assets/fontawesome/css/all.min.css')
        with open(p, 'w') as f:
            f.write(content)

print("Done")
