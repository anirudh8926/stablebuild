"use client"

import { useState } from "react"
import { useAppState } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthPage() {
  const { setCurrentPage, setIsLoggedIn, setUserName } = useAppState()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = email.split("@")[0] || "User"
    setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    setIsLoggedIn(true)
    setCurrentPage("profile-select")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {isSignUp ? "Create Account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignUp
                ? "Sign up to discover your alternative credit score"
                : "Sign in to access your credit dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border-border bg-background px-4 py-3"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg border-border bg-background px-4 py-3"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full rounded-full bg-foreground py-6 text-base font-medium text-background hover:bg-foreground/90"
            >
              Continue
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
