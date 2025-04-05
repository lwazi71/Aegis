from flask import Flask, request, jsonify, send_file
import os, uuid
from data import process_image

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/process', methods=['POST'])
def process():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    # Generate a unique filename to avoid conflicts
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    upload_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(upload_path)

    # Get the prompt from the form (or use default)
    prompt = request.form.get("prompt", "blur out only license plate information from the image. Nothing else")

    processed_filename = f"blurred_{unique_filename}"
    processed_path = os.path.join(PROCESSED_FOLDER, processed_filename)

    if not process_image(upload_path, processed_path, prompt):
        return jsonify({"error": "Image processing failed."}), 500

    # Option 1: Send the processed image file directly
    return send_file(processed_path, mimetype='image/png', as_attachment=True, download_name=processed_filename)

    # Option 2: Return JSON with the output path (if frontend can access that URL)
    # return jsonify({
    #     "message": "Image processed successfully.",
    #     "output_path": processed_path
    # })

if __name__ == '__main__':
    app.run(debug=True)