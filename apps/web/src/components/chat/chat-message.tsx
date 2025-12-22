'use client';

import * as React from 'react';
import { Store, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './chat-provider';

interface ChatMessageProps {
  message: ChatMessageType;
  onQuickReply?: (reply: string) => void;
}

// Format timestamp
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Parse markdown-like formatting
function formatContent(content: string): React.ReactNode {
  const lines = content.split('\n');

  return lines.map((line, lineIndex) => {
    // Handle bullet points
    if (line.startsWith('• ') || line.startsWith('- ')) {
      const text = line.slice(2);
      return (
        <div key={lineIndex} className="flex items-start gap-2 my-1">
          <span className="text-primary mt-1.5">•</span>
          <span>{formatInlineStyles(text)}</span>
        </div>
      );
    }

    // Handle numbered lists
    const numberMatch = line.match(/^(\d+)\.\s/);
    if (numberMatch) {
      const text = line.slice(numberMatch[0].length);
      return (
        <div key={lineIndex} className="flex items-start gap-2 my-1">
          <span className="text-primary font-medium min-w-[1.25rem]">{numberMatch[1]}.</span>
          <span>{formatInlineStyles(text)}</span>
        </div>
      );
    }

    // Empty lines
    if (!line.trim()) {
      return <div key={lineIndex} className="h-2" />;
    }

    // Regular text
    return (
      <div key={lineIndex} className="my-0.5">
        {formatInlineStyles(line)}
      </div>
    );
  });
}

// Format inline styles (bold, emoji handling)
function formatInlineStyles(text: string): React.ReactNode {
  // Handle **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// Typing Indicator Component
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
        <Store className="w-4 h-4 text-black" />
      </div>

      {/* Typing dots */}
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.06] border border-white/[0.08]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// System Message Component
export function SystemMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-center my-4 animate-fade-in">
      <span className="px-3 py-1 text-xs text-white/40 bg-white/[0.04] rounded-full">
        {content}
      </span>
    </div>
  );
}

// Date Separator Component
export function DateSeparator({ date }: { date: Date }) {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  let label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (isToday) label = 'Today';
  if (isYesterday) label = 'Yesterday';

  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-xs text-white/30 font-medium">{label}</span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

// Main Chat Message Component
export function ChatMessage({ message, onQuickReply }: ChatMessageProps) {
  const isBot = message.type === 'bot';
  const isUser = message.type === 'user';

  if (message.type === 'system') {
    return <SystemMessage content={message.content} />;
  }

  return (
    <div
      className={`flex items-end gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}
      style={{ animationDuration: '300ms' }}
    >
      {/* Avatar for bot messages */}
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
          <Store className="w-4 h-4 text-black" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-primary text-black rounded-br-md'
              : 'bg-white/[0.06] text-white/80 rounded-bl-md border border-white/[0.08]'
          }`}
        >
          <div className={`text-sm leading-relaxed ${isUser ? 'text-black' : 'text-white/80'}`}>
            {formatContent(message.content)}
          </div>
        </div>

        {/* Links */}
        {message.links && message.links.length > 0 && (
          <div className="mt-2 space-y-2 w-full">
            {message.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                    {link.title}
                  </p>
                  {link.description && (
                    <p className="text-xs text-white/40 truncate">{link.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Quick Replies */}
        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply?.(reply)}
                className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp and Status */}
        <div className={`flex items-center gap-1.5 mt-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-white/30">{formatTime(message.timestamp)}</span>
          {isUser && message.status && (
            <span className="text-white/30">
              {message.status === 'sent' && <Check className="w-3 h-3" />}
              {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
              {message.status === 'read' && <CheckCheck className="w-3 h-3 text-primary" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
