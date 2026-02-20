/**
 * API client for the Alternative Credit Scoring FastAPI backend.
 * Base URL is read from NEXT_PUBLIC_API_URL env var.
 * Defaults to http://localhost:8000 for local development.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000"

export interface TopFactor {
  label: string
  direction: "positive" | "negative"
  impact: number
}

export interface ScoreResult {
  repayment_probability: number
  default_probability: number
  alternative_credit_score: number
  predicted_default: boolean
  risk_band: "Low" | "Medium" | "High"
  top_factors: TopFactor[]
}

export interface ScorePayload {
  profile_type: string
  monthly_income?: number
  income_variance?: number
  savings_balance?: number
  months_active?: number
  total_credits?: number
  total_debits?: number
  total_transactions?: number
  avg_credit_amount?: number
  avg_debit_amount?: number
  recurring_ratio?: number
  gpa?: number
  attendance_rate?: number
  platform_rating?: number
  avg_weekly_hours?: number
  business_years?: number
  avg_daily_revenue?: number
  land_size_acres?: number
  subsidy_amount?: number
  seasonality_index?: number
}

export async function calculateScore(payload: ScorePayload): Promise<ScoreResult> {
  const res = await fetch(`${BASE_URL}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }))
    const detail = err.detail
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((e: any) => e.msg ?? JSON.stringify(e)).join("; ")
          : `API error ${res.status}`
    throw new Error(message)
  }

  return res.json() as Promise<ScoreResult>
}

export interface InsightsPayload {
  score: number
  risk_band: string
  profile_type: string
  top_factors: { label: string; direction: string; impact: number }[]
}

export async function fetchInsights(payload: InsightsPayload): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }))
    const detail = err.detail
    throw new Error(typeof detail === "string" ? detail : "Failed to get insights")
  }

  const data = await res.json()
  return data.insights as string[]
}
