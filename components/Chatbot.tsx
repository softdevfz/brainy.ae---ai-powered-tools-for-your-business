import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';
import { CHATBOT_SYSTEM_INSTRUCTION } from '../constants';

const ChatbotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (process.env.API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const chatInstance = ai.chats.create({
                    model: 'gemini-2.5-flash-preview-04-17',
                    history: [CHATBOT_SYSTEM_INSTRUCTION],
                });
                setChat(chatInstance);
            } catch (error) {
                console.error("Failed to initialize GoogleGenAI:", error);
            }
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setIsLoading(true);
            setTimeout(() => {
                setMessages([{
                    role: 'model',
                    parts: [{ text: "Hi there! I'm Brainy's AI assistant. Ask me about BrainyPOS or BrainyAccountant!" }]
                }]);
                setIsLoading(false);
            }, 1000);
        }
    }, [isOpen, messages.length]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0) {
                       newMessages[newMessages.length - 1].parts[0].text = modelResponse;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment." }] };
            setMessages(prev => {
                const newMessages = [...prev];
                if(newMessages[newMessages.length -1].role === 'model' && newMessages[newMessages.length-1].parts[0].text === ''){
                    newMessages[newMessages.length -1] = errorMessage;
                    return newMessages;
                }
                return [...newMessages, errorMessage];
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!process.env.API_KEY) {
        return null; // Don't render chatbot if no API key
    }

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Chat Window */}
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
                <div className="w-80 h-[28rem] bg-slate-800 rounded-xl shadow-2xl flex flex-col border border-slate-700">
                    <div className="flex justify-between items-center p-3 bg-slate-900/70 rounded-t-xl">
                        <h3 className="font-bold text-white">Brainy.ae Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><CloseIcon /></button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-end gap-2 justify-start">
                                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-slate-700 text-slate-200 rounded-bl-none">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-700">
                        <div className="flex items-center bg-slate-700 rounded-lg">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full bg-transparent p-2 text-slate-200 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !userInput.trim()} className="p-2 text-sky-400 disabled:text-slate-500 disabled:cursor-not-allowed hover:text-sky-300">
                                <SendIcon />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* FAB */}
            <button onClick={() => setIsOpen(!isOpen)} className={`bg-sky-500 hover:bg-sky-600 rounded-full p-4 shadow-lg transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <ChatbotIcon />
            </button>
        </div>
    );
};

export default Chatbot;