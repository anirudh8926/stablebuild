"use client";

import { useAppState } from "@/lib/app-context";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    isLoggedIn,
    setIsLoggedIn,
    setCreditScore,
    setRiskBand,
  } = useAppState();

  return (
    <header className="fixed top-4 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 px-4">
      <nav className="flex items-center justify-between rounded-full border border-border bg-card/80 px-6 py-3 shadow-sm backdrop-blur-md">
        <button
          onClick={() => setCurrentPage("landing")}
          className="font-serif text-xl font-bold tracking-tight text-foreground"
        >
          CreditBridge
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <button
            onClick={() => setCurrentPage("landing")}
            className={`text-sm transition-colors hover:text-foreground ${
              currentPage === "landing"
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage("landing")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </button>
          {/* <button
            onClick={() => setCurrentPage("landing")}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </button> */}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={() => setCurrentPage("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setIsLoggedIn(false);
                  setCreditScore(null);
                  setRiskBand(null);
                  setCurrentPage("landing");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setCurrentPage("auth")}
            >
              Log in
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
