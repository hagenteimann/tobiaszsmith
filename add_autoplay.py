import glob

files = glob.glob('projekt-*.html') + ['sections/portfolio.html']

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add autoplay to video tags if not present
    # Replace `muted loop playsinline` with `muted loop autoplay playsinline`
    content = content.replace('muted loop playsinline', 'muted loop autoplay playsinline')
    
    # Also replace just in case it's in a different order, though the grep showed they are mostly exactly 'muted loop playsinline'
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Updated video tags with autoplay.")
