"use client";

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '../lib/contexts/AuthContext';
// import LetterEditor from '../components/LetterEditor'; // Commented out, remove if not used

export default function Home() {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!authContext) {
    console.error("AuthContext is not available on Home page");
    return <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center"><p className="text-xl text-red-500">Error: Authentication context not found.</p></div>;
  }

  const { user, loading, signIn, signOut } = authContext;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!signIn) { 
        setAuthError("Authentication service is not ready. Please try again.");
        return;
    }
    // The loading state from AuthContext is set to true by the signIn method itself.
    const result = await signIn(email, password);
    if (result && result.error) {
      setAuthError(result.error.message || 'Failed to sign in. Please check your credentials.');
    }
    // On successful sign-in, AuthContext updates user, leading to re-render and page change.
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex justify-center items-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f1ea] font-serif flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to AppCoppia</h1>
        <form onSubmit={handleSignIn} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="your@email.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="************"
            />
          </div>
          {authError && <p className="text-red-500 text-xs italic mb-4">{authError}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#5a8dee] hover:bg-[#4a7bdc] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-150 ease-in-out"
              disabled={loading} 
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // User is authenticated, show the main app content
  return (
    <div className="min-h-screen bg-[#f6f1ea] font-serif">
      <header className="border-b border-[#e6dfd2] bg-[#f6f1ea]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">AppCoppia</h1>
          <nav className="flex items-center gap-4 text-lg">
            <Link href="/dashboard" className="text-neutral-700 hover:text-neutral-900 hover:underline">Dashboard</Link>
            <button 
              onClick={signOut} 
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
            >
              Sign Out
            </button>
            <button className="ml-2 p-2 rounded-full hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900" aria-label="Settings"><span className="sr-only">Settings</span><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 16 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.11.22.17.46.17.7 0 .24-.06.48-.17.7z"/></svg></button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-1 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-neutral-800">Recent Letters from {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Partner')}</h2>
            <div className="bg-[#f3ede5] rounded-lg p-4 shadow-sm mb-2">
              <div className="font-semibold text-lg text-neutral-800">Starting Fresh</div>
              <div className="text-sm text-gray-700">Yesterday</div>
              {/* TODO: Replace with actual data from Supabase */}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-neutral-800">Relationship Progress</h2>
            <div className="flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-4 w-8 rounded ${i<4 ? 'bg-neutral-700' : 'bg-neutral-300'}`}></div>
              ))}
            </div>
            {/* TODO: Replace with actual data from Supabase */}
          </div>
        </section>

        <section className="md:col-span-2 space-y-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-neutral-800">Your Letters</h2>
            <button
              className="border border-neutral-400 bg-[#f3ede5] text-neutral-700 hover:text-neutral-800 rounded px-4 py-2 font-medium shadow hover:bg-[#ede6db] transition"
              // onClick={() => { /* TODO: Implement New Letter functionality, e.g., navigate to an editor page or open a modal */ }}
            >
              + New Letter
            </button>
          </div>
          <div className="space-y-4">
            <div className="border border-[#e6dfd2] bg-[#f9f6f2] rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-neutral-800">Moving Forward</div>
                <div className="text-sm text-gray-700">Begun duis fells diam urna, lacus ut malesuada....</div>
              </div>
              <div className="text-sm text-gray-600">Jan 25</div>
            </div>
            <div className="border border-[#e6dfd2] bg-[#f9f6f2] rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-neutral-800">Taking Time</div>
                <div className="text-sm text-gray-700">Iaculis necinteger lobortis augue suspendisse te....</div>
              </div>
              <div className="text-sm text-gray-600">Jan 20</div>
            </div>
            <div className="border border-[#e6dfd2] bg-[#f9f6f2] rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-neutral-800">Lessons Learned</div>
                <div className="text-sm text-gray-700">Ipsum et vel netus risus commodo ut in.</div>
              </div>
              <div className="text-sm text-gray-600">Jan 12</div>
            </div>
            {/* TODO: Replace with actual data from Supabase */}
          </div>
        </section>
      </main>
    </div>
  );
}
