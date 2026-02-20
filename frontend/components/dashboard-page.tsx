"use client"

import { useState, useEffect } from "react"
import { useAppState } from "@/lib/app-context"
import { fetchInsights } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TrendingUp, Wallet, Clock, Settings, RefreshCw, Sparkles,
  ArrowUpRight, ArrowDownRight, Target, CheckCircle2
} from "lucide-react"

function ScoreSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-36" />
    </div>
  )
}

/* ── Static tips derived from top factors (always available, no API needed) ── */
const FACTOR_TIPS: Record<string, { positive: string; negative: string }> = {
  "Monthly income": { positive: "Great income level! Keep it steady to maintain your score.", negative: "Try to increase your income through side gigs or upskilling." },
  "Income variance": { positive: "Your income is consistent — lenders love stability.", negative: "High income swings hurt your score. Try to stabilize your earnings." },
  "Savings balance": { positive: "Strong savings! This shows financial discipline.", negative: "Build an emergency fund — even ₹500/month helps your score." },
  "Months of economic activity": { positive: "Long financial history works in your favor.", negative: "Keep your accounts active. Longer history boosts your score." },
  "Income stability": { positive: "Stable income is a strong positive signal.", negative: "Irregular income lowers your score. Seek consistent revenue sources." },
  "Savings-to-income ratio": { positive: "Good savings rate! Keep saving consistently.", negative: "Aim to save at least 10-20% of your income each month." },
  "Liquidity buffer": { positive: "Good emergency buffer! This reduces risk.", negative: "Build a 3-month expense buffer for financial security." },
  "Total credits": { positive: "Healthy credit inflows show strong earning.", negative: "Increase your credit inflows through more revenue channels." },
  "Total debits": { positive: "Controlled spending helps your score.", negative: "Reduce unnecessary spending to improve your financial profile." },
  "Transaction volume": { positive: "Active banking shows financial engagement.", negative: "Use your bank account more regularly — even small transactions help." },
  "Avg credit size": { positive: "Good average credit amounts.", negative: "Larger, consistent credits signal reliability to lenders." },
  "Avg debit size": { positive: "Controlled spending per transaction.", negative: "Avoid large irregular withdrawals — spread expenses evenly." },
  "Recurring payment rate": { positive: "Regular payments show reliability.", negative: "Set up auto-payments for bills to build consistency." },
  "Net cashflow": { positive: "Positive cashflow is a great sign!", negative: "Spend less than you earn to turn your cashflow positive." },
  "Credit-to-debit ratio": { positive: "More money coming in than going out — excellent!", negative: "Aim to keep your credit-debit ratio above 1.0." },
  "GPA": { positive: "Strong academics contribute positively to your profile.", negative: "Improving your GPA can help demonstrate discipline." },
  "Attendance rate": { positive: "Good attendance shows commitment.", negative: "Better attendance can improve your credit profile." },
  "Platform rating": { positive: "High platform ratings boost your score!", negative: "Work on improving your platform ratings for a better score." },
  "Avg weekly hours worked": { positive: "Consistent work hours show dedication.", negative: "More consistent working hours help demonstrate reliability." },
  "Years in business": { positive: "Business longevity shows stability.", negative: "Keep your business active — longevity builds trust." },
  "Avg daily revenue": { positive: "Strong daily revenue is excellent!", negative: "Focus on growing your daily sales for better scores." },
  "Land size (acres)": { positive: "Agricultural assets are a positive indicator.", negative: "Consider expanding or making better use of your land." },
  "Subsidy amount": { positive: "Government subsidies help your financial profile.", negative: "Explore government subsidy programs you may be eligible for." },
  "Seasonality index": { positive: "Well-managed seasonal income.", negative: "Plan for off-seasons — save during peak times." },
  "Missed payment signal": { positive: "No missed payment signals — keep it up!", negative: "Avoid missed payments at all costs — set up reminders or auto-pay." },
}

function getStaticTips(factors: { label: string; direction: string }[]): { label: string; tip: string; isPositive: boolean }[] {
  return factors.map(f => {
    const entry = FACTOR_TIPS[f.label]
    const isPositive = f.direction === "positive"
    return {
      label: f.label,
      tip: entry
        ? (isPositive ? entry.positive : entry.negative)
        : isPositive
          ? `${f.label} is helping your score — keep it up!`
          : `Improving your ${f.label.toLowerCase()} could boost your score.`,
      isPositive,
    }
  })
}

