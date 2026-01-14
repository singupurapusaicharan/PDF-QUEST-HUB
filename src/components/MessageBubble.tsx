import ReactMarkdown from 'react-markdown';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { UserAvatar } from './UserAvatar';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isEditing?: boolean;
  editedContent?: string;
  onEdit?: (messageId: number) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onEditContentChange?: (content: string) => void;
  userName?: string;
}

export const MessageBubble = ({ 
  message, 
  isEditing = false,
  editedContent = '',
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onEditContentChange,
  userName
}: MessageBubbleProps) => {
  return (
    <div className="flex items-start space-x-3">
      {/* Avatar */}
      <div className="w-8 h-8 flex-shrink-0">
        {message.type === 'user' ? (
          <UserAvatar name={userName} size="sm" />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className={`rounded-2xl p-4 relative group ${
          message.type === 'user'
            ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
        }`}>
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedContent}
                onChange={(e) => onEditContentChange?.(e.target.value)}
                className="min-h-[100px] resize-none bg-white dark:bg-gray-950 border-teal-200 dark:border-teal-800 focus:border-teal-500 dark:focus:border-teal-500"
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <Button
                  onClick={onSaveEdit}
                  size="sm"
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={onCancelEdit}
                  size="sm"
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {message.type === 'user' ? (
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : (
                <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold my-3 text-gray-900 dark:text-white" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2 text-gray-900 dark:text-white" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold my-2 text-gray-900 dark:text-white" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-800 dark:text-gray-200" {...props} />,
                      p: ({node, ...props}) => <p className="my-2 text-gray-800 dark:text-gray-200" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                      code: ({node, ...props}) => <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Edit button for user messages */}
              {message.type === 'user' && onEdit && (
                <button
                  onClick={() => onEdit(message.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Edit message"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
