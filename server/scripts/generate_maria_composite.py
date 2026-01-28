import cv2
from PIL import Image, ImageOps
import numpy as np

# Paths
VIDEO_PATH = "/Users/ethanstop/.gemini/antigravity/brain/7e53898a-9d8f-42e9-bf3a-7f0a2303df13/tavus_demo_video.mp4"
BASE_IMG_PATH = "/Users/ethanstop/.gemini/antigravity/brain/7e53898a-9d8f-42e9-bf3a-7f0a2303df13/voxaris_maria_base_1769201585157.png"
OUTPUT_PATH = "/Users/ethanstop/.gemini/antigravity/brain/7e53898a-9d8f-42e9-bf3a-7f0a2303df13/voxaris_maria_hero_final.png"

def create_composite():
    print("Extracting frame...")
    # 1. Extract Frame using OpenCV
    cap = cv2.VideoCapture(VIDEO_PATH)
    # Set position to 2 seconds
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.set(cv2.CAP_PROP_POS_FRAMES, fps * 2)
    success, frame = cap.read()
    
    if not success:
        print("Failed to read video frame")
        return

    # Convert BGR to RGB (OpenCV uses BGR)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    maria_img = Image.fromarray(frame_rgb)
    
    # Crop Maria to be vertical (Portrait mode for phone)
    # The video is likely landscape 16:9? Or portrait?
    # Usually Tavus videos form the preview are landscape. We need a center crop.
    w, h = maria_img.size
    target_ratio = 9/16 # Phone screen ratio
    
    # Center crop logic
    new_w = h * (9/16)
    left = (w - new_w) / 2
    top = 0
    right = (w + new_w) / 2
    bottom = h
    
    maria_cropped = maria_img.crop((left, top, right, bottom))
    
    # 2. Overlay onto Base Image
    base_img = Image.open(BASE_IMG_PATH).convert("RGBA")
    
    # Based on the generated image `voxaris_maria_base`:
    # It is a flat lay. The phone is in the center.
    # I need to estimate the screen coordinates. 
    # Usually in a 1024x1024 flat lay with a phone in center:
    # Screen is roughly central. Let's assume a generic size and position unless I detect it.
    # Trial and error: Center paste with a bit of padding.
    
    bg_w, bg_h = base_img.size
    
    # Determine sizing
    # Phone screen in a flat lay is approx 30% width of the full image?
    screen_w = int(bg_w * 0.28)
    screen_h = int(screen_w * (16/9))
    
    maria_resized = maria_cropped.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
    
    # Paste Center
    # Adjust offsets slightly if needed based on the image "phone is lying in the center"
    offset_x = (bg_w - screen_w) // 2
    offset_y = (bg_h - screen_h) // 2
    
    # Add rounded corners to look like a screen?
    # Simple mask
    mask = Image.new("L", (screen_w, screen_h), 0)
    import PIL.ImageDraw as ImageDraw
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, screen_w, screen_h), radius=20, fill=255)
    
    # Composite
    base_img.paste(maria_resized, (offset_x, offset_y), mask)
    
    # Save
    base_img.save(OUTPUT_PATH)
    print(f"Composite saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    create_composite()
