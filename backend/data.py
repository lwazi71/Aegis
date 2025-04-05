import cv2
import easyocr
import openai
import os
from dotenv import load_dotenv

load_dotenv()  
openai.api_key = os.getenv("API_KEY")

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
        print("GPT error:", e)
        return False

def process_image(input_path, output_path, prompt="blur out all text."):
    if not os.path.exists(input_path):
        print(f"Image not found: {input_path}")
        return False

    img = cv2.imread(input_path)
    if img is None:
        print("Failed to load image.")
        return False

    reader = easyocr.Reader(['en', 'de', 'es', 'fr', 'la', 'pt', 'tr', 'vi'])
    read_text = reader.readtext(img)

    for bbox, text, score in read_text:

        print(f"OCR found: '{text}' (score {score:.2f})")

        if gpt_should_blur(text, prompt):
            print("GPT says: Blur this.")
            
            x_min = int(min(bbox[0][0], bbox[1][0]))
            y_min = int(min(bbox[0][1], bbox[1][1]))

            x_max = int(max(bbox[2][0], bbox[3][0]))
            y_max = int(max(bbox[2][1], bbox[3][1]))

            crop_area = img[y_min:y_max, x_min:x_max]

            blurred_area = cv2.GaussianBlur(crop_area, (75, 75), 0)
            blurred_area = cv2.GaussianBlur(blurred_area, (75, 75), 0)

            img[y_min:y_max, x_min:x_max] = blurred_area
        else:
            print("GPT says: Leave it.")

    cv2.imwrite(output_path, img)
    print(f"Image processed and saved to {output_path}")
    return True