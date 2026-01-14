import { useState } from 'react';
import { Send, Sparkles, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

export const ChatInput = ({ onSendMessage, onFileUpload, disabled = false, isUploading = false }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isSending && !disabled) {
      setIsSending(true);
      onSendMessage(inputValue);
      setInputValue('');
      
      setTimeout(() => {
        setIsSending(false);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center px-4 py-3">
          <Sparkles className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" />
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything about your document..."
            className="flex-1 resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm min-h-[24px] max-h-32"
            rows={1}
            disabled={isSending || disabled}
            aria-label="Type your message"
          />
          
          {/* Upload PDF Button */}
          {onFileUpload && (
            <label className="ml-2 flex-shrink-0 cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={onFileUpload}
                className="hidden"
                multiple
                disabled={isUploading}
              />
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                isUploading 
                  ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' 
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}>
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </div>
            </label>
          )}
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending || disabled}
            className="ml-2 flex-shrink-0 w-9 h-9 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </form>
  );
};
