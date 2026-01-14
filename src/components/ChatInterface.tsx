import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  isUploading?: boolean;
  editingMessageId?: number | null;
  editedContent?: string;
  onEditMessage?: (messageId: number) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onEditContentChange?: (content: string) => void;
  userName?: string;
}

export const ChatInterface = ({ 
  messages, 
  onSendMessage,
  onFileUpload,
  isLoading = false,
  isUploading = false,
  editingMessageId,
  editedContent,
  onEditMessage,
  onSaveEdit,
  onCancelEdit,
  onEditContentChange,
  userName
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setLocalLoading(true);
    onSendMessage(content);
    
    setTimeout(() => {
      setLocalLoading(false);
    }, 500);
  };

  const showLoading = isLoading || localLoading;

  return (
    <div className="flex-1 flex flex-col w-full h-full relative">
      <div className="flex-1 overflow-y-auto scroll-smooth pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MessageBubble 
                  message={message}
                  isEditing={editingMessageId === message.id}
                  editedContent={editedContent}
                  onEdit={onEditMessage}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onEditContentChange={onEditContentChange}
                  userName={userName}
                />
              </div>
            ))}
            
            {showLoading && (
              <div className="animate-fade-in">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-gray-50 dark:via-gray-950 to-transparent pt-8 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onFileUpload={onFileUpload}
            disabled={isLoading}
            isUploading={isUploading}
          />
        </div>
      </div>
    </div>
  );
};
