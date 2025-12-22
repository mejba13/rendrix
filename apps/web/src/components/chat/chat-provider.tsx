'use client';

import * as React from 'react';

// Types
export interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  quickReplies?: string[];
  links?: { title: string; url: string; description?: string }[];
}

interface ChatContextType {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  unreadCount: number;
  isTyping: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  sendMessage: (content: string) => void;
  clearUnread: () => void;
}

const ChatContext = React.createContext<ChatContextType | null>(null);

// Mock AI responses
const mockResponses: Record<string, { content: string; quickReplies?: string[]; links?: { title: string; url: string; description?: string }[] }> = {
  'how do i create a store': {
    content: "Creating a store with Rendrix is easy! Here's how:\n\n1. Go to your Dashboard\n2. Click \"Create your first store\" or the + button\n3. Choose your industry and template\n4. Customize your store settings\n5. Start adding products!\n\nWould you like me to guide you through any specific step?",
    quickReplies: ['Show me templates', 'Adding products', 'Store settings'],
  },
  'help with orders': {
    content: "I can help you manage your orders! Here are some common tasks:\n\n• **View Orders**: Go to Dashboard → Orders\n• **Process Orders**: Click on any order to update its status\n• **Track Shipments**: Add tracking info in the order details\n• **Handle Returns**: Use the refund option in order actions\n\nWhat specifically do you need help with?",
    quickReplies: ['Processing orders', 'Refunds', 'Shipping setup'],
  },
  'pricing plans': {
    content: "Rendrix offers flexible pricing for businesses of all sizes:\n\n🆓 **Free Plan**: Perfect for getting started\n• 1 store, 50 products, basic analytics\n\n⭐ **Pro Plan** ($29/mo): For growing businesses\n• 3 stores, unlimited products, advanced analytics\n\n🚀 **Enterprise**: Custom solutions\n• Unlimited everything, dedicated support",
    quickReplies: ['Compare plans', 'Start free trial', 'Contact sales'],
    links: [{ title: 'View Pricing', url: '/pricing', description: 'See all plan details' }],
  },
  'contact support': {
    content: "You can reach our support team through multiple channels:\n\n📧 **Email**: support@rendrix.com\n💬 **Live Chat**: Available 24/7 (that's me!)\n📚 **Help Center**: docs.rendrix.com\n\nFor urgent issues, our priority support line is available for Pro and Enterprise customers.",
    quickReplies: ['Submit a ticket', 'Help center', 'Account issues'],
  },
  default: {
    content: "I'm here to help you get the most out of Rendrix! I can assist you with:\n\n• Setting up your store\n• Managing products and orders\n• Understanding analytics\n• Account and billing questions\n\nWhat would you like to know?",
    quickReplies: ['Getting started', 'Help with orders', 'Pricing plans', 'Contact support'],
  },
};

// Get response based on user input
function getAIResponse(input: string): { content: string; quickReplies?: string[]; links?: { title: string; url: string; description?: string }[] } {
  const normalizedInput = input.toLowerCase().trim();

  for (const [key, response] of Object.entries(mockResponses)) {
    if (key !== 'default' && normalizedInput.includes(key)) {
      return response;
    }
  }

  // Check for keywords
  if (normalizedInput.includes('store') || normalizedInput.includes('create')) {
    return mockResponses['how do i create a store'];
  }
  if (normalizedInput.includes('order') || normalizedInput.includes('shipping')) {
    return mockResponses['help with orders'];
  }
  if (normalizedInput.includes('price') || normalizedInput.includes('plan') || normalizedInput.includes('cost')) {
    return mockResponses['pricing plans'];
  }
  if (normalizedInput.includes('support') || normalizedInput.includes('help') || normalizedInput.includes('contact')) {
    return mockResponses['contact support'];
  }

  return mockResponses.default;
}

// Initial welcome message
const welcomeMessage: ChatMessage = {
  id: 'welcome',
  type: 'bot',
  content: "👋 Hi there! I'm the Rendrix Assistant. I'm here to help you build and manage your online stores.\n\nHow can I help you today?",
  timestamp: new Date(),
  quickReplies: ['Create a store', 'Help with orders', 'Pricing plans', 'Contact support'],
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([welcomeMessage]);
  const [unreadCount, setUnreadCount] = React.useState(1);
  const [isTyping, setIsTyping] = React.useState(false);

  const openChat = React.useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  }, []);

  const closeChat = React.useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleChat = React.useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, openChat, closeChat]);

  const minimizeChat = React.useCallback(() => {
    setIsMinimized(true);
  }, []);

  const clearUnread = React.useCallback(() => {
    setUnreadCount(0);
  }, []);

  const sendMessage = React.useCallback((content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate typing
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const response = getAIResponse(content);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        quickReplies: response.quickReplies,
        links: response.links,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Update user message status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );

      // Add unread if chat is closed
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1000 + Math.random() * 1000);
  }, [isOpen]);

  const value = React.useMemo(
    () => ({
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
    }),
    [isOpen, isMinimized, messages, unreadCount, isTyping, openChat, closeChat, toggleChat, minimizeChat, sendMessage, clearUnread]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatWidget() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChatWidget must be used within a ChatProvider');
  }
  return context;
}
