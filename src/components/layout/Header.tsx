"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, User, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Close the profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileMenuOpen && !target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleSignOut = () => {
    signOut();
    setProfileMenuOpen(false);
  };

  return (
    <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center">
        <Link href="/" className="text-lg font-bold mr-6 hover:opacity-80 transition-opacity">
          AI Teacher
        </Link>
        
      </div>

      <div className="flex items-center space-x-3">
        

        {isLoaded && !isSignedIn ? (
          <div className="flex items-center space-x-2">
            <Link
              href="/auth/sign-in"
              className="text-sm px-3 py-1 rounded-md hover:bg-muted"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="text-sm px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Sign Up
            </Link>
          </div>
        ) : isLoaded && isSignedIn ? (
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="text-sm px-3 py-1 rounded-md hover:bg-muted hidden md:block"
            >
              Dashboard
            </Link>

            <div className="flex items-center space-x-2 relative profile-menu-container">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-expanded={profileMenuOpen ? "true" : "false"}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex cursor-pointer items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-card border border-border z-50">
                  <Link href="/onboarding" className="block px-4 py-2 text-sm hover:bg-muted">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-muted">
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
