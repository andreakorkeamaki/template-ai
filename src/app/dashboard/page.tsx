"use client";

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '../../lib/contexts/AuthContext'; // Adjusted path

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // Combined useEffect for auth state management
  useEffect(() => {
    // Case 1: AuthContext itself is not yet available (e.g., provider hasn't mounted or passed value)
    if (authContext === undefined) {
      console.log("Dashboard: AuthContext is undefined. Waiting for provider.");
      return; // Do nothing until context is defined
    }

    // Case 2: AuthContext provider explicitly passed null (e.g., error during its own init, or deliberate unauthenticated state)
    if (authContext === null) {
      console.error("Dashboard: AuthContext is null. Redirecting to /.");
      router.push('/');
      return;
    }

    // Case 3: AuthContext is an object, proceed to check user and loading state
    const { user, loading } = authContext; // user and loading are scoped to this effect
    if (!loading && !user) {
      console.log("Dashboard: Not loading and no user. Redirecting to /.");
      router.push('/');
    }
  }, [authContext, router]);

  // Rendering logic after all hooks
  // First, handle cases where authContext itself is not ready
  if (authContext === undefined) {
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-neutral-700">Initializing authentication...</p>
      </div>
    );
  }

  if (authContext === null) {
    // This state implies an issue with the AuthProvider or a deliberate 'logged out' state passed as null.
    // The useEffect should handle redirection. This UI is a fallback.
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-red-500">Authentication context error. Redirecting...</p>
      </div>
    );
  }

  // If authContext is valid, destructure user and loading for rendering checks
  const { user, loading } = authContext;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-neutral-700">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    // Not loading, but no user. useEffect should have redirected.
    // This UI is a fallback during redirection.
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-neutral-700">No user session. Redirecting...</p>
      </div>
    );
  }

  // If user is authenticated, show the dashboard content
  return (
    <div className="min-h-screen bg-[#f6f1ea] font-serif">
      <header className="border-b border-[#e6dfd2] bg-[#f6f1ea]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">AppCoppia</h1>
          <nav className="flex items-center gap-4 text-lg">
            <Link href="/" className="text-neutral-700 hover:text-neutral-900 hover:underline">Home</Link>
            {authContext.signOut && (
              <button 
                onClick={authContext.signOut} 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
              >
                Sign Out
              </button>
            )}
            <button className="ml-2 p-2 rounded-full hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900" aria-label="Settings">
              <span className="sr-only">Settings</span>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 16 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.11.22.17.46.17.7 0 .24-.06.48-.17.7z"/></svg>
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-neutral-800 mb-6">Dashboard</h1>
        <p className="text-xl text-neutral-700">Welcome, {user.email || 'user'}!</p>
        {/* Add your dashboard specific components and logic here */}
        <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Your Dashboard Content</h2>
          <p className="text-neutral-600">
            This is where your specific dashboard elements will go. You can add charts, summaries, quick actions, etc.
          </p>
          {/* Example placeholder for future content */}
          <div className="mt-6 border-t border-neutral-200 pt-6">
            <p className="text-sm text-neutral-500">More dashboard features coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

