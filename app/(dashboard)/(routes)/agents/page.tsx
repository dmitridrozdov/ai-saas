'use client';

import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

import { Montserrat, Source_Code_Pro, Kanit, Teko, Delius, Oswald} from 'next/font/google';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
const sourcecodepro = Source_Code_Pro ({ weight: '300', subsets: ['latin'] });
const kanit = Kanit ({ weight: '300', subsets: ['latin'] });
const teko = Teko ({ weight: '300', subsets: ['latin'] });
const delius = Delius ({ weight: '400', subsets: ['latin'] });
const oswald = Oswald ({ weight: '300', subsets: ['latin'] });

const TestPage = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [counter, setCounter] = useState<number>(0);
  const [inputText, setInputText] = useState<string>('');
  const [dropdownValue, setDropdownValue] = useState<string>('Option 1');
  const [checkboxes, setCheckboxes] = useState<boolean[]>([false, false, false]);
  const [radioValue, setRadioValue] = useState<string>('');
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [listItems, setListItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [designStatus, setDesignStatus] = useState(''); // null, 'loading',
  const [unitTestStatus, setUnitTestStatus] = useState(''); // null, 'loading',
  const [playwrightTestStatus, setPlaywrightTestStatus] = useState(''); // null, 'loading',

  const proModal = useProModal();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/testData');
      setData(response.data.message);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmitInput = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/processInput', { input: inputText });
      setData(response.data.result);
    } catch (err: any) {
      setError(err.message || 'Failed to process input');
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDropdownValue(e.target.value);
  };

  const handleCheckboxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxes((prevCheckboxes) => {
      const newCheckboxes = [...prevCheckboxes];
      newCheckboxes[index] = e.target.checked;
      return newCheckboxes;
    });
  };

  const handleRadioChange = (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(value);
    setTextareaValue(`Radio button "${value}" selected.`);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const saveFile = async (testContent: string, fileName: string, setStatus: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const response = await fetch('/api/savefile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileContent: testContent, fileName: fileName }),
      });

      if (response.ok) {
        console.log('Test file generated and saved successfully!')
        setStatus('success')
      } else {
        console.error('Failed to generate and save test file.')
        setStatus('error')
      }
    } catch (error) {
      console.error('Error generating and saving test file:', error)
      setStatus('error')
    }
  };

  const verifyDesign = async () => {
    setDesignStatus('loading') // Start loading
    try {
      const response = await axios.post('/api/designverify', {});

      saveFile(response.data.content, 'DesignVerify.txt', setDesignStatus)
      } catch (error: any) {
        if (error?.response?.status === 403) {
          proModal.onOpen();
        } else {
          toast.error("Something went wrong.");
        }
        console.log(error)
      }
  }

  const createUnitTest = async () => {
    setUnitTestStatus('loading') // Start loading
    try {
      
      const response = await axios.post('/api/unittest', {});

      saveFile(response.data.content, 'TestPage.test.tsx', setUnitTestStatus)

      } catch (error: any) {
        if (error?.response?.status === 403) {
          proModal.onOpen();
        } else {
          toast.error("Something went wrong.");
        }
        console.log(error)
      }
  }

  const createPlaywrightTest = async () => {
    setPlaywrightTestStatus('loading') // Start loading
    try {
      const response = await axios.post('/api/playwrighttest', {});

      saveFile(response.data.content, 'TestPage.spec.ts', setPlaywrightTestStatus)
      } catch (error: any) {
        if (error?.response?.status === 403) {
          proModal.onOpen();
        } else {
          toast.error("Something went wrong.");
        }
        console.log(error)
      }
  }

  const togglePanel = async () => {
    setIsPanelOpen(!isPanelOpen);
    if(!isPanelOpen){
      await verifyDesign()
      await createUnitTest()
      await createPlaywrightTest()
    } else {
      setUnitTestStatus('')
      setDesignStatus('')
      setPlaywrightTestStatus('')
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Define your key combination (e.g., Ctrl + Shift + A)
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault(); // Prevent default browser behavior
        togglePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePanel]); // Add togglePanel as a dependency


  interface StatusDisplayProps {
    status: string;
    loadingMessage: string;
    successMessage: string;
    errorMessage: string;
    backgroundColor?: string; // Optional background color parameter
  }
  
  const StatusDisplay: React.FC<StatusDisplayProps> = ({
    status,
    loadingMessage,
    successMessage,
    errorMessage,
    backgroundColor = 'bg-white', // Default background color
  }) => {
    if (status === 'loading') {
      return (
        <div className={cn(`flex items-center space-x-4 rounded-sm p-4 text-xs m-1 ${backgroundColor}`, montserrat.className)}>
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-700"></div>
          <span>{loadingMessage}</span>
        </div>
      );
    }
  
    if (status === 'success') {
      return (
        <div className={cn(`flex items-center space-x-4 rounded-sm p-4 text-xs m-1 ${backgroundColor}`, montserrat.className)}>
          <CheckCircleIcon className="h-6 w-6 text-green-700" />
          <span>{successMessage}</span>
        </div>
      );
    }
  
    if (status === 'error') {
      return (
        <div className={cn(`flex items-center space-x-4 text-red-500 rounded-sm text-xs p-4 m-1 ${backgroundColor}`)}>
          <ExclamationTriangleIcon className="h-6 w-6" />
          <span>{errorMessage}</span>
        </div>
      );
    }
  
    return null; // Return null if no status is set
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        
        <div className="mb-4">
        <h1 className={cn("text-2xl font-semibold mb-4 text-center", montserrat.className)}>Test Page</h1>
        </div>

        <div className="mb-4 flex gap-2 justify-center">
          <Button data-testid="fetch-data-button" onClick={fetchData} disabled={loading} className={cn("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", montserrat.className)}>
            Fetch Data
          </Button>
          <Button data-testid="increment-button" onClick={handleIncrement} className={cn("bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded", montserrat.className)}>
            Increment Counter
          </Button>
        </div>

        <p className={cn("text-center mb-4", sourcecodepro.className)}>Counter: <span className="font-semibold">{counter}</span></p>

        <div className="mb-4">
          <input
            data-testid="input-field"
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter text"
            className={cn("w-full p-2 border rounded", sourcecodepro.className)}
          />
          <Button data-testid="submit-input-button" onClick={handleSubmitInput} disabled={loading} className={cn("mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded", sourcecodepro.className)}>
            Submit Input
          </Button>
        </div>

        <div className="mb-4">
          <select
            data-testid="dropdown"
            value={dropdownValue}
            onChange={handleDropdownChange}
            className={cn("w-full p-2 border rounded", kanit.className)}
          >
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex flex-col">
            <label className={cn("mb-1", montserrat.className)}>Checkboxes:</label>
            {checkboxes.map((checked, index) => (
              <div key={index} className="flex items-center mb-1">
                <input
                  data-testid={`checkbox-${index + 1}`}
                  type="checkbox"
                  checked={checked}
                  onChange={handleCheckboxChange(index)}
                  className="mr-2"
                />
                <label className={cn("", montserrat.className)}>Checkbox {index + 1}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col">
            <label className={cn("mb-1", sourcecodepro.className)}>Radio Buttons:</label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  data-testid="radio-1"
                  type="radio"
                  value="Radio 1"
                  checked={radioValue === 'Radio 1'}
                  onChange={handleRadioChange('Radio 1')}
                  className="mr-2"
                />
                <label className={cn("", sourcecodepro.className)}>Radio 1</label>
              </div>
              <div className="flex items-center">
                <input
                  data-testid="radio-2"
                  type="radio"
                  value="Radio 2"
                  checked={radioValue === 'Radio 2'}
                  onChange={handleRadioChange('Radio 2')}
                  className="mr-2"
                />
                <label className={cn("", sourcecodepro.className)}>Radio 2</label>
              </div>
              <div className="flex items-center">
                <input
                  data-testid="radio-3"
                  type="radio"
                  value="Radio 3"
                  checked={radioValue === 'Radio 3'}
                  onChange={handleRadioChange('Radio 3')}
                  className="mr-2"
                />
                <label className={cn("", sourcecodepro.className)}>Radio 3</label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <textarea
            data-testid="textarea"
            value={textareaValue}
            onChange={handleTextareaChange}
            placeholder="Enter text"
            className={cn("w-full p-2 border rounded", kanit.className)}
          />
        </div>

        <div className="mb-4">
          <ul data-testid="list" className={cn("list-disc list-inside", kanit.className)}>
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        

        {loading && <p className={cn("text-center text-gray-600", sourcecodepro.className)}>Loading...</p>}
        {error && <p className={cn("text-center text-red-500", sourcecodepro.className)}>Error: {error}</p>}
        {data && <p className={cn("text-center", kanit.className)}>Data: <span className="font-semibold">{data}</span></p>}
      </div>

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className={cn("text-lg font-semibold mb-4", montserrat.className)}>AI Agents</h2>
          
          <StatusDisplay
            status={designStatus}
            loadingMessage="Verifying design..."
            successMessage="Design verified, suggestion generated."
            errorMessage="Failed to verify design. Check for errors."
            backgroundColor='bg-gray-100'
          />

          <StatusDisplay
            status={unitTestStatus}
            loadingMessage="Generating unit tests...."
            successMessage="Unit tests generated and verified."
            errorMessage="Failed to create unit tests."
            backgroundColor='bg-gray-200'
          />

          <StatusDisplay
            status={playwrightTestStatus}
            loadingMessage="Generating and running Playwright UI tests..."
            successMessage="Playwright UI tests generated and passed."
            errorMessage="Playwright UI tests generation or execution failed."
            backgroundColor="bg-gray-100"
          />

        </div>
      </div>
    </div>
  );
};

export default TestPage;