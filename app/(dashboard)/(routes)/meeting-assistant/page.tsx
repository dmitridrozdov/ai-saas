'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
}

interface SpeechRecognitionComponentProps {
  onTranscript?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const MeetingAssistant: React.FC<SpeechRecognitionComponentProps> = ({
  onTranscript,
  onError,
  continuous = true,
  interimResults = true,
  language = 'en-US'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          const result: SpeechRecognitionResult = {
            transcript: finalTranscript,
            confidence: event.results[event.results.length - 1][0].confidence || 0,
            isFinal: true,
            timestamp: new Date()
          };
          onTranscript?.(result);
        }

        setInterimTranscript(interimTranscript);
        
        if (interimTranscript && onTranscript) {
          const result: SpeechRecognitionResult = {
            transcript: interimTranscript,
            confidence: 0,
            isFinal: false,
            timestamp: new Date()
          };
          onTranscript(result);
        }
      };

      recognition.onerror = (event: any) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        onError?.(errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        
        // Auto-restart if it was stopped unexpectedly and we want continuous listening
        if (continuous && !error) {
          restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.warn('Failed to restart recognition:', e);
              }
            }
          }, 100);
        }
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, interimResults, language, onTranscript, onError]);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      setError(null);
      setInterimTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      setError('Failed to start speech recognition');
      onError?.('Failed to start speech recognition');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">
          Speech recognition is not supported in this browser. 
          Please use Chrome, Edge, or Safari for the best experience.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={!isSupported}
        >
          {isListening ? '🎤 Stop Listening' : '🎤 Start Listening'}
        </button>
        
        <button
          onClick={clearTranscript}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Clear
        </button>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isListening 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isListening ? 'Listening...' : 'Not listening'}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Transcript:</h3>
          <div className="min-h-[100px] p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">
              {transcript}
              {interimTranscript && (
                <span className="text-gray-500 italic">{interimTranscript}</span>
              )}
            </p>
            {!transcript && !interimTranscript && (
              <p className="text-gray-500 italic">
                Click "Start Listening" and begin speaking...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingAssistant;