import os
import re

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = re.sub(old, new, content, flags=re.IGNORECASE)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

src_dir = r"d:\IK\Savanah seeds\src"

replacements_html = [
    (r'Show your crop, win a prize!', 'UPAJ dikhao, Inaam Pao!'),
    (r'Campaign: फसल दिखाओ, इनाम पाओ!', 'Campaign: उपज दिखाओ, इनाम पाओ!'),
    (r'फसल के साथ छोटा वीडियो', 'उपज के साथ छोटा वीडियो'),
    (r'#FasalDikhaoInaamPao', '#UpajDikhaoInaamPao'),
    (r'किसान अपनी फसल के साथ', 'किसान अपनी उपज के साथ'),
]

replace_in_file(os.path.join(src_dir, 'components', 'home-page.html'), replacements_html)

replacements_js = [
    (r'#FasalDikhaoInaamPao', '#UpajDikhaoInaamPao'),
    (r'Show your crop, win a prize!', 'UPAJ dikhao, Inaam Pao!'),
    (r'अपनी फसल दिखाएं, इनाम जीतें!', 'उपज दिखाओ, इनाम पाओ!'),
    (r'अपनी फसल के साथ एक वीडियो बनाएं', 'अपनी उपज के साथ एक वीडियो बनाएं'),
    (r'Campaign: फसल दिखाओ, इनाम पाओ!', 'Campaign: उपज दिखाओ, इनाम पाओ!'),
    (r'फसल के साथ छोटा वीडियो', 'उपज के साथ छोटा वीडियो'),
    (r'प्रतिभागी अपनी फसल के साथ', 'प्रतिभागी अपनी उपज के साथ'),
    (r'अपनी फसल दिखाओ, इनाम पाओ!', 'उपज दिखाओ, इनाम पाओ!'),
]

replace_in_file(os.path.join(src_dir, 'js', 'i18n-translations.js'), replacements_js)

replacements_subscribe = [
    (r'#FasalDikhaoInaamPao', '#UpajDikhaoInaamPao')
]
replace_in_file(os.path.join(src_dir, 'js', 'subscribe.js'), replacements_subscribe)

print("Tagline updated everywhere.")
