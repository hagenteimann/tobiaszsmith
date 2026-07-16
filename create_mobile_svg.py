import xml.etree.ElementTree as ET

tree = ET.parse('assets/hero/wordmark.svg')
root = tree.getroot()

# The original viewBox is 0 0 1421.13 471.999
root.set('viewBox', '0 0 775 1150')

# Find the group containing the paths
g_icon = None
for g in root.findall('.//{http://www.w3.org/2000/svg}g'):
    if g.get('id') == 'icon-hero-logo-group':
        g_icon = g
        break

paths = list(g_icon)
visuals_paths = paths[0:7]

# Group VISUALS and translate it
g_visuals = ET.Element('{http://www.w3.org/2000/svg}g')
g_visuals.set('transform', 'translate(-647, 600)') # Increased Y offset from 470 to 600
for p in visuals_paths:
    g_icon.remove(p)
    g_visuals.append(p)

g_icon.append(g_visuals)

tree.write('assets/hero/wordmark-mobile.svg')
print("Created wordmark-mobile.svg with larger gap")
