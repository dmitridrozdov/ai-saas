'use client';

import MeetingAssistant from '@/components/meeting-assistant';
import React from 'react';
// Make sure MeetingAssistant.tsx exists in the same folder as this file.
// If it's located elsewhere, update the import path accordingly.


// Page component that uses the MeetingAssistant
const MeetingAssistantPage: React.FC = () => {
  const handleTranscript = (result: any) => {
    console.log('Transcript received:', result);
  };

  const handleError = (error: string) => {
    console.error('Speech recognition error:', error);
  };

  const handleAIResponse = (response: string, originalTranscript: string) => {
    console.log('AI Response:', response, 'Original:', originalTranscript);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Meeting Assistant</h1>
      <MeetingAssistant
        onTranscript={handleTranscript}
        onError={handleError}
        onAIResponse={handleAIResponse}
        continuous={true}
        interimResults={true}
        language="en-US"
      />
    </div>
  );
};

export default MeetingAssistantPage;