"use client";

import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import { MessageSquare } from "lucide-react";
import { Heading } from "@/components/heading";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { useProModal } from "@/hooks/use-pro-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Montserrat } from 'next/font/google';
import Markdown from "@/components/markdown";

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });

const ConversationPage = () => {
    const router = useRouter();
    const proModal = useProModal();

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          prompt: ""
        }
      });

    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            
            const response = await axios.post('/api/conversation', { messages: newMessages });
            setMessages((current) => [...current, userMessage, response.data]);
            
            form.reset();
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

    return (
        <div>
            <Heading
                title="Conversation"
                description="The most advanced conversation model."
                icon={MessageSquare}
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
                         {/* <Button 
                            variant='claude' 
                            className={cn("col-span-12 lg:col-span-2 w-full", montserrat.className)} 
                            type="submit" 
                            disabled={isLoading} size="icon"
                        >
                            Claude
                        </Button>  */}
                        <Button 
                            variant='gemini' 
                            className={cn("col-span-12 lg:col-span-2 w-full", montserrat.className)} 
                            type="submit"
                            disabled={isLoading} size="icon"
                        >
                            Gemini
                        </Button>   
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-sm w-full flex items-center justify-center bg-white">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="" />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                        <div 
                            key={message.content} 
                            className={cn(
                            "p-8 w-full flex items-start gap-x-8 rounded-sm",
                            message.role === "user" ? "bg-white border border-black/10 shadow-sm" : "bg-slate-100 border border-black/10 shadow-sm", montserrat.className
                            )}
                        >
                            {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                            <p className="text-sm">
                                {/* {message.content} */}
                                <Markdown text={message.content ? message.content : ""} />
                            </p>
                        </div>
                        ))}
                    </div>
                    </div>
            </div>
        </div>
    )
}

export default ConversationPage