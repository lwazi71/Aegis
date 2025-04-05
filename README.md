![image](https://github.com/user-attachments/assets/1f127bd1-baed-4ba2-a3cb-c8611513f760)# Aegis – CougHacks 2025 Project  

## By Duy Ly, Lwazi Mobata, Yusuf Shakhpaz, Murad Tair, Bhavneet Bhargava, and Alex Douk.

## The Prompt

**Theme:** *Privacy and Online Presence*  
Nowadays, security and privacy have become one of the most significant issues in our daily lives.  
>  
We were challenged to create a solution that helps safeguard digital identity — exploring the intersection between privacy, personal data, and online expression.

**Bonus Challenge:** *Hobbies and Interests*  
How can we share what we love without giving away too much?

---

## The Issue

Social media platforms and websites collect a **massive amount of personal and sensitive data**, often without users fully realizing it. This includes:

- 🎂 Name, birthday, gender, contact info  
- 🌍 Location and check-in data  
- 🧠 Attitudinal + behavioral patterns (likes, comments, interactions)  
- 🙏 Beliefs, preferences, opinions  
- 📸 Shared content, images, and videos

This data is sold to advertisers, but it's also exploited by **scammers and fraudsters**:

> 💸 *The FTC reported [$2.7 billion in social media fraud losses in 2021](https://www.techtarget.com/whatis/feature/6-common-social-media-privacy-issues) — the highest of any contact method.*

Even private accounts aren't truly private, and most users lack tools to **understand what they're exposing.**

---

## Our Solution: Aegis

We created **Aegis** — a privacy tool that empowers users to analyze and redact sensitive content before it's shared.

**What Aegis Does:**

- Upload images or documents for analysis
- AI (GPT-4 + OCR) scans for:
  - Faces
  - Text (names, IDs, emails, etc.)
  - Personal identifiers
- Automatically **blur or remove** exposed content
- Get an **Insights dashboard** showing:
  - What was flagged
  - How many changes were made
  - Your full usage history

---

**Why It Matters:**

Aegis gives users visibility into their digital footprint before it becomes public.  
It bridges the gap between **self-expression** and **data control**, allowing users to stay safe while staying social.

---

### 💡 How It Works

1. **Upload a file** (image or document)
2. **Choose a prompt** (e.g. “blur license plates”)
3. Aegis:
   - Extracts content using OCR
   - Asks GPT-4 what to blur
   - Applies redaction locally via OpenCV
4. View changes + review logs in your **Insights tab**

---
### Building

---

### 🧪 Features

- ✅ User login + data persistence
- 📸 Before/After image preview
- 🧠 GPT-4 powered text reasoning
- 🧾 Insights dashboard with usage stats
- 🗂️ User-specific activity history (WIP)

---

### 🛠️ Tech Stack

| Frontend   | Backend    | AI/ML        | DB / Storage      |
|------------|------------|--------------|-------------------|
| React + Bootstrap | Flask + SQLAlchemy | GPT-4 + EasyOCR | PostgreSQL + Local File Storage |

---

### 🚀 How to Run Locally

**Backend (Flask):**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

**Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```
