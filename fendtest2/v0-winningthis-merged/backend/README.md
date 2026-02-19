# Alternative Credit Scoring API

A FastAPI backend that scores underbanked borrowers across 5 profiles using a calibrated logistic regression model. Returns a credit score (300–900), risk band, and top scoring factors.

---

## Setup

```bash
cd app
pip install -r requirements.txt
python train_model.py        # generates credit_model.pkl (first run only)
uvicorn main:app --reload    # start dev server on http://localhost:8000
```

Swagger docs: **http://localhost:8000/docs**

---

## Configuration

Copy `.env.example` → `.env` and fill in your values. The app loads `.env` automatically.

| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOWED_ORIGINS` | `*` | Comma-separated CORS origins. Set to your webapp URL in production. |
| `MODEL_PATH` | `./credit_model.pkl` | Override path to the model file. |

---

## Endpoints

### `POST /score` — Primary webapp endpoint

Send raw form fields. Profile flags are derived automatically.

**Request**
```json
{
  "profile_type": "gig",
  "monthly_income": 0,
  "income_variance": 800,
  "savings_balance": 12000,
  "months_active": 18,
  "total_credits": 45000,
  "total_debits": 30000,
  "total_transactions": 200,
  "avg_credit_amount": 600,
  "avg_debit_amount": 400,
  "recurring_ratio": 0.3,
  "platform_rating": 4.2,
  "avg_weekly_hours": 35
}
```

**Response**
```json
{
  "repayment_probability": 0.812,
  "default_probability": 0.188,
  "alternative_credit_score": 787,
  "predicted_default": false,
  "risk_band": "Low",
  "top_factors": [
    { "label": "Income stability",        "direction": "positive", "impact": 0.42 },
    { "label": "Savings-to-income ratio", "direction": "positive", "impact": 0.31 },
    { "label": "Missed payment signal",   "direction": "negative", "impact": 0.18 },
    { "label": "Platform rating",         "direction": "positive", "impact": 0.14 },
    { "label": "Net cashflow",            "direction": "positive", "impact": 0.09 }
  ]
}
```

---

### `POST /score/batch` — Bulk scoring (up to 50 borrowers)

```json
{
  "borrowers": [
    { "profile_type": "salaried", "monthly_income": 8000, ... },
    { "profile_type": "student",  "gpa": 3.7, "attendance_rate": 0.9, ... }
  ]
}
```

---

### `GET /health`

```json
{ "status": "ok", "model_loaded": true, "version": "6.0.0" }
```

---

### `POST /predict` *(legacy)*

Accepts pre-computed `f_*` columns directly. Use `POST /score` for all new integrations.

---

## Profile Field Reference

| Field | Profiles | Type | Range |
|-------|----------|------|-------|
| `profile_type` | all | string | `salaried\|student\|gig\|shopkeeper\|rural` |
| `monthly_income` | all | float | ≥ 0 (₹) |
| `income_variance` | all | float | ≥ 0 (lower = stable) |
| `savings_balance` | all | float | ≥ 0 (₹) |
| `months_active` | all | float | ≥ 0 |
| `total_credits` | all | float | ≥ 0 (₹) |
| `total_debits` | all | float | ≥ 0 (₹) |
| `total_transactions` | all | float | ≥ 0 |
| `avg_credit_amount` | all | float | ≥ 0 (₹) |
| `avg_debit_amount` | all | float | ≥ 0 (₹) |
| `recurring_ratio` | all | float | 0–1 |
| `gpa` | student | float | 0–4 |
| `attendance_rate` | student | float | 0–1 |
| `platform_rating` | gig | float | 0–5 |
| `avg_weekly_hours` | gig | float | ≥ 0 |
| `business_years` | shopkeeper | float | ≥ 0 |
| `avg_daily_revenue` | shopkeeper | float | ≥ 0 (₹) |
| `land_size_acres` | rural | float | ≥ 0 |
| `subsidy_amount` | rural | float | ≥ 0 (₹) |
| `seasonality_index` | rural | float | 0–1 |

Profile-specific fields default to `0` when omitted — safe to leave out fields irrelevant to the borrower's profile.

---

## Score & Risk Band Mapping

| Score | Risk Band | P(default) |
|-------|-----------|------------|
| 720–900 | Low | < 30% |
| 540–719 | Medium | 30–55% |
| 300–539 | High | > 55% |

Decision threshold varies by profile (student/rural: 0.35; others: 0.40).

---

## Deployment

Deploy to **Render / Railway / Heroku** — the `Procfile` is included.

Set the following environment variables on your platform:
- `ALLOWED_ORIGINS=https://your-webapp.vercel.app`
- `MODEL_PATH` *(optional — defaults to `./credit_model.pkl`)*

> **Note:** `credit_model.pkl` and `training_data.csv` are git-ignored.  
> Add a build step to regenerate the model: `python app/train_model.py`
