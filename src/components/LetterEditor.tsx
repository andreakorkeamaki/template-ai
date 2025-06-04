"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
// Rimuoviamo temporaneamente useAuth per lo sviluppo
// import { useAuth } from '../lib/hooks/useAuth';
import { upsertLetter, shareLetter } from '../lib/supabase/dbFunctions';
import type { Letter } from '../lib/supabase/dbFunctions';

// Utente simulato per lo sviluppo
const mockUser = {
  id: 'dev-user-123',
  email: 'sviluppatore@example.com',
  user_metadata: {
    full_name: 'Dev User'
  }
};

interface LetterEditorProps {
  recipientId: string | null;
  initialContent?: string;
  letterId?: string;
  onSave?: (letter: Letter) => void;
  onShare?: (letter: Letter) => void;
  readOnly?: boolean;
}

export default function LetterEditor({ 
  recipientId, 
  initialContent = '', 
  letterId, 
  onSave, 
  onShare,
  readOnly = false 
}: LetterEditorProps) {
  // Utilizziamo l'utente simulato invece di useAuth
  const user = mockUser;
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveDraft = useCallback(async () => {
    if (!user || !recipientId) return;

    setIsSaving(true);
    try {
      const letter = await upsertLetter({
        id: letterId,
        author_id: user.id,
        recipient_id: recipientId,
        content,
        is_draft: true,
        is_shared: false,
      });
      
      setLastSaved(new Date());
      if (onSave) onSave(letter);
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  }, [user, recipientId, letterId, content, onSave]);

  // Auto-save functionality
  useEffect(() => {
    if (!user || !recipientId || !autoSaveEnabled || readOnly) return;

    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set a new timer to save after 2 seconds of inactivity
    autoSaveTimerRef.current = setTimeout(async () => {
      if (content.trim()) {
        await saveDraft(); // saveDraft is now defined above
      }
    }, 2000);

    // Cleanup function to clear the timer when component unmounts
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, user, recipientId, autoSaveEnabled, readOnly, saveDraft, onSave]); // saveDraft in deps is now fine

  const handleShareLetter = async () => {
    if (!user || !recipientId) return;

    setIsSharing(true);
    try {
      // First save the current content
      const savedLetter = await upsertLetter({
        id: letterId,
        author_id: user.id,
        recipient_id: recipientId,
        content,
        is_draft: true, // Will be set to false when shared
        is_shared: false, // Will be set to true when shared
      });
      
      // Then share the letter
      const sharedLetter = await shareLetter(savedLetter.id);
      
      if (onShare) onShare(sharedLetter);
    } catch (error) {
      console.error("Error sharing letter:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {!readOnly && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Write a Letter</h2>
          <div className="text-sm text-gray-500">
            {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={!readOnly ? "Start typing your thoughtful message here..." : ""}
          className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          readOnly={readOnly}
        ></textarea>
      </div>
      
      {!readOnly && (
        <div className="flex justify-between">
          <div>
            <button 
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-50"
              onClick={() => {/* Drawing functionality to be implemented */}}
            >
              Add Drawing
            </button>
            <button 
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              onClick={() => {/* Image upload functionality to be implemented */}}
            >
              Upload Image
            </button>
          </div>
          <div>
            <div className="flex items-center mb-2 justify-end">
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSaveEnabled}
                onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className="mr-2"
              />
              <label htmlFor="autoSave" className="text-sm text-gray-600">Auto-save</label>
            </div>
            <button 
              className={`bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={saveDraft}
              disabled={isSaving || !content.trim()}
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button 
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 ${isSharing ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleShareLetter}
              disabled={isSharing || !content.trim()}
            >
              {isSharing ? 'Sharing...' : 'Share Letter'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
