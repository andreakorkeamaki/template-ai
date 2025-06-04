"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { updateReadingPreference } from '../lib/supabase/dbFunctions';
import type { ReadingPreference } from '../lib/supabase/dbFunctions';

interface ReadingPreferencesProps {
  initialPreference?: ReadingPreference;
  onUpdate?: (preference: ReadingPreference) => void;
}

export default function ReadingPreferences({ 
  initialPreference = 'manual',
  onUpdate 
}: ReadingPreferencesProps) {
  const { user } = useAuth();
  const [preference, setPreference] = useState<ReadingPreference>(initialPreference);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Time settings for timed mode
  const [selectedTime, setSelectedTime] = useState('18:00');
  
  // Day settings for weekly mode
  const [selectedDay, setSelectedDay] = useState('friday');
  
  useEffect(() => {
    setPreference(initialPreference);
  }, [initialPreference]);

  const handlePreferenceChange = async (newPreference: ReadingPreference) => {
    if (!user) return;
    
    setPreference(newPreference);
    setIsUpdating(true);
    
    try {
      await updateReadingPreference(user.id, newPreference);
      if (onUpdate) onUpdate(newPreference);
    } catch (error) {
      console.error("Error updating reading preference:", error);
      // Revert to previous preference on error
      setPreference(initialPreference);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Reading Preferences</h2>
      <p className="text-gray-600 mb-6">
        Choose how you&apos;d like to receive and read letters from your connection.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Timed Unlock */}
        <div 
          className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all ${preference === 'timed' ? 'border-indigo-500 bg-indigo-50' : ''}`}
          onClick={() => handlePreferenceChange('timed')}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">Timed Unlock</h3>
            <input 
              type="radio" 
              checked={preference === 'timed'}
              onChange={() => handlePreferenceChange('timed')}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <p className="text-gray-600 mb-3">Letters become available at a specific time every day that you set.</p>
          
          {preference === 'timed' && (
            <div className="mt-2 p-3 bg-white rounded border">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose when to receive letters:
              </label>
              <input 
                type="time" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border rounded p-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                Letters shared with you will become visible at {selectedTime} every day.
              </p>
            </div>
          )}
        </div>
        
        {/* Manual Open */}
        <div 
          className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all ${preference === 'manual' ? 'border-indigo-500 bg-indigo-50' : ''}`}
          onClick={() => handlePreferenceChange('manual')}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">Manual Open</h3>
            <input 
              type="radio" 
              checked={preference === 'manual'}
              onChange={() => handlePreferenceChange('manual')}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <p className="text-gray-600">
            Letters can be read whenever you want, but you won&apos;t receive notifications when new letters arrive.
          </p>
        </div>
        
        {/* Weekly Scheduled */}
        <div 
          className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all ${preference === 'weekly' ? 'border-indigo-500 bg-indigo-50' : ''}`}
          onClick={() => handlePreferenceChange('weekly')}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">Weekly Schedule</h3>
            <input 
              type="radio" 
              checked={preference === 'weekly'}
              onChange={() => handlePreferenceChange('weekly')}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <p className="text-gray-600 mb-3">
            Letters only become available on specific days of your choosing.
          </p>
          
          {preference === 'weekly' && (
            <div className="mt-2 p-3 bg-white rounded border">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose which day to receive letters:
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                All letters shared with you during the week will become visible on {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}.
              </p>
            </div>
          )}
        </div>
        
        {/* Silent Mode */}
        <div 
          className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all ${preference === 'silent' ? 'border-indigo-500 bg-indigo-50' : ''}`}
          onClick={() => handlePreferenceChange('silent')}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">Silent Mode</h3>
            <input 
              type="radio" 
              checked={preference === 'silent'}
              onChange={() => handlePreferenceChange('silent')}
              className="h-4 w-4 text-indigo-600"
            />
          </div>
          <p className="text-gray-600">
            All letters are available immediately, but require manual action to view. 
            No notifications or alerts will be shown.
          </p>
        </div>
      </div>
      
      {isUpdating && (
        <div className="mt-4 text-sm text-indigo-600">
          Updating your preferences...
        </div>
      )}
    </div>
  );
}
