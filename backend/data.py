import cv2
import easyocr
import matplotlib.pyplot as plt
import openai
import os
from dotenv import load_dotenv

load_dotenv()  # Loads .env from current directory or parent directories
openai.api_key = os.getenv("API_KEY")

# === Function to ask GPT if a piece of text matches the user's prompt ===
def gpt_should_blur(ocr_text, user_prompt):
    try:
        full_prompt = (
            f"The user asked: \"{user_prompt}\".\n"
            f"Does the following text match the type of information they want blurred?\n\n"
            f"Text: \"{ocr_text}\"\n\n"
            f"Respond only with 'Yes' or 'No'."
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": full_prompt}],
            max_tokens=5
        )

        reply = response.choices[0].message.content.strip().lower()
        return reply.startswith("yes")

    except Exception as e:
        print("❌ GPT error:", e)
        return False

# === Main image processor ===
def process_image(image_path=None, prompt="blur out only license plate information from the image. Nothing else"):

    # Update path if passed in via argument
    if image_path is None:
        image_path = "dre_car.jpeg"

    img = cv2.imread(image_path)

    if img is None:
        print("❌ Image not found.")
        return

    reader = easyocr.Reader(['en'])
    text = reader.readtext(img)

    for _, t in enumerate(text):
        bbox, ocr_text, score = t

        if score < 0.2:
            continue

        print(f"🧠 OCR found: '{ocr_text}' (score {score:.2f})")

        if gpt_should_blur(ocr_text, prompt):
            print("🔒 GPT says: Blur this.")

            x_min = int(min(bbox[0][0], bbox[1][0]))
            y_min = int(min(bbox[0][1], bbox[1][1]))
            x_max = int(max(bbox[2][0], bbox[3][0]))
            y_max = int(max(bbox[2][1], bbox[3][1]))

            crop_area = img[y_min:y_max, x_min:x_max]

            blurred_area = cv2.GaussianBlur(crop_area, (75, 75), 0)
            blurred_area = cv2.GaussianBlur(blurred_area, (75, 75), 0)

            img[y_min:y_max, x_min:x_max] = blurred_area
        else:
            print("✅ GPT says: Leave it.")

    # Show result
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.title("Blurred Result")
    plt.axis('off')
    plt.show()

    print("✅ Image processing complete.")

# === Optional endpoint simulation ===
def process_text():
    print(f"Blurred sensitive info:")

# === Run manually for now ===
if __name__ == "__main__":
    process_text()
    process_image()