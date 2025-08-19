"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import { CheckCircle } from "lucide-react";
import { Heading } from "@/components/heading";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { useProModal } from "@/hooks/use-pro-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { Montserrat, Kanit } from 'next/font/google';
import { CopyIcon } from '@/components/copy-icon'
import Markdown from "@/components/markdown";
import { Separator } from "@/components/ui/separator";
import {  Trash2 } from 'lucide-react';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] })
const kanit = Kanit ({ weight: '100', subsets: ['latin']})
const requestResult = Kanit ({ weight: '500', subsets: ['latin']})

const ConversationPage = () => {
    const router = useRouter();
    const proModal = useProModal();

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

    const [result, setResult] = useState('')
    const [rephrases, setRepharses] = useState<string[]>([])

    const [geminiResult, setGeminiResult] = useState('')
    // const [geminiResultList, setGeminiResultList] = useState<string[]>([])

    const [geminiCorrected, setGeminiCorrected] = useState('')
    const [geminiImproved, setGeminiImproved] = useState('')
    const [geminiShortened, setGeminiShortened] = useState('')
    const [geminiRephrasedFriendly, setGeminiRephrasedFriendly] = useState('')
    const [geminiRephrasedFormal, setGeminiRephrasedFormal] = useState('')


    const [claudeResult, setClaudeResult] = useState('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          prompt: ""
        }
      });

    const isLoading = form.formState.isSubmitting;

    const prepareResult = (originalString: string): string => {
        const prefixesToCheck = [
          "Task 1:",
          "Corrected sentence:",
          "Corrected English sentence:",
          "Corrected Sentence:",
        ];
      
        // Find the first matching prefix (including optional ":")
        for (const prefix of prefixesToCheck) {
          if (
            originalString.startsWith(prefix) ||
            originalString.startsWith(prefix.slice(0, -1))
          ) {
            // Slice the matched prefix (including optional ":") and trim the result
            const resultWithoutPrefix = originalString
              .slice(prefix.length)
              .trimStart();
      
            // Recursively check for additional prefixes
            return prepareResult(resultWithoutPrefix);
          }
        }
      
        // If no prefix matches, return the original string
        return originalString.trim();
      };
      

    const parseRephrases = (str:string) => {
        return str.replace(/^:/, '').split(/1\.|2\.|3\./).map(item => item.trim()).filter(item => item !== '')
    }

    const removeNumberedPrefix = (text: string): string => {
        // Regular expression to match numbered prefixes (1., 2., or 3.)
        const regex = /^(\d+)\./;
        const match = regex.exec(text);
      
        // If a match is found, return the text after the prefix
        if (match) {
          return text.slice(match[1].length + 1); // +1 to include the dot
        }
      
        // Otherwise, return the original text
        return text;
      }

    const removeTextBetweenStars = (text: string): string => {
        // Use a regular expression to match everything between two asterisks (**)
        const regex = /\*\*(.*?)\*\*/g;
        return text.replace(regex, "");
    }

    const removeBetweenStars = (text: string): string[] => {
        // Split the text by lines, handling potential empty lines
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        return lines.map(line => removeTextBetweenStars(line)).filter(line => line.trim() !== "")
    }

    // Function to parse grammar correction results and update React state
    const parseGrammarResult = (
        result: string,
        setGeminiCorrected: (value: string) => void,
        setGeminiImproved: (value: string) => void,
        setGeminiShortened: (value: string) => void,
        setGeminiRephrasedFriendly: (value: string) => void,
        setGeminiRephrasedFormal: (value: string) => void
        ) => {
        try {
            // Helper function to extract content between XML tags
            const extractContent = (text: string, tagName: string): string => {
                const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 'gs');
                const match = regex.exec(text);
                return match ? match[1].trim() : '';
            };

            // Parse each section
            const corrected = extractContent(result, 'corrected_sentence');
            const improved = extractContent(result, 'improved_sentence');
            const shortened = extractContent(result, 'shortened_sentence');
            const friendly = extractContent(result, 'friendly_tone');
            const formal = extractContent(result, 'formal_tone');

            // Update state with parsed values
            setGeminiCorrected(corrected);
            setGeminiImproved(improved);
            setGeminiShortened(shortened);
            setGeminiRephrasedFriendly(friendly);
            setGeminiRephrasedFormal(formal);

            // Optional: Log results for debugging
            console.log('Parsed grammar results:', {
                corrected,
                improved,
                shortened,
                friendly,
                formal
            });

        } catch (error) {
            console.error('Error parsing grammar result:', error);
            
            // Set empty strings on error
            setGeminiCorrected('');
            setGeminiImproved('');
            setGeminiShortened('');
            setGeminiRephrasedFriendly('');
            setGeminiRephrasedFormal('');
        }
    };

    const claudeVerify = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            
            const response = await axios.post('/api/grammarclaude', { messages: newMessages });

            // response.data.response is now a string
            const textContent = response.data.response;

            setClaudeResult(textContent);

          } catch (error: any) {
            if (error?.response?.status === 403) {
              proModal.onOpen();
            } else {
              toast.error("Something went wrong.");
            }
            console.log(error)
          } finally {
            router.refresh();
          }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            
            const response = await axios.post('/api/grammargemini', { messages: newMessages });

            setGeminiResult(response.data.content)
            // setGeminiResultList(removeBetweenStars(response.data.content))
            parseGrammarResult(
                response.data.content,
                setGeminiCorrected,
                setGeminiImproved,
                setGeminiShortened,
                setGeminiRephrasedFriendly,
                setGeminiRephrasedFormal
            );

          } catch (error: any) {
            if (error?.response?.status === 403) {
              proModal.onOpen();
            } else {
              toast.error("Something went wrong.");
            }
            console.log(error)
          } finally {
            router.refresh();
          }
    }

    const openaiVerify = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            
            const response = await axios.post('/api/grammar', { messages: newMessages });
            
            console.log(response.data.content)
            const parts = response.data.content.split("Task 2");

            setResult(prepareResult(parts[0]))
            if(parts.length > 1) {
                const rephraseArray = parseRephrases(parts[1].trim())
                setRepharses(rephraseArray)
            }
          } catch (error: any) {
            if (error?.response?.status === 403) {
              proModal.onOpen();
            } else {
              toast.error("Something went wrong.");
            }
            console.log(error)
          } finally {
            router.refresh();
          }
      }

    const onClear = async (values: z.infer<typeof formSchema>) => {
        form.reset()
        setResult('')
        setRepharses([])
        setGeminiResult('')
        // setGeminiResultList([])

        setGeminiCorrected('');
        setGeminiImproved('');
        setGeminiShortened('');
        setGeminiRephrasedFriendly('');
        setGeminiRephrasedFormal('');

        setClaudeResult('')
    }

    return (
        <div>
            <Heading
                title="Grammar Genie"
                description="Your personal writing coach for impeccable grammar and flawless writing."
                icon={CheckCircle}
                iconColor="text-slate-400"
                bgColor="bg-white"
            />
             <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)} 
                            className="rounded-sm border w-full p-4 px-3 md:px-6 focus-within:shadow-sm
                                grid grid-cols-12 gap-2 overflow-hidden">
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                    <Input
                                        className={cn("border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent", montserrat.className)}
                                        disabled={isLoading} 
                                        placeholder="" 
                                        {...field}
                                    />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                            <div className={cn("col-span-12 lg:col-span-2 w-full flex flex-wrap gap-1 md:gap-2", montserrat.className)}>

                                 <button
                                    type="submit" 
                                    className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
                                >
                                    G
                                </button>

                                <button
                                    onClick={form.handleSubmit(claudeVerify)}
                                    className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
                                >
                                    CL
                                </button>

                                 <button
                                    onClick={form.handleSubmit(openaiVerify)}
                                    className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                                >
                                    OAI
                                </button>

                                <button
                                    onClick={form.handleSubmit(onClear)}
                                    className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-medium transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>

                            </div>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {!isLoading && geminiResult !== '' && (
                        <div className="flex flex-col gap-y-4">
                            <p className={cn("text-xl text-blue-500", requestResult.className)}>Gemini Results</p>
                            <Markdown text={geminiResult} />
                            <Separator />
                        </div>
                    )}
                    {!isLoading && geminiResult !== '' && (
                        <div className="flex flex-col gap-y-4">
                            <p className={cn("text-sm text-blue-500", kanit.className)}>Correct Gemini</p>
                            <div className="flex flex-col gap-y-4">
                                <div 
                                    key={geminiCorrected} 
                                    className={cn("p-8 w-full flex items-start gap-x-8 rounded-sm", "bg-violet-50 border border-black/10 shadow-sm", montserrat.className)}>
                                    <p className="text-sm">
                                        {geminiCorrected}
                                    </p>
                                    <span style={{ marginLeft: 'auto' }}>
                                        <CopyIcon result={geminiCorrected} />
                                    </span>
                                </div>
                            </div>
                            {/* <p className={cn("text-sm text-blue-500", kanit.className)}>Varieties Gemini</p>
                            <div className="flex flex-col gap-y-4">
                                {geminiResultList.slice(1)
                                .map(res => removeNumberedPrefix(res))
                                .map(gresult => (
                                    <div 
                                        key={gresult} 
                                        className={cn("p-8 w-full flex items-start gap-x-8 rounded-sm", "bg-violet-50 border border-black/10 shadow-sm", montserrat.className)}>
                                        <p className="text-sm">
                                            {gresult}
                                        </p>
                                        <span style={{ marginLeft: 'auto' }}>
                                            <CopyIcon result={gresult} />
                                        </span>
                                    </div>
                                ))}
                            </div> */}
                            <Separator />
                        </div>
                    )}

                    {!isLoading && claudeResult !== '' && (
                        <div className="flex flex-col gap-y-4">
                            <p className={cn("text-xl text-amber-700", requestResult.className)}>Claude Results</p>
                            <Markdown text={claudeResult} />
                            <Separator />
                        </div>
                    )}

                </div>                   
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-sm w-full flex items-center justify-center bg-white">
                            <Loader />
                        </div>
                    )}
                    {!isLoading && result !== '' && (
                        <div className="flex flex-col gap-y-4">
                             {result === '' ? <></> : <p className={cn("text-sm text-blue-500", kanit.className)}>Correct OpenAI</p>}      
                            <div className={cn("p-8 w-full flex items-start gap-x-8 rounded-sm", "bg-emerald-50 border border-black/10 shadow-bg", montserrat.className)}>
                                <p className="text-sm">
                                    {result}
                                </p>
                                <span style={{ marginLeft: 'auto' }}>
                                    <CopyIcon result={result} />
                                </span>
                            </div>
                            {result === '' ? <></> : <p className={cn("text-sm text-blue-500", kanit.className)}>Varieties OpenAI</p>}  
                            {rephrases.map(rephrase => (
                                <div 
                                    key={rephrase} 
                                    className={cn("p-8 w-full flex items-start gap-x-8 rounded-sm", "bg-emerald-50 border border-black/10 shadow-sm", montserrat.className)}>
                                    <p className="text-sm">
                                        {rephrase}
                                    </p>
                                    <span style={{ marginLeft: 'auto' }}>
                                        <CopyIcon result={rephrase} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default ConversationPage