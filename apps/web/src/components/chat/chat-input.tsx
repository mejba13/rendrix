'use client';

import * as React from 'react';
import { Send, Paperclip, Smile, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  placeholder = 'Type your message...',
  maxLength = 1000,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  React.useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSubmit = React.useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="relative">
      {/* Input Container */}
      <div
        className={cn(
          'relative rounded-2xl transition-all duration-200',
          'bg-white/[0.04] border',
          isFocused
            ? 'border-primary/50 shadow-[0_0_0_4px_rgba(255,145,0,0.1)]'
            : 'border-white/[0.08] hover:border-white/[0.12]'
        )}
      >
        {/* Textarea */}
        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 bg-transparent text-sm text-white placeholder:text-white/30',
              'resize-none outline-none min-h-[24px] max-h-[120px]',
              'scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Attachment Button */}
            <button
              type="button"
              className="p-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Emoji Button */}
            <button
              type="button"
              className="p-2 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
              title="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim() || disabled || isOverLimit}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-200',
                value.trim() && !isOverLimit
                  ? 'bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/25'
                  : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
              )}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Character Counter */}
        {isNearLimit && (
          <div className="absolute -top-6 right-3 animate-fade-in">
            <span
              className={cn(
                'text-xs font-medium',
                isOverLimit ? 'text-red-400' : 'text-white/40'
              )}
            >
              {characterCount}/{maxLength}
            </span>
          </div>
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-white/25">
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] font-mono">
          <Command className="w-2.5 h-2.5" />
          <span>Enter</span>
        </kbd>
        <span>to send</span>
        <span className="mx-1">•</span>
        <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] font-mono">
          <span>Shift</span>
          <span>+</span>
          <span>Enter</span>
        </kbd>
        <span>for new line</span>
      </div>
    </div>
  );
}

// Compact variant for minimized state
export function ChatInputCompact({
  onFocus,
}: {
  onFocus: () => void;
}) {
  return (
    <button
      onClick={onFocus}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
        <Send className="w-4 h-4 text-black" />
      </div>
      <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
        Ask Rendrix Assistant...
      </span>
    </button>
  );
}
