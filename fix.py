import glob
import os

replacements = {
    'Ã¼': 'ü',
    'Ã¤': 'ä',
    'Ã¶': 'ö',
    'ÃŸ': 'ß',
    'Ãœ': 'Ü',
    'Ã„': 'Ä',
    'Ã–': 'Ö',
    'â€”': '—',
    'â€“': '–',
    'â€ž': '„',
    'â€œ': '“',
    'Ã…': 'Å',
    'Ã˜': 'Ø',
    'Ã¦': 'æ',
    'Ã¸': 'ø',
    'Ã ': 'à',
    'Ã¡': 'á',
    'Ã¢': 'â',
    'Ã£': 'ã',
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ãª': 'ê',
    'Ã«': 'ë',
    'Ã­': 'í',
    'Ã®': 'î',
    'Ã¯': 'ï',
    'Ã³': 'ó',
    'Ã´': 'ô',
    'Ãµ': 'õ',
    'Ãº': 'ú',
    'Ã¹': 'ù',
    'Ã»': 'û',
    'Ã½': 'ý',
    'Ã¿': 'ÿ'
}

files = glob.glob('*.html') + glob.glob('sections/*.html')
count = 0

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed {filepath}')
            count += 1
    except Exception as e:
        print(f'Error on {filepath}: {e}')

print(f'Fixed {count} files.')
