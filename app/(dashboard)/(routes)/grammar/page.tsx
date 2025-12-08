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
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { Montserrat, Kanit, Outfit, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { CopyIcon } from '@/components/copy-icon'
import Markdown from "@/components/markdown";
import { Separator } from "@/components/ui/separator";
import ResultDisplay from "@/components/result-display";
import { Trash2, Sparkles, Zap, Brain } from "lucide-react";

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] })
const kanit = Kanit ({ weight: '100', subsets: ['latin']})
const requestResult = Kanit ({ weight: '500', subsets: ['latin']})
const outfit = Outfit ({ weight: '300', subsets: ['latin']})
const inter = Inter ({ weight: '300', subsets: ['latin']})
const plusJakartaSans = Plus_Jakarta_Sans ({ weight: '300', subsets: ['latin']})

const ConversationPage = () => {
    const router = useRouter();
    const proModal = useProModal();

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

    const [result, setResult] = useState('')
    const [rephrases, setRepharses] = useState<string[]>([])

    const [geminiResult, setGeminiResult] = useState('')

    const [geminiCorrected, setGeminiCorrected] = useState('')
    const [geminiImproved, setGeminiImproved] = useState('')
    const [geminiShortened, setGeminiShortened] = useState('')
    const [geminiRephrasedFriendly, setGeminiRephrasedFriendly] = useState('')
    const [geminiRephrasedFormal, setGeminiRephrasedFormal] = useState('')

    const [claudeCorrected, setClaudeCorrected] = useState('')
    const [claudeImproved, setClaudeImproved] = useState('')
    const [claudeShortened, setClaudeShortened] = useState('')
    const [claudeRephrasedFriendly, setClaudeRephrasedFriendly] = useState('')
    const [claudeRephrasedFormal, setClaudeRephrasedFormal] = useState('')


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

    // Function to parse grammar correction results from Claude and update React state
    const parseClaudeGrammarResult = (
        result: string,
        setClaudeCorrected: (value: string) => void,
        setClaudeImproved: (value: string) => void,
        setClaudeShortened: (value: string) => void,
        setClaudeRephrasedFriendly: (value: string) => void,
        setClaudeRephrasedFormal: (value: string) => void
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
            setClaudeCorrected(corrected);
            setClaudeImproved(improved);
            setClaudeShortened(shortened);
            setClaudeRephrasedFriendly(friendly);
            setClaudeRephrasedFormal(formal);

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
            setClaudeCorrected('');
            setClaudeImproved('');
            setClaudeShortened('');
            setClaudeRephrasedFriendly('');
            setClaudeRephrasedFormal('');
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

            parseClaudeGrammarResult(
                textContent,
                setClaudeCorrected,
                setClaudeImproved,
                setClaudeShortened,
                setClaudeRephrasedFriendly,
                setClaudeRephrasedFormal
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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            
            const response = await axios.post('/api/grammargemini', { messages: newMessages });

            setGeminiResult(response.data.content)

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
                <div className="w-full">
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)} 
                            className="relative rounded-2xl border border-slate-200 bg-white w-full p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Decorative gradient border effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-blue-500/10 -z-10 blur-xl" />
                            
                            <div className="grid grid-cols-12 gap-4">
                                {/* Input Field */}
                                <FormField
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem className="col-span-12 lg:col-span-9">
                                            <FormControl className="m-0 p-0">
                                                <div className="relative">
                                                    <Input
                                                        className={cn(
                                                            "h-14 px-5 text-base bg-slate-50/50 border-slate-200 rounded-xl",
                                                            "focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:border-purple-300",
                                                            "placeholder:text-slate-400 transition-all duration-200",
                                                            montserrat.className
                                                        )}
                                                        disabled={isLoading} 
                                                        placeholder="Enter your text here..." 
                                                        {...field}
                                                    />
                                                    {/* Input accent line */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Action Buttons */}
                                <div className={cn(
                                    "col-span-12 lg:col-span-3 flex flex-wrap gap-2 lg:justify-end items-center",
                                    montserrat.className
                                )}>
                                    {/* Gemini Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="group relative h-14 px-5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                                        <span className="relative flex items-center gap-2">
                                            <Sparkles size={18} />
                                        </span>
                                    </button>

                                    {/* Claude Button */}
                                    <button
                                        type="button"
                                        onClick={form.handleSubmit(claudeVerify)}
                                        disabled={isLoading}
                                        className="group relative h-14 px-5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                                        <span className="relative flex items-center gap-2">
                                            <Zap size={18} />
                                        </span>
                                    </button>

                                    {/* OpenAI Button */}
                                    <button
                                        type="button"
                                        onClick={form.handleSubmit(openaiVerify)}
                                        disabled={isLoading}
                                        className="group relative h-14 px-5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                                        <span className="relative flex items-center gap-2">
                                            <Brain size={18} />
                                        </span>
                                    </button>

                                    {/* Clear Button */}
                                    <button
                                        type="button"
                                        onClick={form.handleSubmit(onClear)}
                                        disabled={isLoading}
                                        className="group h-14 w-14 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow-md"
                                    >
                                        <Trash2 size={20} className="group-hover:scale-110 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-100 rounded-b-2xl overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-purple-500 via-amber-500 to-blue-500 animate-pulse" />
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {!isLoading && geminiResult !== '' && (
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl" />
                            
                            {/* Header */}
                            <div className="relative flex items-center gap-3 mb-5">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <h3 className={cn(
                                    "text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent",
                                    requestResult.className
                                )}>
                                    Gemini Results
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100/50 shadow-sm">
                                <Markdown text={geminiResult} />
                            </div>

                            {/* Decorative bottom accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                        </div>
                    )}
                    {!isLoading && geminiResult !== '' && (
                        <div className="flex flex-col gap-y-4">
                           <ResultDisplay
                                title="Correct Gemini"
                                content={geminiCorrected}
                                headerFont={outfit}
                                contentFont={plusJakartaSans}
                            />
                            
                            <ResultDisplay
                                title="Improved Gemini"
                                content={geminiImproved}
                                headerFont={outfit}
                                contentFont={plusJakartaSans}
                            />
                            
                            <ResultDisplay
                                title="Shortened Gemini"
                                content={geminiShortened}
                                headerFont={outfit}
                                contentFont={plusJakartaSans}
                            />
                            
                            <ResultDisplay
                                title="Friendly Gemini"
                                content={geminiRephrasedFriendly}
                                headerFont={outfit}
                                contentFont={plusJakartaSans}
                            />
                            
                            <ResultDisplay
                                title="Formal Gemini"
                                content={geminiRephrasedFormal}
                                headerFont={outfit}
                                contentFont={plusJakartaSans}
                            />
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

                    {!isLoading && claudeResult !== '' && (
                        <div className="flex flex-col gap-y-4">
                           <ResultDisplay
                                title="Correct Claude"
                                content={claudeCorrected}
                                headerFont={kanit}
                                contentFont={montserrat}
                            />
                            
                            <ResultDisplay
                                title="Improved Claude"
                                content={claudeImproved}
                                headerFont={kanit}
                                contentFont={montserrat}
                            />
                            
                            <ResultDisplay
                                title="Shortened Claude"
                                content={claudeShortened}
                                headerFont={kanit}
                                contentFont={montserrat}
                            />
                            
                            <ResultDisplay
                                title="Friendly Claude"
                                content={claudeRephrasedFriendly}
                                headerFont={kanit}
                                contentFont={montserrat}
                            />
                            
                            <ResultDisplay
                                title="Formal Claude"
                                content={claudeRephrasedFormal}
                                headerFont={kanit}
                                contentFont={montserrat}
                            />
                            <Separator />
                        </div>
                    )}

                </div>                   
                <div className="space-y-4 mt-4">
                    {isLoading && (
                    <div className="relative p-12 rounded-2xl w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-100 shadow-lg overflow-hidden">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        </div>
                        
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