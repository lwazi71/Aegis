from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
import os
import uuid
from data import process_image

app = Flask(__name__)

# ✅ Enable full CORS support for all routes
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# === File upload setup ===
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# === Preflight OPTIONS route for CORS ===
@app.route('/process', methods=['OPTIONS'])
def options():
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# === Actual image processing route ===
@app.route('/process', methods=['POST'])
def process():
    print("🔥 Received POST request to /process")

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    # Save uploaded image
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    upload_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(upload_path)

    # Get user prompt
    prompt = request.form.get("prompt", "blur out only license plate information from the image. Nothing else")

    # Output path
    processed_filename = f"blurred_{unique_filename}"
    processed_path = os.path.join(PROCESSED_FOLDER, processed_filename)

    # Process the image
    if not process_image(upload_path, processed_path, prompt):
        return jsonify({"error": "Image processing failed."}), 500

    # Return path to processed image
    return jsonify({
        "message": "Image processed successfully.",
        "output_path": f"http://localhost:5100/processed/{processed_filename}"
    })

# === Serve processed image to frontend ===
@app.route('/processed/<filename>')
def serve_processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

# === Ensure every response includes CORS headers ===
@app.after_request
def apply_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

# === Start Flask server ===
if __name__ == '__main__':
    print("🚀 Running Flask backend on http://localhost:5100")
    app.run(host='0.0.0.0', port=5100, debug=True, use_reloader=False)
