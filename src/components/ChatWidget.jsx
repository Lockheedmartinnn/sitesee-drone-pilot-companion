import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, X, Send, Loader2, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function ChatWidget({ isOpen: externalIsOpen, onClose }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onClose ? (val) => !val && onClose() : setInternalIsOpen;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !conversation) {
      initConversation();
      // Track session start
      if (user) {
        trackFeatureUsage(user, 'tool_use', { action: 'chat_opened' });
      }
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!conversation) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [conversation]);

  const trackFeatureUsage = async (user, action = 'tool_use', metadata = null) => {
    try {
      await base44.entities.FeatureUsage.create({
        user_email: user?.email,
        pilot_id: user?.pilot_id,
        company: user?.company,
        feature_name: 'chatbot',
        action_type: action,
        metadata: metadata ? JSON.stringify(metadata) : null
      });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  };

  const initConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: 'SiteSeePilotCopilot',
        metadata: {
          name: 'Training Support Session',
          description: 'Pilot training assistance'
        }
      });
      setConversation(conv);

      // Create session record
      if (user) {
        const session = await base44.entities.ChatbotSession.create({
          user_email: user.email,
          pilot_id: user.pilot_id,
          company: user.company,
          session_started_at: new Date().toISOString(),
          conversation_id: conv.id
        });
        setSessionId(session.id);
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.file_url);
      setUploadedImages(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Failed to upload images:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (url) => {
    setUploadedImages(prev => prev.filter(img => img !== url));
  };

  const handleSend = async () => {
    if ((!input.trim() && uploadedImages.length === 0) || !conversation || isLoading) return;

    const userMessage = input.trim();
    const images = [...uploadedImages];
    setInput('');
    setUploadedImages([]);
    setIsLoading(true);

    try {
      const messageContent = images.length > 0 
        ? `${userMessage}\n\n[Images attached for analysis]`
        : userMessage;

      // Log user message
      if (sessionId && user) {
        await base44.entities.ChatbotMessage.create({
          session_id: sessionId,
          user_email: user.email,
          message_type: 'user',
          message_content: userMessage,
          message_timestamp: new Date().toISOString(),
          had_image_attachment: images.length > 0
        });
      }

      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: messageContent,
        attachments: images.length > 0 ? images.map(url => ({ type: 'image', url })) : undefined
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Track session end when unmounting
  useEffect(() => {
    return () => {
      if (sessionId && user) {
        base44.entities.ChatbotSession.update(sessionId, {
          session_ended_at: new Date().toISOString(),
          total_messages: messages.filter(m => m.role === 'user').length
        }).catch(err => console.error('Failed to update session:', err));
      }
    };
  }, [sessionId, messages, user]);

  return (
    <>
      {/* Floating Button - only show if not controlled externally */}
      <AnimatePresence>
        {!isOpen && externalIsOpen === undefined && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 shadow-2xl"
              size="icon"
            >
              <MessageCircle className="w-7 h-7" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Training Copilot</h3>
                  <p className="text-xs text-slate-400">Ask questions about best practices</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-slate-300 font-semibold mb-1">Training Copilot</p>
                  <p className="text-xs text-slate-500 mb-3">
                    Ask about capture best practices, GPS stabilization, camera settings, or troubleshooting tips.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <ImageIcon className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-300">You can upload images for analysis</span>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2 max-w-[80%]',
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-200'
                    )}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <ReactMarkdown
                        className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="ml-4 mb-2 list-disc">{children}</ul>,
                          ol: ({ children }) => <ol className="ml-4 mb-2 list-decimal">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                          code: ({ inline, children }) => (
                            inline ? (
                              <code className="px-1 py-0.5 rounded bg-slate-700 text-blue-300 text-xs">
                                {children}
                              </code>
                            ) : (
                              <code className="block p-2 rounded bg-slate-700 text-blue-300 text-xs my-2">
                                {children}
                              </code>
                            )
                          )
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl px-4 py-3">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {uploadedImages.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={url} 
                        alt={`Upload ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded border border-slate-600"
                      />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || !conversation || isUploading}
                  className="text-slate-400 hover:text-white"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about capture techniques..."
                  className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={isLoading || !conversation}
                />
                <Button
                  onClick={handleSend}
                  disabled={(!input.trim() && uploadedImages.length === 0) || isLoading || !conversation}
                  className="bg-blue-500 hover:bg-blue-600"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}