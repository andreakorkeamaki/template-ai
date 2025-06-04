"use client";

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '../../lib/contexts/AuthContext'; // Adjusted path

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // Check if AuthContext is available
  if (!authContext) {
    // This can happen if the component is rendered outside AuthProvider
    // Or if AuthContext is not correctly exported/imported
    console.error("AuthContext is not available");
    // Optionally, redirect to an error page or home
    useEffect(() => {
      router.push('/'); 
    }, [router]);
    return <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center"><p className="text-xl text-red-500">Error: Auth context not found. Redirecting...</p></div>;
  }

  const { user, loading } = authContext;

  useEffect(() => {
    if (!loading && !user) {
      // If not loading and no user, redirect to homepage (or a login page)
      router.push('/'); 
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-neutral-700">Loading...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the useEffect redirect,
    // but it's good practice for robustness or if redirect hasn't happened yet.
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl text-neutral-700">Redirecting...</p>
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

