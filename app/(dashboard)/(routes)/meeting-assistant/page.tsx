'use client';

import { Heading } from '@/components/heading';
import MeetingAssistant from '@/components/meeting-assistant';
import { CheckCircle } from 'lucide-react';
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
    <div>
        <Heading
            title="Meeting Assistant"
            description="Your intelligent meeting companion for seamless scheduling and effortless coordination.."
            icon={CheckCircle}
            iconColor="text-slate-400"
            bgColor="bg-white"
        />
        <div className="px-4 lg:px-8">
        <div>
            <MeetingAssistant
                onTranscript={handleTranscript}
                onError={handleError}
                onAIResponse={handleAIResponse}
                continuous={true}
                interimResults={true}
                language="en-US"
            />
        </div>
        </div>
    </div>
  );
};

export default MeetingAssistantPage;