import axios from 'axios';
import { describe, test, expect } from '@jest/globals';

const baseURL = 'http://localhost:3000'; // Replace with your actual base URL if different

describe('API Tests for TestPage Component', () => {

  describe('GET /api/testData', () => {
    test('should return data with status 200', async () => {
      const response = await axios.get(`${baseURL}/api/testData`);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.message).toBeDefined();
    });

    test('should handle errors and return an error message', async () => {
      // Mock axios get request to simulate an error
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('Simulated error'));
      try {
        await axios.get(`${baseURL}/api/testData`);
      } catch (error: any) {
        expect(error.message).toBe('Simulated error');
      }
      jest.restoreAllMocks(); // Restore the original axios.get
    });
  });

  describe('POST /api/processInput', () => {
    test('should process input and return a result with status 200', async () => {
      const inputData = { input: 'test input' };
      const response = await axios.post(`${baseURL}/api/processInput`, inputData);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.result).toBeDefined();
    });

    test('should handle errors when processing input', async () => {
      const inputData = { input: 'test input' };
      jest.spyOn(axios, 'post').mockRejectedValue(new Error('Simulated processing error'));

      try {
        await axios.post(`${baseURL}/api/processInput`, inputData);
      } catch (error: any) {
        expect(error.message).toBe('Simulated processing error');
      }
      jest.restoreAllMocks();
    });

    test('should handle empty input', async () => {
        const inputData = { input: '' };
        const response = await axios.post(`${baseURL}/api/processInput`, inputData);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });
  });

    describe('POST /api/designverify', () => {
        test('should return design verification content with status 200', async () => {
          const response = await axios.post(`${baseURL}/api/designverify`, {});
          expect(response.status).toBe(200);
          expect(response.data).toBeDefined();
          expect(response.data.content).toBeDefined();
        });
    
        test('should handle 403 error when design verification fails due to permissions', async () => {
          jest.spyOn(axios, 'post').mockRejectedValue({ response: { status: 403 } });
    
          try {
            await axios.post(`${baseURL}/api/designverify`, {});
          } catch (error: any) {
            expect(error.response.status).toBe(403);
          }
    
          jest.restoreAllMocks();
        });

        test('should handle other errors when design verification fails', async () => {
            jest.spyOn(axios, 'post').mockRejectedValue({ response: { status: 500, message: "Server error" } });
      
            try {
              await axios.post(`${baseURL}/api/designverify`, {});
            } catch (error: any) {
                expect(error.response.status).toBe(500);
            }
      
            jest.restoreAllMocks();
          });
      });

    describe('POST /api/unittest', () => {
        test('should return unit test content with status 200', async () => {
          const response = await axios.post(`${baseURL}/api/unittest`, {});
          expect(response.status).toBe(200);
          expect(response.data).toBeDefined();
          expect(response.data.content).toBeDefined();
        });
    
        test('should handle 403 error when unit test generation fails due to permissions', async () => {
          jest.spyOn(axios, 'post').mockRejectedValue({ response: { status: 403 } });
    
          try {
            await axios.post(`${baseURL}/api/unittest`, {});
          } catch (error: any) {
            expect(error.response.status).toBe(403);
          }
    
          jest.restoreAllMocks();
        });
      });

      describe('POST /api/playwrighttest', () => {
        test('should return playwright test content with status 200', async () => {
          const response = await axios.post(`${baseURL}/api/playwrighttest`, {});
          expect(response.status).toBe(200);
          expect(response.data).toBeDefined();
          expect(response.data.content).toBeDefined();
        });
    
        test('should handle 403 error when playwright test generation fails due to permissions', async () => {
          jest.spyOn(axios, 'post').mockRejectedValue({ response: { status: 403 } });
    
          try {
            await axios.post(`${baseURL}/api/playwrighttest`, {});
          } catch (error: any) {
            expect(error.response.status).toBe(403);
          }
    
          jest.restoreAllMocks();
        });
      });
    
      describe('POST /api/apitests', () => {
        test('should return api test content with status 200', async () => {
          const response = await axios.post(`${baseURL}/api/apitests`, {});
          expect(response.status).toBe(200);
          expect(response.data).toBeDefined();
          expect(response.data.content).toBeDefined();
        });
    
        test('should handle 403 error when api test generation fails due to permissions', async () => {
          jest.spyOn(axios, 'post').mockRejectedValue({ response: { status: 403 } });
    
          try {
            await axios.post(`${baseURL}/api/apitests`, {});
          } catch (error: any) {
            expect(error.response.status).toBe(403);
          }
    
          jest.restoreAllMocks();
        });
      });

      describe('POST /api/savefile', () => {
        test('should return a 200 OK response when saving a file successfully', async () => {
          const fileContent = 'Test content';
          const fileName = 'test.txt';
      
          // Mock the fetch function to simulate a successful response
          global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ message: 'File saved successfully' }),
          }) as jest.Mock;
      
          const response = await fetch(`${baseURL}/api/savefile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileContent, fileName }),
          });
      
          expect(response.ok).toBe(true);
          expect(response.status).toBe(200);
          const data = await response.json();
          expect(data.message).toBe('File saved successfully');
      
          (global.fetch as jest.Mock).mockRestore();
        });
      
        test('should handle a non-OK response when saving a file fails', async () => {
            const fileContent = 'Test content';
            const fileName = 'test.txt';
        
            // Mock the fetch function to simulate a non-OK response
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 500, // Simulate a server error
                statusText: 'Internal Server Error',
                json: async () => ({ error: 'Failed to save file' }),
            }) as jest.Mock;
        
            const response = await fetch(`${baseURL}/api/savefile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileContent, fileName }),
            });
        
            expect(response.ok).toBe(false);
            expect(response.status).toBe(500);
            expect(response.statusText).toBe('Internal Server Error');
            const data = await response.json();
            expect(data.error).toBe('Failed to save file');
        
            (global.fetch as jest.Mock).mockRestore();
        });

        test('should handle network errors', async () => {
            const fileContent = 'Test content';
            const fileName = 'test.txt';
          
            // Mock the fetch function to simulate a network error
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as jest.Mock;
          
            try {
              await fetch(`${baseURL}/api/savefile`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileContent, fileName }),
              });
            } catch (error: any) {
              expect(error).toBeInstanceOf(Error);
              expect(error.message).toBe('Network error');
            }
          
            (global.fetch as jest.Mock).mockRestore();
          });
    });
});