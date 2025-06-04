"use client";

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '../../../lib/contexts/AuthContext'; // Adjusted path

export default function NewLetterPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // Combined useEffect for auth state management
  useEffect(() => {
    // Case 1: AuthContext itself is not yet available
    if (authContext === undefined) {
      console.log("NewLetterPage: AuthContext is undefined. Waiting for provider.");
      return; // Do nothing until context is defined
    }

    // Case 2: AuthContext provider explicitly passed null
    if (authContext === null) {
      console.error("NewLetterPage: AuthContext is null. Redirecting to /.");
      router.push('/');
      return;
    }

    // Case 3: AuthContext is an object, check user and loading state
    const { user, loading } = authContext; // user and loading are scoped to this effect
    if (!loading && !user) {
      console.log("NewLetterPage: Not loading and no user. Redirecting to /.");
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
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-red-500">Authentication context error. Redirecting...</p>
      </div>
    );
  }

  // If authContext is valid, destructure user and loading for rendering checks
  const { user, loading, signOut } = authContext; // signOut is now correctly accessed after authContext checks

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-neutral-700">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-neutral-700">No user session. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1ea] font-serif">
      <header className="border-b border-[#e6dfd2] bg-[#f6f1ea]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">AppCoppia</h1>
          <nav className="flex items-center gap-4 text-lg">
            <Link href="/" className="text-neutral-700 hover:text-neutral-900 hover:underline">Home</Link>
            <Link href="/dashboard" className="text-neutral-700 hover:text-neutral-900 hover:underline">Dashboard</Link>
            {signOut && (
              <button 
                onClick={signOut} 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
              >
                Sign Out
              </button>
            )}
            <button className="ml-2 p-2 rounded-full hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900" aria-label="Settings">
              <span className="sr-only">Settings</span>
              {/* SVG for Settings Icon */}
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 16 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.11.22.17.46.17.7 0 .24-.06.48-.17.7z"/></svg>
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-neutral-800 mb-8">Compose New Letter</h2>
        
        {/* Placeholder for Letter Editor Component */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <textarea 
            className="w-full h-96 p-4 border border-neutral-300 rounded-md focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition duration-150 ease-in-out resize-none text-neutral-800 placeholder-neutral-400"
            placeholder="Start writing your letter here..."
          ></textarea>
          <div className="mt-6 flex justify-end space-x-4">
            <button className="px-6 py-2 border border-neutral-400 text-neutral-700 rounded-md hover:bg-neutral-100 transition">
              Save Draft
            </button>
            <button className="px-6 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-800 transition">
              Send Letter
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
