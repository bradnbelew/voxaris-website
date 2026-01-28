from PIL import Image, ImageOps

# Paths
MOCKUP_PATH = "/Users/ethanstop/.gemini/antigravity/brain/7e53898a-9d8f-42e9-bf3a-7f0a2303df13/voxaris_mailer_mockup_1769198506900.png"
QR_PATH = "/Users/ethanstop/.gemini/antigravity/brain/7e53898a-9d8f-42e9-bf3a-7f0a2303df13/voxaris_qr_working.png"
OUTPUT_PATH = "/Users/ethanstop/.gemini/antigravity/brain/7e53898a-9d8f-42e9-bf3a-7f0a2303df13/voxaris_lifestyle_qr.png"

def create_lifestyle_qr():
    try:
        mockup = Image.open(MOCKUP_PATH).convert("RGBA")
        qr = Image.open(QR_PATH).convert("RGBA")
        
        # Resize QR to fit the card area roughly (Trial and error based on generation)
        # Based on visual estimate, the card area is about 300x300 in the center-right
        qr_size = 250
        qr = qr.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
        
        # Slight Rotation to match the card angle (The card in the image is usually tilted)
        # Let's assume a slight counter-clockwise tilt based on typical "table" shots (~15 degrees?)
        # Better: Paste it flat for now to ensure scannability, or rotate slightly.
        # Let's try -10 degrees.
        qr_rotated = qr.rotate(22, expand=True, fillcolor=(0,0,0,0)) # Card seems tilted ~20 deg
        
        # Position manually (Center-Rightish)
        # Mockup size is usually 1024x1024
        # Target area roughly x=500, y=400?
        bg_w, bg_h = mockup.size
        qr_w, qr_h = qr_rotated.size
        
        # Centering logic for the paste
        offset = (int(bg_w * 0.55), int(bg_h * 0.35)) 
        
        mockup.paste(qr_rotated, offset, qr_rotated)
        
        mockup.save(OUTPUT_PATH)
        print(f"Lifestyle QR saved to: {OUTPUT_PATH}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_lifestyle_qr()
