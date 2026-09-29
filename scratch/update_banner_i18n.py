import os
import re

js_path = r"d:\IK\Savanah seeds\src\js\i18n-translations.js"
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

en_adds = """        bannerText: 'UPAJ dikhao, Inaam Pao!',
"""

hi_adds = """        bannerText: 'उपज दिखाओ, इनाम पाओ!',
"""

pa_adds = """        bannerText: 'ਉਪਜ ਦਿਖਾਓ, ਇਨਾਮ ਪਾਓ!',
"""

# Insert before closing brace of each language object
js = re.sub(r'(en: \{[\s\S]*?)(    \})', r'\1' + en_adds + r'\2', js)
js = re.sub(r'(hi: \{[\s\S]*?)(    \})', r'\1' + hi_adds + r'\2', js)
js = re.sub(r'(pa: \{[\s\S]*?)(    \})', r'\1' + pa_adds + r'\2', js)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Banner translations added successfully.")
