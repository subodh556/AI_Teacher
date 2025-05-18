"use client";

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function NavLinks() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-4 p-2 bg-background/80 backdrop-blur-sm rounded-lg shadow-sm">
      <Link
        href="/"
        className="px-3 py-1 text-sm rounded-md hover:bg-muted"
      >
        Home
      </Link>

      {isLoaded && !isSignedIn && (
        <>
          <Link
            href="/auth/sign-in"
            className="px-3 py-1 text-sm rounded-md hover:bg-muted"
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-3 py-1 text-sm rounded-md hover:bg-muted"
          >
            Sign Up
          </Link>
        </>
      )}

      {isLoaded && isSignedIn && (
        <>
          <Link
            href="/dashboard"
            className="px-3 py-1 text-sm rounded-md hover:bg-muted"
          >
            Dashboard
          </Link>
          <Link
            href="/onboarding"
            className="px-3 py-1 text-sm rounded-md hover:bg-muted"
          >
            Profile
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="px-3 py-1 text-sm rounded-md hover:bg-muted"
          >
            Sign Out
          </Button>
        </>
      )}
    </div>
  );
}