export function DashboardPage() {
  const { userName, creditScore, riskBand, topFactors, formData, scoreHistory, setCurrentPage } = useAppState()
  const [isLoading, setIsLoading] = useState(true)
  const [insights, setInsights] = useState<string[]>([])
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const loadInsights = async () => {
    if (!creditScore || !riskBand) return
    setInsightsLoading(true)
    setInsightsError(null)
    try {
      const profileMap: Record<string, string> = {
        "gig-worker": "gig", student: "student",
        shopkeeper: "shopkeeper", rural: "rural", salaried: "salaried",
      }
      const tips = await fetchInsights({
        score: creditScore,
        risk_band: riskBand,
        profile_type: profileMap[formData.profileType] ?? "salaried",
        top_factors: topFactors.map(f => ({
          label: f.label, direction: f.direction, impact: f.impact,
        })),
      })
      setInsights(tips)
    } catch (err) {
      setInsightsError(err instanceof Error ? err.message : "Failed to load insights")
    } finally {
      setInsightsLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading && creditScore && riskBand) {
      loadInsights()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, creditScore, riskBand])

  const bandColor =
    riskBand === "Low"
      ? "bg-emerald-100 text-emerald-800"
      : riskBand === "Medium"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800"

  const stability = parseFloat(formData.incomeStability) || null
  const savingsBalance = parseFloat(formData.savingsBalance) || null
  const monthsActive = parseFloat(formData.monthsActive) || null

  const stats = [
    {
      icon: TrendingUp,
      label: "Income Stability",
      value: stability != null ? `${Math.round(stability * 100)}%` : "---",
    },
    {
      icon: Wallet,
      label: "Savings Balance",
      value: savingsBalance != null ? `₹${savingsBalance.toLocaleString("en-IN")}` : "---",
    },
    {
      icon: Clock,
      label: "Economic Activity",
      value: monthsActive != null ? `${monthsActive} mo` : "---",
    },
  ]

  const staticTips = getStaticTips(topFactors)

  return (
    <main className="min-h-screen px-4 pb-20 pt-28">
      <div className="mx-auto max-w-3xl">
        {/* Top Bar */}
        <div className="mb-10 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              Welcome back, {userName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here is your credit score overview.
            </p>
          </div>
        </div>

        {/* Main Score Display */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-10 text-center shadow-sm animate-scale-in">
          {isLoading ? (
            <ScoreSkeleton />
          ) : (
            <>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Your Alternative Credit Score
              </p>
              <div className="mt-6 flex items-center justify-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5 animate-shimmer-glow transition-transform duration-500 hover:scale-105">
                  <span className="font-serif text-6xl font-bold text-foreground">
                    {creditScore ?? "---"}
                  </span>
                </div>
              </div>
              {riskBand && (
                <div className="mt-6">
                  <Badge className={`rounded-full px-4 py-1 text-sm font-medium transition-transform duration-200 hover:scale-105 ${bandColor}`}>
                    {riskBand} Risk
                  </Badge>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`animate-slide-up rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md stagger-${index + 1}`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="mt-1">
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Score Improvement Section ── */}
        {!isLoading && topFactors.length > 0 && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up stagger-1">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Score Breakdown & How to Improve
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {staticTips.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:translate-x-1 ${item.isPositive
                      ? "bg-emerald-50 border border-emerald-100"
                      : "bg-amber-50 border border-amber-100"
                    }`}
                >
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.isPositive ? "bg-emerald-100" : "bg-amber-100"
                    }`}>
                    {item.isPositive
                      ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                      : <ArrowDownRight className="h-3.5 w-3.5 text-amber-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.isPositive ? "text-emerald-800" : "text-amber-800"
                      }`}>
                      {item.label}
                      <span className={`ml-2 text-xs font-normal ${item.isPositive ? "text-emerald-600" : "text-amber-600"
                        }`}>
                        {item.isPositive ? "Helping your score" : "Needs improvement"}
                      </span>
                    </p>
                    <p className={`mt-0.5 text-sm ${item.isPositive ? "text-emerald-700" : "text-amber-700"
                      }`}>
                      {item.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI-Powered Personalized Tips ── */}
        {!isLoading && creditScore && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up stagger-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  AI-Powered Tips
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={loadInsights}
                disabled={insightsLoading}
              >
                <RefreshCw className={`mr-1 h-3 w-3 ${insightsLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {insightsLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 px-4 py-3">
                    <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="mt-1 h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : insightsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-sm font-medium text-red-700">⚠️ Could not load AI tips</p>
                <p className="mt-1 text-xs text-red-600">{insightsError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs border-red-200 text-red-700 hover:bg-red-100"
                  onClick={loadInsights}
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Try Again
                </Button>
              </div>
            ) : insights.length > 0 ? (
              <div className="flex flex-col gap-3">
                {insights.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-secondary/50 px-4 py-3 transition-all duration-200 hover:bg-secondary/80"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-100 text-xs font-bold text-amber-700">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Click refresh to generate personalized AI tips.
              </p>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Powered by Google Gemini · Personalized to your {formData.profileType} profile
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mb-8">
          <Button
            variant="outline"
            className="w-full rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm active:scale-[0.99]"
            onClick={() => setCurrentPage("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Edit Account Settings
          </Button>
        </div>

        {/* Score History */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Score History
          </h2>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : scoreHistory.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No score history available yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {scoreHistory.slice(0, 5).map((entry, index) => {
                const entryBandColor =
                  entry.riskBand === "Low"
                    ? "bg-emerald-100 text-emerald-800"
                    : entry.riskBand === "Medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-secondary/50 px-5 py-3 transition-all duration-200 hover:bg-secondary/80"
                  >
                    <span className="text-sm text-muted-foreground">{entry.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{entry.score}</span>
                      <Badge className={`rounded-full px-3 py-0.5 text-xs font-medium ${entryBandColor}`}>
                        {entry.riskBand}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
