import os
import re

# Update HTML
html_path = r"d:\IK\Savanah seeds\index.html"
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    (r'<div class="notice-date">Week 4 - Oct 2026</div>', r'<div class="notice-date" data-i18n="week4">Week 4 - Oct 2026</div>'),
    (r'<h3>Gurpreet Singh</h3>', r'<h3 data-i18n="nameGurpreet">Gurpreet Singh</h3>'),
    (r'<p>Ludhiana, Punjab</p>', r'<p data-i18n="locLudhiana">Ludhiana, Punjab</p>'),
    (r'<div class="notice-date">Week 3 - Oct 2026</div>', r'<div class="notice-date" data-i18n="week3">Week 3 - Oct 2026</div>'),
    (r'<h3>Rajesh Kumar</h3>', r'<h3 data-i18n="nameRajesh">Rajesh Kumar</h3>'),
    (r'<p>Karnal, Haryana</p>', r'<p data-i18n="locKarnal">Karnal, Haryana</p>'),
    (r'<div class="notice-date">Week 2 - Sep 2026</div>', r'<div class="notice-date" data-i18n="week2">Week 2 - Sep 2026</div>'),
    (r'<h3>Amandeep Kaur</h3>', r'<h3 data-i18n="nameAmandeep">Amandeep Kaur</h3>'),
    (r'<p>Patiala, Punjab</p>', r'<p data-i18n="locPatiala">Patiala, Punjab</p>')
]

for old, new in replacements:
    html = html.replace(old, new)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# Update JS
js_path = r"d:\IK\Savanah seeds\src\js\i18n-translations.js"
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

en_adds = """        noticeTitle: 'Lucky Draw Winners',
        noticeSubtitle: 'Weekly Announcements',
        week4: 'Week 4 - Oct 2026',
        nameGurpreet: 'Gurpreet Singh',
        locLudhiana: 'Ludhiana, Punjab',
        week3: 'Week 3 - Oct 2026',
        nameRajesh: 'Rajesh Kumar',
        locKarnal: 'Karnal, Haryana',
        week2: 'Week 2 - Sep 2026',
        nameAmandeep: 'Amandeep Kaur',
        locPatiala: 'Patiala, Punjab',
"""

hi_adds = """        noticeTitle: 'लकी ड्रॉ विजेता',
        noticeSubtitle: 'साप्ताहिक घोषणाएं',
        week4: 'सप्ताह 4 - अक्टूबर 2026',
        nameGurpreet: 'गुरप्रीत सिंह',
        locLudhiana: 'लुधियाना, पंजाब',
        week3: 'सप्ताह 3 - अक्टूबर 2026',
        nameRajesh: 'राजेश कुमार',
        locKarnal: 'करनाल, हरियाणा',
        week2: 'सप्ताह 2 - सितंबर 2026',
        nameAmandeep: 'अमनदीप कौर',
        locPatiala: 'पटियाला, पंजाब',
"""

pa_adds = """        noticeTitle: 'ਲੱਕੀ ਡਰਾਅ ਜੇਤੂ',
        noticeSubtitle: 'ਹਫ਼ਤਾਵਾਰੀ ਘੋਸ਼ਣਾਵਾਂ',
        week4: 'ਹਫ਼ਤਾ 4 - ਅਕਤੂਬਰ 2026',
        nameGurpreet: 'ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
        locLudhiana: 'ਲੁਧਿਆਣਾ, ਪੰਜਾਬ',
        week3: 'ਹਫ਼ਤਾ 3 - ਅਕਤੂਬਰ 2026',
        nameRajesh: 'ਰਾਜੇਸ਼ ਕੁਮਾਰ',
        locKarnal: 'ਕਰਨਾਲ, ਹਰਿਆਣਾ',
        week2: 'ਹਫ਼ਤਾ 2 - ਸਤੰਬਰ 2026',
        nameAmandeep: 'ਅਮਨਦੀਪ ਕੌਰ',
        locPatiala: 'ਪਟਿਆਲਾ, ਪੰਜਾਬ',
"""

# Insert before closing brace of each language object
js = re.sub(r'(en: \{[\s\S]*?)(    \})', r'\1' + en_adds + r'\2', js)
js = re.sub(r'(hi: \{[\s\S]*?)(    \})', r'\1' + hi_adds + r'\2', js)
js = re.sub(r'(pa: \{[\s\S]*?)(    \})', r'\1' + pa_adds + r'\2', js)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Translations added successfully.")
