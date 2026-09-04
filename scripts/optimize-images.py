import os
import glob
from PIL import Image, ImageOps

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_ASSETS = os.path.join(BASE_DIR, "public", "assets")
MENU_DIR = os.path.join(PUBLIC_ASSETS, "menu")
THUMBS_DIR = os.path.join(MENU_DIR, "thumbs")

os.makedirs(THUMBS_DIR, exist_ok=True)

print("=" * 60)
print("Nanaksar Dhaba — Asset Optimization Pipeline")
print("=" * 60)

# 1. Process Menu Dishes
menu_files = glob.glob(os.path.join(MENU_DIR, "*.png"))
print(f"Found {len(menu_files)} menu dish images to process in {MENU_DIR}\n")

menu_stats = []
for file_path in menu_files:
    filename = os.path.basename(file_path)
    stem = os.path.splitext(filename)[0]
    out_webp = os.path.join(MENU_DIR, f"{stem}.webp")
    out_thumb = os.path.join(THUMBS_DIR, f"{stem}.webp")
    
    orig_size_kb = os.path.getsize(file_path) / 1024
    
    with Image.open(file_path) as img:
        img = img.convert("RGBA")
        
        # 1A. Standard Card WebP (Max width 700px, quality 75)
        w, h = img.size
        target_w = min(700, w)
        target_h = int(h * (target_w / w))
        resized_card = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Save WebP card
        resized_card.save(out_webp, "WEBP", quality=75, method=6)
        card_size_kb = os.path.getsize(out_webp) / 1024
        
        # 1B. Square Thumb WebP (120x120 center crop, quality 80)
        # Center-crop to 1:1 square
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        cropped_square = img.crop((left, top, left + min_dim, top + min_dim))
        resized_thumb = cropped_square.resize((120, 120), Image.Resampling.LANCZOS)
        resized_thumb.save(out_thumb, "WEBP", quality=80, method=6)
        thumb_size_kb = os.path.getsize(out_thumb) / 1024
        
        menu_stats.append((filename, orig_size_kb, card_size_kb, thumb_size_kb, (target_w, target_h)))
        print(f"[OK] {stem:32} | Orig: {orig_size_kb:6.1f} KB -> Card: {card_size_kb:5.1f} KB ({target_w}x{target_h}) | Thumb: {thumb_size_kb:4.1f} KB")

# 2. Process Hero Images from BB.png
bb_path = os.path.join(PUBLIC_ASSETS, "BB.png")
if not os.path.exists(bb_path):
    bb_path = os.path.join(BASE_DIR, "src", "assets", "BB.png")

if os.path.exists(bb_path):
    with Image.open(bb_path) as img:
        img = img.convert("RGB")
        
        # 2A. Desktop Hero (1600x900 16:9, quality 80)
        hero_desk = img.resize((1600, 900), Image.Resampling.LANCZOS)
        desk_path = os.path.join(PUBLIC_ASSETS, "hero-desktop.webp")
        hero_desk.save(desk_path, "WEBP", quality=80, method=6)
        print(f"\n[OK] hero-desktop.webp: {os.path.getsize(desk_path)/1024:5.1f} KB (1600x900)")
        
        # 2B. Mobile Hero (768x432 16:9, quality 78)
        hero_mob = img.resize((768, 432), Image.Resampling.LANCZOS)
        mob_path = os.path.join(PUBLIC_ASSETS, "hero-mobile.webp")
        hero_mob.save(mob_path, "WEBP", quality=78, method=6)
        print(f"[OK] hero-mobile.webp:  {os.path.getsize(mob_path)/1024:5.1f} KB (768x432)")

