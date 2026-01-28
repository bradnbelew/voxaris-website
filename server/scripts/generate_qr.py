import qrcode
from PIL import Image

# Configuration
URL = "https://voxaris.io"
LOGO_PATH = "/Users/ethanstop/.gemini/antigravity/scratch/voxaris-service-concierge/backend/Hill Nissan AI Agent/_imports/bmi-demo-analysis/src/assets/voxaris-logo.jpg"
OUTPUT_PATH = "/Users/ethanstop/.gemini/antigravity/brain/7e53898a-9d8f-42e9-bf3a-7f0a2303df13/voxaris_qr_working.png"

# Colors
VOXARIS_INK = (5, 17, 20)      # #051114
VOXARIS_GREEN = (0, 224, 143)  # #00E08F
WHITE = (255, 255, 255)

def create_qr():
    # 1. Generate QR Code
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction to allow logo
        box_size=20,
        border=2,
    )
    qr.add_data(URL)
    qr.make(fit=True)

    # Make Image (Ink color data, White background)
    img = qr.make_image(fill_color=VOXARIS_INK, back_color=WHITE).convert('RGB')
    
    # 2. Add Logo (Center)
    try:
        logo = Image.open(LOGO_PATH)
        
        # Calculate dimensions
        img_w, img_h = img.size
        logo_size = int(img_w * 0.25) # Logo is 25% of QR width
        
        # Resize logo
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Create white background for logo (so QR lines don't bleed through)
        logo_bg = Image.new("RGB", (logo_size + 10, logo_size + 10), "white")
        
        # Paste logo onto white bg
        pos_bg = ((img_w - logo_bg.size[0]) // 2, (img_h - logo_bg.size[1]) // 2)
        img.paste(logo_bg, pos_bg)
        
        pos_logo = ((img_w - logo.size[0]) // 2, (img_h - logo.size[1]) // 2)
        img.paste(logo, pos_logo)
        
    except Exception as e:
        print(f"Warning: Could not add logo: {e}")

    # 3. Add "Scan Me" Frame (Optional Style)
    # We'll just save the clean QR for now as it's more versatile for design
    
    img.save(OUTPUT_PATH)
    print(f"QR Code saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    create_qr()
