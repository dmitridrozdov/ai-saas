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

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
const kanit = Kanit ({ weight: '100', subsets: ['latin']});

const ConversationPage = () => {
    const router = useRouter();
    const proModal = useProModal();

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
    const [result, setResult] = useState('')
    const [rephrases, setRepharses] = useState<string[]>([]);

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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            
            const response = await axios.post('/api/grammargemini', { messages: newMessages });

            console.log(response.data.content)

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
                                grid grid-cols-12 gap-2">
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
                        <div className={cn("col-span-12 lg:col-span-2 w-full flex", montserrat.className)} >
                            <Button variant = 'verify' type="submit" disabled={isLoading} size="icon" className="flex-grow mr-1">
                                Gemini
                            </Button>
                            <Button variant = 'openai' onClick={form.handleSubmit(openaiVerify)} disabled={isLoading} size="icon" className="flex-grow mr-1">
                                OpenAI
                            </Button> 
                            <Button variant='clear' onClick={form.handleSubmit(onClear)} disabled={isLoading} size="icon" className="flex-grow ml-2">
                                Clear
                            </Button>   
                        </div>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-sm w-full flex items-center justify-center bg-white">
                            <Loader />
                        </div>
                    )}
                    {!isLoading && result !== '' && (
                        <div className="flex flex-col gap-y-4">
                             {result === '' ? <></> : <p className={cn("text-sm text-blue-500", kanit.className)}>Correct</p>}      
                            <div className={cn("p-8 w-full flex items-start gap-x-8 rounded-sm", "bg-slate-100 border border-black/10 shadow-sm", montserrat.className)}>
                                <p className="text-sm">
                                    {result}
                                </p>
                                <span style={{ marginLeft: 'auto' }}>
                                    <CopyIcon result={result} />
                                </span>
                            </div>
                            {result === '' ? <></> : <p className={cn("text-sm text-blue-500", kanit.className)}>Varieties</p>}  
                            {rephrases.map(rephrase => (
                                <div 
                                    key={rephrase} 
                                    className={cn("p-8 w-full flex items-start gap-x-8 rounded-sm", "bg-slate-100 border border-black/10 shadow-sm", montserrat.className)}>
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