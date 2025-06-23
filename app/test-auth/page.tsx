"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function TestAuthPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="glass-card p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowSignIn(true)}
            className={`px-4 py-2 rounded ${showSignIn ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setShowSignIn(false)}
            className={`px-4 py-2 rounded ${!showSignIn ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
          >
            Sign Up
          </button>
        </div>
        
        {showSignIn ? (
          <SignIn 
            path="/test-auth" 
            routing="path"
            signUpUrl="/test-auth"
          />
        ) : (
          <SignUp 
            path="/test-auth" 
            routing="path"
            signInUrl="/test-auth"
          />
        )}
      </div>
    </div>
  );
} 