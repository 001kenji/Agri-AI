# 🌾 Agri-AI — Your Smart Agricultural Assistant 🤖🌱

Agri-AI is an intelligent AI assistant built to empower farmers, agricultural researchers, and enthusiasts with real-time insights, guidance, and answers to their questions. It combines cutting-edge technologies in AI, web development, and backend engineering to deliver an interactive, informative experience through a sleek and responsive web interface.

---

## 🚀 Tech Stack

| Layer          | Technology                      |
|----------------|----------------------------------|
| Frontend       | React (Vite), Tailwind CSS       |
| Backend        | Django (Python)                  |
| Database       | PostgreSQL                       |
| Server Render  | Redis                            |
| API Communication | REST (Django REST Framework)  |
| Deployment     | (Optional) Docker / Heroku / Railway |

---

## ✨ Features

- 🧠 AI-powered chatbot for agricultural queries
- 🌍 Context-aware responses and recommendations
- 📈 Real-time response using Redis-based caching
- 📦 Optimized frontend built with Vite + React
- 🎨 TailwindCSS for modern and responsive UI
- 🔐 Secure backend with Django and DRF
- 🗄️ PostgreSQL for relational data storage

---

## ⚙️ Installation

### 🖥 Backend Setup (Django + PostgreSQL)

```bash
# Clone the repository
git clone https://github.com/yourusername/agri-ai.git
cd agri-ai/backend

# Create virtual environment and activate
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup PostgreSQL database
psql -U postgres
CREATE DATABASE agri_ai;
CREATE USER agri_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE agri_ai TO agri_user;

# Run migrations
python manage.py migrate

# Run server
python manage.py runserver
