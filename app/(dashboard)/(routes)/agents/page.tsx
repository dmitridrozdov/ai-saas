'use client';

import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Montserrat, Source_Code_Pro, Kanit } from 'next/font/google';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
const sourcecodepro = Source_Code_Pro ({ weight: '300', subsets: ['latin'] });
const kanit = Kanit ({ weight: '300', subsets: ['latin'] });

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

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Test Page</h1>

        <div className="mb-4 flex gap-2 justify-center">
          <Button data-testid="fetch-data-button" onClick={fetchData} disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Fetch Data
          </Button>
          <Button data-testid="increment-button" onClick={handleIncrement} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Increment Counter
          </Button>
        </div>

        <p className="text-center mb-4">Counter: <span className="font-semibold">{counter}</span></p>

        <div className="mb-4">
          <input
            data-testid="input-field"
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter text"
            className="w-full p-2 border rounded"
          />
          <Button data-testid="submit-input-button" onClick={handleSubmitInput} disabled={loading} className="mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Submit Input
          </Button>
        </div>

        <div className="mb-4">
          <select
            data-testid="dropdown"
            value={dropdownValue}
            onChange={handleDropdownChange}
            className="w-full p-2 border rounded"
          >
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex flex-col">
            <label className="mb-1">Checkboxes:</label>
            {checkboxes.map((checked, index) => (
              <div key={index} className="flex items-center mb-1">
                <input
                  data-testid={`checkbox-${index + 1}`}
                  type="checkbox"
                  checked={checked}
                  onChange={handleCheckboxChange(index)}
                  className="mr-2"
                />
                <label>Checkbox {index + 1}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col">
            <label className="mb-1">Radio Buttons:</label>
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
                <label>Radio 1</label>
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
                <label>Radio 2</label>
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
                <label>Radio 3</label>
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
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <ul data-testid="list" className="list-disc list-inside">
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <Button onClick={togglePanel} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Toggle Panel
          </Button>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {data && <p className="text-center">Data: <span className="font-semibold">{data}</span></p>}
      </div>

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Sliding Panel</h2>
          <p>This is the content of the sliding panel.</p>
          {/* Add more panel content here */}
          <Button onClick={togglePanel} className="mt-4 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
            Close Panel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;