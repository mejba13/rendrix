'use client';

import * as React from 'react';
import {
  MessageCircle,
  X,
  Minus,
  Maximize2,
  Store,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatWidget } from './chat-provider';
import { ChatMessage, TypingIndicator, DateSeparator } from './chat-message';
import { ChatInput } from './chat-input';
import { QuickActions } from './quick-actions';

// Floating Chat Button
function ChatButton({
  onClick,
  unreadCount,
  isOpen,
}: {
  onClick: () => void;
  unreadCount: number;
  isOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-14 h-14 rounded-full transition-all duration-300',
        'bg-gradient-to-br from-primary to-orange-600',
        'shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40',
        'hover:scale-105 active:scale-95',
        isOpen && 'rotate-90 scale-90 opacity-0 pointer-events-none'
      )}
      aria-label="Open chat"
    >
      {/* Pulse Animation Ring */}
      {unreadCount > 0 && !isOpen && (
        <>
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
        </>
      )}

      {/* Icon */}
      <MessageCircle className="w-6 h-6 text-black mx-auto" />

      {/* Unread Badge */}
      {unreadCount > 0 && !isOpen && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-bounce">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}

      {/* Hover Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
        Need help?
      </span>
    </button>
  );
}

// Chat Window Header
function ChatHeader({
  onMinimize,
  onClose,
}: {
  onMinimize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative px-4 py-4 border-b border-white/[0.06] bg-gradient-to-r from-white/[0.02] to-transparent">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,145,0,0.1),transparent_70%)]" />
      </div>

      <div className="relative flex items-center justify-between">
        {/* Bot Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Store className="w-5 h-5 text-black" />
            </div>
            {/* Online Indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Rendrix Assistant
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online now
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Chat Widget Component
export function ChatWidget() {
  const {
    isOpen,
    isMinimized,
    messages,
    unreadCount,
    isTyping,
    openChat,
    closeChat,
    toggleChat,
    minimizeChat,
    sendMessage,
    clearUnread,
  } = useChatWidget();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = React.useState(true);

  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Clear unread when chat opens
  React.useEffect(() => {
    if (isOpen) {
      clearUnread();
    }
  }, [isOpen, clearUnread]);

  // Hide quick actions after first message sent
  React.useEffect(() => {
    if (messages.length > 1) {
      setShowQuickActions(false);
    }
  }, [messages.length]);

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      <div
        className={cn(
          'flex flex-col w-[400px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden transition-all duration-300',
          'bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08]',
          'shadow-2xl shadow-black/50',
          isOpen && !isMinimized
            ? 'h-[680px] max-h-[calc(100vh-100px)] opacity-100 translate-y-0 scale-100'
            : 'h-0 opacity-0 translate-y-4 scale-95 pointer-events-none'
        )}
        style={{
          boxShadow: isOpen
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : undefined,
        }}
      >
        {/* Noise Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Header */}
        <ChatHeader onMinimize={minimizeChat} onClose={closeChat} />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Welcome Quick Actions */}
          {showQuickActions && messages.length === 1 && (
            <div className="mb-4">
              <QuickActions onSelect={handleQuickReply} variant="grid" />
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => {
            const showDateSeparator =
              index === 0 ||
              message.timestamp.toDateString() !==
                messages[index - 1].timestamp.toDateString();

            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && (
                  <DateSeparator date={message.timestamp} />
                )}
                <ChatMessage message={message} onQuickReply={handleQuickReply} />
              </React.Fragment>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions Bar (after conversation started) */}
        {!showQuickActions && messages.length > 1 && (
          <div className="px-4 py-2 border-t border-white/[0.04]">
            <QuickActions onSelect={handleQuickReply} variant="horizontal" />
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.06] bg-gradient-to-t from-white/[0.02] to-transparent">
          <ChatInput
            onSend={sendMessage}
            placeholder="Ask me anything..."
            disabled={isTyping}
          />
        </div>
      </div>

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <button
          onClick={openChat}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl transition-all hover:border-primary/30 group"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <Store className="w-4 h-4 text-black" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
              Rendrix Assistant
            </p>
            <p className="text-xs text-white/40">Click to expand</p>
          </div>
          <Maximize2 className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
        </button>
      )}

      {/* Floating Button */}
      <ChatButton
        onClick={toggleChat}
        unreadCount={unreadCount}
        isOpen={isOpen}
      />
    </div>
  );
}

// Export for external use
export { ChatButton };
