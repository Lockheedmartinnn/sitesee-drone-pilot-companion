import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, X, Send, Loader2, ThumbsUp, ThumbsDown, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// Training Copilot chat.
// Answers come from the askCopilot backend function, which replies only from
// the SiteSee pilot guidance (KnowledgeArticle) and returns the sources it used.

const STARTERS = [
  'What are the camera settings?',
  'How long do I stabilise GPS for?',
  'What do I do on a battery swap?',
  'Where do I put the GCPs?',
];

const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="ml-4 mb-2 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="ml-4 mb-2 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-blue-300 break-all">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-slate-700 text-blue-300 text-xs">{children}</code>
  ),
};

export default function ChatWidget({ isOpen: externalIsOpen, onClose }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onClose ? (val) => !val && onClose() : setInternalIsOpen;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const sessionStarted = useRef(false);
  const messagesEndRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Usage tracking (feeds the analytics pages). Never blocks the chat.
  const trackFeatureUsage = async (action = 'tool_use', metadata = null) => {
    try {
      await base44.entities.FeatureUsage.create({
        user_email: user?.email,
        pilot_id: user?.pilot_id,
        company: user?.company,
        feature_name: 'chatbot',
        action_type: action,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  };

  useEffect(() => {
    if (!isOpen || !user || sessionStarted.current) return;
    sessionStarted.current = true;
    trackFeatureUsage('tool_use', { action: 'chat_opened' });
    base44.entities.ChatbotSession.create({
      user_email: user.email,
      pilot_id: user.pilot_id,
      company: user.company,
      session_started_at: new Date().toISOString(),
    })
      .then((session) => setSessionId(session.id))
      .catch((error) => console.error('Failed to create chat session:', error));
  }, [isOpen, user]);

  const logMessage = (type, content) => {
    if (!sessionId || !user || !content) return;
    base44.entities.ChatbotMessage.create({
      session_id: sessionId,
      user_email: user.email,
      message_type: type,
      message_content: content,
      message_timestamp: new Date().toISOString(),
      had_image_attachment: false,
    }).catch((error) => console.error('Failed to log chat message:', error));
  };

  const send = async (text) => {
    const question = (text || '').trim();
    if (!question || isLoading) return;

    const history = messages.filter((m) => !m.isError).map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setIsLoading(true);
    logMessage('user', question);

    try {
      const res = await base44.functions.invoke('askCopilot', {
        question,
        history,
        page: window.location.pathname + window.location.search,
      });
      const data = res?.data ?? res;
      if (!data || data.error || !data.answer) throw new Error(data?.error || 'No answer returned');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          sources: data.sources || [],
          followUps: data.follow_ups || [],
          logId: data.log_id || null,
        },
      ]);
      logMessage('assistant', data.answer);
    } catch (error) {
      console.error('Failed to get an answer:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong while getting an answer. Please try again.', isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedback = async (index, helpful) => {
    const message = messages[index];
    if (!message?.logId || message.helpful === helpful) return;
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, helpful } : m)));
    try {
      await base44.entities.AssistantQuestion.update(message.logId, { helpful });
    } catch (error) {
      // Feedback is best-effort.
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  // Close out the session record when the widget unmounts.
  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const countRef = useRef(0);
  countRef.current = userMessageCount;
  useEffect(() => {
    return () => {
      if (sessionId) {
        base44.entities.ChatbotSession.update(sessionId, {
          session_ended_at: new Date().toISOString(),
          total_messages: countRef.current,
        }).catch((err) => console.error('Failed to update session:', err));
      }
    };
  }, [sessionId]);

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
              aria-label="Open Training Copilot"
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
            role="dialog"
            aria-label="Training Copilot"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
            style={{ width: 'min(24rem, calc(100vw - 2rem))', height: 'min(600px, calc(100vh - 6rem))' }}
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">Training Copilot</h3>
                  <p className="text-xs text-slate-400">Answers from the SiteSee capture guidance</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close Training Copilot"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="py-4">
                  <p className="text-sm text-slate-300 font-semibold mb-1">Ask about flying and capture</p>
                  <p className="text-xs text-slate-500 mb-4">
                    Camera settings, GPS stabilisation, mission setup, battery swaps and troubleshooting. Every answer
                    shows the guidance it came from. For the NexDT platform, use the NexDT Academy assistant.
                  </p>
                  <div className="space-y-2">
                    {STARTERS.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="block w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) =>
                msg.role === 'user' ? (
                  <div key={idx} className="flex justify-end">
                    <div className="rounded-2xl px-4 py-2 max-w-[85%] bg-blue-500 text-white">
                      <p className="text-sm break-words">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="max-w-[92%]">
                    <div className="rounded-2xl px-4 py-2 bg-slate-800 text-slate-200 text-sm break-words">
                      <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
                    </div>

                    {msg.sources?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">Sources</div>
                        {msg.sources.map((s) => {
                          const inner = (
                            <>
                              <span className="flex-shrink-0">[{s.n}]</span>
                              <span className="flex-1">{s.title}</span>
                            </>
                          );
                          if (s.url && s.url.startsWith('/')) {
                            return (
                              <Link
                                key={s.n}
                                to={s.url}
                                onClick={() => setIsOpen(false)}
                                className="flex items-start gap-1.5 text-xs text-blue-300 hover:underline"
                              >
                                {inner}
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              </Link>
                            );
                          }
                          if (s.url) {
                            return (
                              <a
                                key={s.n}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-1.5 text-xs text-blue-300 hover:underline"
                              >
                                {inner}
                                <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              </a>
                            );
                          }
                          return (
                            <div key={s.n} className="flex items-start gap-1.5 text-xs text-slate-400">
                              {inner}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {msg.followUps?.length > 0 && idx === messages.length - 1 && !isLoading && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.followUps.map((q) => (
                          <button
                            key={q}
                            onClick={() => send(q)}
                            className="px-2.5 py-1 rounded-full text-xs text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.logId && !msg.isError && (
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          onClick={() => sendFeedback(idx, true)}
                          aria-label="Helpful"
                          className={cn('p-1 rounded hover:bg-white/10', msg.helpful === true ? 'text-emerald-400' : 'text-slate-500')}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => sendFeedback(idx, false)}
                          aria-label="Not helpful"
                          className={cn('p-1 rounded hover:bg-white/10', msg.helpful === false ? 'text-red-400' : 'text-slate-500')}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ),
              )}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Checking the guidance...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={1000}
                  placeholder="Ask about capture techniques..."
                  aria-label="Your question"
                  className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => send(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                  size="icon"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-500">
                Follow the capture checklist on site. Open the linked source for critical steps.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
