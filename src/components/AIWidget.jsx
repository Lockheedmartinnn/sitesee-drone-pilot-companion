import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIWidget({ onOpen, lastMessage = null }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 border border-blue-500 shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-200" />
          <h3 className="font-semibold text-white">AI Flight Copilot</h3>
        </div>
        <Button
          onClick={onOpen}
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Open
        </Button>
      </div>
      {lastMessage ? (
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-xs text-blue-100 italic leading-relaxed">
            "{lastMessage}"
          </p>
        </div>
      ) : (
        <p className="text-sm text-blue-100">
          Get instant help with flight procedures, troubleshooting, and best practices.
        </p>
      )}
    </div>
  );
}