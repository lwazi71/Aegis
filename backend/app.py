from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import uuid
import re
from data import process_image
from sqlalchemy import inspect
app = Flask(__name__)

# === PostgreSQL Connection (GCP Cloud SQL) ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://aegisadmin:coughacks@34.169.11.69:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# === User Model ===
class User(db.Model):
    __tablename__ = 'master_users'
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20))
    posts = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ✅ Enable full CORS support
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# === File upload folders ===
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

# === Image processing route ===
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

    # Get prompt
    prompt = request.form.get("prompt", "blur out only license plate information from the image. Nothing else")

    # Output path
    processed_filename = f"blurred_{unique_filename}"
    processed_path = os.path.join(PROCESSED_FOLDER, processed_filename)

    # Process image
    if not process_image(upload_path, processed_path, prompt):
        return jsonify({"error": "Image processing failed."}), 500

    return jsonify({
        "message": "Image processed successfully.",
        "output_path": f"http://localhost:5100/processed/{processed_filename}"
    })

# === Serve processed image to frontend ===
@app.route('/processed/<filename>')
def serve_processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

# === CORS headers on all responses ===
@app.after_request
def apply_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

# === User verification & creation ===
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

with app.app_context():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    if 'master_users' not in tables:
        print("⛏️ Creating 'master_users' table in DB...")
        db.create_all()
    else:
        print("✅ 'master_users' table already exists.")
# === Start Flask server ===
if __name__ == '__main__':
    print("🚀 Running Flask backend on http://localhost:5100")
    app.run(host='0.0.0.0', port=5100, debug=True, use_reloader=False)