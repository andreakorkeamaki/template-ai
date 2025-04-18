import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div>
        <h2 className="text-2xl font-semibold text-center border border-blue-300 p-4 font-mono rounded-md text-blue-700">
          Get started by choosing a template path from the /paths/ folder.
        </h2>
      </div>
      <div>
        <h1 className="text-6xl font-bold text-center text-blue-700">Make anything you imagine 🪄</h1>
        <h2 className="text-2xl text-center font-light text-blue-500 pt-4">
          This whole page will be replaced when you run your template path.
        </h2>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-blue-200 rounded-lg p-6 hover:bg-blue-50 transition-colors">
          <h3 className="text-xl font-semibold text-blue-800">AI Chat App</h3>
          <p className="mt-2 text-sm text-gray-600">
            An intelligent conversational app powered by AI models, featuring real-time responses
            and seamless integration with Next.js and various AI providers.
          </p>
        </div>
        <div className="border border-blue-200 rounded-lg p-6 hover:bg-blue-50 transition-colors">
          <h3 className="text-xl font-semibold text-blue-800">AI Image Generation App</h3>
          <p className="mt-2 text-sm text-gray-600">
            Create images from text prompts using AI, powered by the Replicate API and Next.js.
          </p>
        </div>
        <div className="border border-blue-200 rounded-lg p-6 hover:bg-blue-50 transition-colors">
          <h3 className="text-xl font-semibold text-blue-800">Social Media App</h3>
          <p className="mt-2 text-sm text-gray-600">
            A feature-rich social platform with user profiles, posts, and interactions using
            Firebase and Next.js.
          </p>
        </div>
        <div className="border border-blue-200 rounded-lg p-6 hover:bg-blue-50 transition-colors">
          <h3 className="text-xl font-semibold text-blue-800">Voice Notes App</h3>
          <p className="mt-2 text-sm text-gray-600">
            A voice-based note-taking app with real-time transcription using Deepgram API,
            Firebase integration for storage, and a clean, simple interface built with Next.js.
          </p>
        </div>
      </div>
    </main>
  );
}
