"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { TopFactor } from "@/lib/api"

export interface UserFormData {
  fullName: string
  profileType: "student" | "gig-worker" | "shopkeeper" | "rural" | ""
  monthlyIncome: string
  incomeStability: string
  savingsBalance: string
  monthsActive: string
  // Student
  universityName: string
  gpa: string
  yearOfStudy: string
  scholarship: boolean
  attendanceRate: string
  // Gig Worker
  platformName: string
  platformRating: string
  avgWeeklyHours: string
  // Shopkeeper
  shopName: string
  businessYears: string
  gstRegistered: boolean
  avgDailyRevenue: string
  // Rural Individual
  occupation: string
  landSize: string
  cropType: string
  subsidyAmount: string
  seasonalityIndex: string
}

export interface ScoreEntry {
  date: string
  score: number
  riskBand: "Low" | "Medium" | "High"
}

export interface AppState {
  currentPage: string
  setCurrentPage: (page: string) => void
  isLoggedIn: boolean
  setIsLoggedIn: (loggedIn: boolean) => void
  userName: string
  setUserName: (name: string) => void
  formData: UserFormData
  setFormData: (data: UserFormData) => void
  creditScore: number | null
  setCreditScore: (score: number | null) => void
  riskBand: "Low" | "Medium" | "High" | null
  setRiskBand: (band: "Low" | "Medium" | "High" | null) => void
  scoreHistory: ScoreEntry[]
  setScoreHistory: (history: ScoreEntry[]) => void
  topFactors: TopFactor[]
  setTopFactors: (factors: TopFactor[]) => void
  users?: unknown[]
}

const defaultFormData: UserFormData = {
  fullName: "",
  profileType: "",
  monthlyIncome: "",
  incomeStability: "",
  savingsBalance: "",
  monthsActive: "",
  universityName: "",
  gpa: "",
  yearOfStudy: "",
  scholarship: false,
  attendanceRate: "",
  platformName: "",
  platformRating: "",
  avgWeeklyHours: "",
  shopName: "",
  businessYears: "",
  gstRegistered: false,
  avgDailyRevenue: "",
  occupation: "",
  landSize: "",
  cropType: "",
  subsidyAmount: "",
  seasonalityIndex: "",
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState("landing")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [formData, setFormData] = useState<UserFormData>(defaultFormData)
  const [creditScore, setCreditScore] = useState<number | null>(null)
  const [riskBand, setRiskBand] = useState<"Low" | "Medium" | "High" | null>(null)
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([])
  const [topFactors, setTopFactors] = useState<TopFactor[]>([])

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isLoggedIn,
        setIsLoggedIn,
        userName,
        setUserName,
        formData,
        setFormData,
        creditScore,
        setCreditScore,
        riskBand,
        setRiskBand,
        scoreHistory,
        setScoreHistory,
        topFactors,
        setTopFactors,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppProvider")
  }
  return context
}