# 3. Process Brand Assets
logo_path = os.path.join(PUBLIC_ASSETS, "Logo.png")
if os.path.exists(logo_path):
    with Image.open(logo_path) as img:
        img_rgba = img.convert("RGBA")
        
        # 3A. Logo 280x280 (Retina 2x for 44px container)
        logo_280 = img_rgba.resize((280, 280), Image.Resampling.LANCZOS)
        logo_out = os.path.join(PUBLIC_ASSETS, "Logo.webp")
        logo_280.save(logo_out, "WEBP", quality=85, method=6)
        print(f"[OK] Logo.webp (280x280): {os.path.getsize(logo_out)/1024:5.1f} KB")
        
        # 3B. Favicon 32x32 PNG
        fav_32 = img_rgba.resize((32, 32), Image.Resampling.LANCZOS)
        fav_path = os.path.join(PUBLIC_ASSETS, "favicon-32x32.png")
        fav_32.save(fav_path, "PNG", optimize=True)
        print(f"[OK] favicon-32x32.png:   {os.path.getsize(fav_path)/1024:5.1f} KB")
        
        # 3C. Apple Touch Icon 180x180 PNG
        apple_180 = img_rgba.resize((180, 180), Image.Resampling.LANCZOS)
        apple_path = os.path.join(PUBLIC_ASSETS, "apple-touch-icon.png")
        apple_180.save(apple_path, "PNG", optimize=True)
        print(f"[OK] apple-touch-icon:   {os.path.getsize(apple_path)/1024:5.1f} KB")

# 3D. Brand Name
brand_path = os.path.join(PUBLIC_ASSETS, "Brand_Name.png")
if os.path.exists(brand_path):
    with Image.open(brand_path) as img:
        img_rgba = img.convert("RGBA")
        w, h = img_rgba.size
        target_w = 480
        target_h = int(h * (target_w / w))
        brand_resized = img_rgba.resize((target_w, target_h), Image.Resampling.LANCZOS)
        brand_out = os.path.join(PUBLIC_ASSETS, "Brand_Name.webp")
        brand_resized.save(brand_out, "WEBP", quality=85, method=6)
        print(f"[OK] Brand_Name.webp:    {os.path.getsize(brand_out)/1024:5.1f} KB ({target_w}x{target_h})")

# 3E. Founder
founder_path = os.path.join(PUBLIC_ASSETS, "Founder.png")
if os.path.exists(founder_path):
    with Image.open(founder_path) as img:
        img_rgba = img.convert("RGBA")
        w, h = img_rgba.size
        target_w = 800
        target_h = int(h * (target_w / w))
        founder_resized = img_rgba.resize((target_w, target_h), Image.Resampling.LANCZOS)
        founder_out = os.path.join(PUBLIC_ASSETS, "Founder.webp")
        founder_resized.save(founder_out, "WEBP", quality=80, method=6)
        print(f"[OK] Founder.webp:       {os.path.getsize(founder_out)/1024:5.1f} KB ({target_w}x{target_h})")

# 3F. OpenGraph Social Share Cover (1200x630 JPEG)
og_src = os.path.join(PUBLIC_ASSETS, "New-Back.png")
if not os.path.exists(og_src):
    og_src = os.path.join(PUBLIC_ASSETS, "BB.png")

if os.path.exists(og_src):
    with Image.open(og_src) as img:
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
        # Target 1200x630 (aspect ratio 1.9047)
        target_aspect = 1200 / 630
        current_aspect = w / h
        if current_aspect > target_aspect:
            # Crop sides
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            cropped = img_rgb.crop((left, 0, left + new_w, h))
        else:
            # Crop top/bottom
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            cropped = img_rgb.crop((0, top, w, top + new_h))
            
        og_img = cropped.resize((1200, 630), Image.Resampling.LANCZOS)
        og_path = os.path.join(PUBLIC_ASSETS, "og-cover.jpg")
        og_img.save(og_path, "JPEG", quality=75, optimize=True)
        print(f"[OK] og-cover.jpg:       {os.path.getsize(og_path)/1024:5.1f} KB (1200x630)")

print("\n" + "=" * 60)
print("Asset Optimization Complete!")
print("=" * 60)
