from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import uuid
import re
from data import process_image

app = Flask(__name__)
# === PostgreSQL Connection (GCP Cloud SQL) ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://aegisadmin:coughacks@34.169.11.69:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# === User Model ===
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

# ✅ Enable full CORS support for all routes
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# === File upload setup ===
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# === Preflight OPTIONS routes for CORS ===
@app.route('/process', methods=['OPTIONS'])
def options():
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.route('/verify', methods=['OPTIONS'])
def verify_options():
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
        "status": "processing",
        "message": "Image processed successfully.",
        "output_path": f"http://localhost:5100/processed/{processed_filename}"
    }), 202

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

# === User verification + creation endpoint ===
@app.route('/verify', methods=['POST'])
def verify_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password too short"}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        if check_password_hash(user.password_hash, password):
            return jsonify({"message": "✅ User verified and exists in DB"})
        else:
            return jsonify({"error": "❌ Incorrect password"}), 401
    else:
        hashed_pw = generate_password_hash(password)
        new_user = User(email=email, password_hash=hashed_pw)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "✅ User did not exist, created successfully"})

# === Ensure tables exist before server starts ===
with app.app_context():
    db.create_all()

# === Start Flask server ===
if __name__ == '__main__':
    print("🚀 Running Flask backend on http://localhost:5100")
    app.run(host='0.0.0.0', port=5100, debug=True, use_reloader=False)