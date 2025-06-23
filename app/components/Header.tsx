"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Heart, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Animated3DBackground } from "@/components/ui/animated-3d-background";

export function Header() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/pods", label: "Pods" },
    { href: "/connections", label: "Connections" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <Animated3DBackground intensity={0.2} />
      <header className="w-full z-50 sticky top-0 bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-lg border-b border-white/20 animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Amor Fly
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div
                  key={item.href}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link 
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
              
              {/* Dashboard Button - Only show when signed in */}
              {isSignedIn && (
                <div className="animate-fade-in" style={{ animationDelay: `${navItems.length * 100}ms` }}>
                  <Link href="/dashboard">
                    <Button 
                      variant="ghost" 
                      className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-200"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              {!isLoaded ? (
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse" />
              ) : isSignedIn ? (
                <div className="animate-fade-in-scale">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonPopoverCard: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20",
                        userButtonPopoverActionButton: "hover:bg-pink-50 dark:hover:bg-pink-900/20"
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform duration-200"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 animate-slide-down">
              <div className="flex flex-col space-y-4 pt-4">
                {navItems.map((item, index) => (
                  <div
                    key={item.href}
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 font-medium"
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
                
                {/* Dashboard Button in Mobile Menu - Only show when signed in */}
                {isSignedIn && (
                  <div
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${navItems.length * 100}ms` }}
                  >
                    <Link 
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </div>
                )}
                
                {!isSignedIn && (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                    <SignInButton mode="modal">
                      <Button 
                        variant="ghost" 
                        className="w-full text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
} 