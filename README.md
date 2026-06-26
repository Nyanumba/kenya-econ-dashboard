
# 🇰🇪 Kenya Economic Dashboard

A full-stack data analytics dashboard visualizing Kenya's key economic indicators using live data from the **World Bank Open Data API**.

![Stack](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![Stack](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Stack](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Stack](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## 📊 Indicators Tracked

| Indicator | World Bank Code | Unit |
|---|---|---|
| GDP Growth | `NY.GDP.MKTP.KD.ZG` | Annual % |
| Inflation (CPI) | `FP.CPI.TOTL.ZG` | Annual % |
| Unemployment Rate | `SL.UEM.TOTL.ZS` | % of total labor force |

---

## 🏗️ Architecture

```
World Bank API
      │
      ▼
  FastAPI backend  ──►  PostgreSQL (cache)
      │
      ▼
  React frontend (Recharts)
```

- **Backend:** FastAPI + pandas + SQLAlchemy — fetches live from World Bank, caches in PostgreSQL
- **Frontend:** React + Recharts — line charts, stat cards, year range selector
- **Deploy:** Render (backend + frontend as separate services)

---

## 🚀 Running Locally

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for frontend dev)
- Python 3.11+ (for backend dev)

### With Docker (recommended)

```bash
git clone https://github.com/Nyanumba/kenya-econ-dashboard.git
cd kenya-econ-dashboard
docker-compose up --build
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:8000
- API Docs → http://localhost:8000/docs

### Without Docker

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set your DATABASE_URL
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/indicators` | List all available indicators |
| `GET` | `/api/indicators/{code}` | Fetch single indicator data |
| `GET` | `/api/dashboard` | All three indicators in one call |
| `GET` | `/api/health` | Health check |

**Query params:** `start_year` (default: 2000), `end_year` (default: 2023)

Example:
```
GET /api/dashboard?start_year=2010&end_year=2023
```

---

## 🚢 Deploying to Render

1. Push to GitHub
2. Create a **PostgreSQL** database on Render — copy the connection string
3. Deploy backend as a **Web Service:**
   - Root dir: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Env var: `DATABASE_URL=<your-render-postgres-url>`
4. Deploy frontend as a **Static Site:**
   - Root dir: `frontend`
   - Build: `npm install && npm run build`
   - Publish dir: `build`
   - Env var: `REACT_APP_API_URL=<your-backend-render-url>`

---

## 📁 Project Structure

```
kenya-econ-dashboard/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── worldbank.py     # World Bank API client + pandas transforms
│   ├── models.py        # SQLAlchemy ORM models
│   ├── database.py      # DB connection
│   ├── schemas.py       # Pydantic response schemas
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/client.js
│   │   └── components/
│   │       ├── StatCard.jsx
│   │       ├── IndicatorChart.jsx
│   │       └── YearRangeSelector.jsx
│   ├── public/index.html
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 📄 License

MIT
