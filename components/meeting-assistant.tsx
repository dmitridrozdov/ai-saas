import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Markdown from "@/components/markdown";

import { cn } from "@/lib/utils";
import { Montserrat, Kanit } from 'next/font/google';
import { Mic } from 'lucide-react';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] })

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
}

interface SpeechRecognitionComponentProps {
  onTranscript?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
  onAIResponse?: (response: string, originalTranscript: string) => void;
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
  onAIResponse,
  continuous = true,
  interimResults = true,
  language = 'en-US'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isGettingAIResponse, setIsGettingAIResponse] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldRestartRef = useRef<boolean>(false);

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
        shouldRestartRef.current = true;
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
        shouldRestartRef.current = false;
      };

      recognition.onend = () => {
        setIsListening(false);
        
        // Only auto-restart if it was stopped unexpectedly and we want continuous listening
        if (continuous && shouldRestartRef.current && !error) {
          restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && shouldRestartRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.warn('Failed to restart recognition:', e);
                shouldRestartRef.current = false;
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
      shouldRestartRef.current = true;
      recognitionRef.current.start();
    } catch (e) {
      setError('Failed to start speech recognition');
      onError?.('Failed to start speech recognition');
      shouldRestartRef.current = false;
    }
  };

  const stopListening = () => {
    shouldRestartRef.current = false; // Prevent auto-restart
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setAiResponse('');
  };

  const getAIResponse = async () => {
    if (!transcript.trim()) return;
    
    setIsGettingAIResponse(true);
    try {
      const userMessage = { 
        role: "user", 
        content: transcript.trim()
      };
      const messages = [userMessage];
      
      const response = await axios.post('/api/meetingassistant', { messages });

      setAiResponse(response.data.content);
      onAIResponse?.(response.data.content, transcript.trim());
      
    } catch (error: any) {
      let errorMessage = "Something went wrong.";
      
      if (error?.response?.status === 403) {
        errorMessage = "Access denied. Please check your permissions.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Invalid request. Please check your input.";
      } else if (error?.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
      console.log('[MEETING_ASSISTANT_ERROR]', error);
    } finally {
      setIsGettingAIResponse(false);
    }
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
          className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-colors ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={!isSupported}
        >
          <Mic size={20} />
        </button>
        
        <button
          onClick={clearTranscript}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Clear
        </button>
        
        <button
          onClick={getAIResponse}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!transcript.trim() || isGettingAIResponse}
        >
          {isGettingAIResponse ? '🤖 Analyzing...' : '🤖 Get AI Opinion'}
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
            <p className={cn("text-gray-900 whitespace-pre-wrap", montserrat.className)}>
              {transcript}
              {interimTranscript && (
                <span className="text-gray-500 italic">{interimTranscript}</span>
              )}
            </p>
            {!transcript && !interimTranscript && (
              <p className="text-gray-500 italic">
                Click &apos;Start Listening&apos; and begin speaking...
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">AI Opinion:</h3>
          <div className="min-h-[100px] p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">
               {aiResponse && (
                    <div>
                        {/* <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg"> */}
                        <Markdown 
                            // className={cn("text-purple-900 [&_strong]:font-bold [&_b]:font-bold", montserrat.className)} 
                            text={aiResponse} 
                        />
                        {/* </div> */}
                    </div>
                )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingAssistant