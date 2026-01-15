import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, LogOut, Settings, Trash2, Pin, MessageSquarePlus, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { uploadPdf, askQuestion, getDocuments, deleteDocument } from '@/lib/api';
import { ChatInterface } from '@/components/ChatInterface';
import { Logo } from '@/components/Logo';
import { UserAvatar } from '@/components/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  documentId: number | null;
  isPinned: boolean;
  timestamp: Date;
}

interface Document {
  id: number;
  filename: string;
  file_path: string;
  upload_time: string;
  isPinned?: boolean;
}

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [settingsRotating, setSettingsRotating] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('pdf_quest_chats');
    const userId = user?.id || localStorage.getItem('pdf_quest_user');
    
    if (saved && userId) {
      try {
        const parsed = JSON.parse(saved) as ChatSession[];
        return parsed.map((chat) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      } catch {
        // If parsing fails, return default
        return [{
          id: 'default',
          title: 'New Chat',
          messages: [{
            id: 1,
            type: 'ai',
            content: "Hi! Upload a PDF document and ask me questions about it.",
            timestamp: new Date()
          }],
          documentId: null,
          isPinned: false,
          timestamp: new Date()
        }];
      }
    }
    
    // Default welcome message for new users
    return [{
      id: 'default',
      title: 'New Chat',
      messages: [{
        id: 1,
        type: 'ai',
        content: "Hi! Upload a PDF document and ask me questions about it.",
        timestamp: new Date()
      }],
      documentId: null,
      isPinned: false,
      timestamp: new Date()
    }];
  });
  const [activeChatId, setActiveChatId] = useState('default');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('pdf_quest_chats', JSON.stringify(chatSessions));
    }
  }, [chatSessions, user]);

  // Ensure we always have at least the welcome message
  useEffect(() => {
    if (chatSessions.length === 0 || (chatSessions.length === 1 && chatSessions[0].messages.length === 0)) {
      setChatSessions([{
        id: 'default',
        title: 'New Chat',
        messages: [{
          id: 1,
          type: 'ai',
          content: "Hi! Upload a PDF document and ask me questions about it.",
          timestamp: new Date()
        }],
        documentId: null,
        isPinned: false,
        timestamp: new Date()
      }]);
      setActiveChatId('default');
    }
  }, []); // Run only once on mount

  const activeChat = chatSessions.find(chat => chat.id === activeChatId);
  const messages = activeChat?.messages || [{
    id: 1,
    type: 'ai' as const,
    content: "Hi! Upload a PDF document and ask me questions about it.",
    timestamp: new Date()
  }];

  // Helper function to update messages in active chat
  const updateChatMessages = (updater: (messages: Message[]) => Message[]) => {
    setChatSessions(prev => prev.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: updater(chat.messages) }
        : chat
    ));
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only re-run when user changes

  const fetchDocuments = async () => {
    try {
      const docs = await getDocuments(user?.id);
      // Load pinned state from localStorage
      const pinnedDocs = JSON.parse(localStorage.getItem('pinned_documents') || '[]');
      const docsWithPinned = docs.map((doc: Document) => ({
        ...doc,
        isPinned: pinnedDocs.includes(doc.id)
      }));
      setDocuments(docsWithPinned);
      if (docsWithPinned.length > 0 && !activeDocumentId) {
        setActiveDocumentId(docsWithPinned[0].id);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      for (const file of pdfFiles) {
        const result = await uploadPdf(file, user?.id);
        await fetchDocuments();
        
        if (result.document && result.document.id) {
          setActiveDocumentId(result.document.id);
        }
        
        const newMessage: Message = {
          id: messages.length + 1,
          type: 'ai',
          content: `I've processed your document "${file.name}". You can now ask me questions about it.`,
          timestamp: new Date()
        };
        updateChatMessages(prev => [...prev, newMessage]);
      }
      
      toast({
        title: "Upload successful",
        description: "Your PDF has been processed.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeDocumentId) {
      toast({
        title: "No document selected",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content,
      timestamp: new Date()
    };
    updateChatMessages(prev => [...prev, userMessage]);
    
    // Update chat title with first user message
    if (activeChat && activeChat.title === 'New Chat' && activeChat.messages.length <= 1) {
      const title = content.length > 40 ? content.substring(0, 40) + '...' : content;
      setChatSessions(prev => prev.map(chat =>
        chat.id === activeChatId ? { ...chat, title } : chat
      ));
    }
    
    setIsLoading(true);
    
    try {
      const loadingId = messages.length + 2;
      const loadingMessage: Message = {
        id: loadingId,
        type: 'ai',
        content: "Thinking...",
        timestamp: new Date()
      };
      updateChatMessages(prev => [...prev, loadingMessage]);
      
      const result = await askQuestion(activeDocumentId, content);
      
      updateChatMessages(prev => 
        prev.map(msg => 
          msg.id === loadingId 
            ? { ...msg, content: result.answer } 
            : msg
        )
      );
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: "I'm sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date()
      };
      updateChatMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = (docId: number) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    setActiveDocumentId(docId);
    
    // Add welcome message for this document if it's a new selection
    if (activeDocumentId !== docId) {
      const welcomeMessage: Message = {
        id: messages.length + 1,
        type: 'ai',
        content: `Great! I'm ready to answer questions about "${doc.filename}". What would you like to know?`,
        timestamp: new Date()
      };
      updateChatMessages(prev => [...prev, welcomeMessage]);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [{
        id: 1,
        type: 'ai',
        content: "Hi! Upload a PDF document and ask me questions about it.",
        timestamp: new Date()
      }],
      documentId: activeDocumentId,
      isPinned: false,
      timestamp: new Date()
    };
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    toast({
      title: "New chat created",
      description: "Start a fresh conversation",
    });
  };

  const handleDeleteChat = (chatId: string) => {
    if (chatSessions.length === 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one chat",
        variant: "destructive",
      });
      return;
    }
    
    setChatSessions(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      if (activeChatId === chatId) {
        setActiveChatId(filtered[0].id);
      }
      return filtered;
    });
    
    toast({
      title: "Chat deleted",
      description: "The conversation has been removed",
    });
  };

  const handlePinChat = (chatId: string) => {
    setChatSessions(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
    
    const chat = chatSessions.find(c => c.id === chatId);
    toast({
      title: chat?.isPinned ? "Chat unpinned" : "Chat pinned",
      description: chat?.isPinned ? "Chat moved to regular list" : "Chat pinned to top",
    });
  };

  const handleEditMessage = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.type === 'user') {
      setEditingMessageId(messageId);
      setEditedContent(message.content);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !editedContent.trim()) return;
    
    // Update the message
    updateChatMessages(prev => prev.map(msg =>
      msg.id === editingMessageId ? { ...msg, content: editedContent } : msg
    ));
    
    // Re-send the edited question
    setEditingMessageId(null);
    setEditedContent('');
    
    // Get AI response for edited question
    if (activeDocumentId) {
      setIsLoading(true);
      try {
        const loadingId = messages.length + 1;
        const loadingMessage: Message = {
          id: loadingId,
          type: 'ai',
          content: "Thinking...",
          timestamp: new Date()
        };
        updateChatMessages(prev => [...prev, loadingMessage]);
        
        const result = await askQuestion(activeDocumentId, editedContent);
        
        updateChatMessages(prev => 
          prev.map(msg => 
            msg.id === loadingId 
              ? { ...msg, content: result.answer } 
              : msg
          )
        );
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to get an answer. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handlePinDocument = (docId: number) => {
    setDocuments(prev => {
      const updated = prev.map(doc =>
        doc.id === docId ? { ...doc, isPinned: !doc.isPinned } : doc
      );
      
      // Save pinned state to localStorage
      const pinnedIds = updated.filter(doc => doc.isPinned).map(doc => doc.id);
      localStorage.setItem('pinned_documents', JSON.stringify(pinnedIds));
      
      return updated;
    });
    
    const doc = documents.find(d => d.id === docId);
    toast({
      title: doc?.isPinned ? "Document unpinned" : "Document pinned",
      description: doc?.isPinned ? "Document moved to regular list" : "Document pinned to top",
    });
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      await deleteDocument(docId);
      
      // If the deleted document was active, switch to another one
      if (activeDocumentId === docId) {
        const remainingDocs = documents.filter(d => d.id !== docId);
        setActiveDocumentId(remainingDocs.length > 0 ? remainingDocs[0].id : null);
      }
      
      // Remove from pinned list if it was pinned
      const pinnedDocs = JSON.parse(localStorage.getItem('pinned_documents') || '[]');
      const updatedPinned = pinnedDocs.filter((id: number) => id !== docId);
      localStorage.setItem('pinned_documents', JSON.stringify(updatedPinned));
      
      await fetchDocuments();
      
      toast({
        title: "Document deleted",
        description: "The document has been removed from your library",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleSettingsClick = () => {
    if (settingsRotating) return; // Prevent multiple triggers
    setSettingsRotating(true);
    setTimeout(() => setSettingsRotating(false), 600);
  };

  // Sort chats: pinned first, then by timestamp
  const sortedChats = [...chatSessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  // Sort documents: pinned first, then by upload time
  const sortedDocuments = [...documents].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950/20 flex transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Sidebar */}
      <aside className="relative w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
          <Logo size="md" showText={true} />
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300"
          >
            <MessageSquarePlus className="w-5 h-5 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Chat History
            </h3>
            <div className="space-y-2">
              {sortedChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative p-3 rounded-xl transition-all duration-300 ${
                    activeChatId === chat.id
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200/50 dark:border-teal-800/50 shadow-lg shadow-teal-500/10'
                      : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border border-transparent hover:scale-105'
                  }`}
                >
                  <button
                    onClick={() => setActiveChatId(chat.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {chat.isPinned && (
                            <Pin className="w-3 h-3 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                          )}
                          <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                            activeChatId === chat.id ? 'text-teal-900 dark:text-teal-100' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {chat.title}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {chat.messages.length} messages
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinChat(chat.id);
                      }}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        chat.isPinned
                          ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title={chat.isPinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Your Documents
            </h3>
            <div className="space-y-2">
              {sortedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`group relative p-3 rounded-xl transition-all duration-300 ${
                    activeDocumentId === doc.id
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200/50 dark:border-teal-800/50 shadow-lg shadow-teal-500/10'
                      : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border border-transparent hover:scale-105'
                  }`}
                >
                  <button
                    onClick={() => handleDocumentSelect(doc.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start space-x-2 pr-16">
                      <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                        activeDocumentId === doc.id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {doc.isPinned && (
                            <Pin className="w-3 h-3 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                          )}
                          <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                            activeDocumentId === doc.id ? 'text-teal-900 dark:text-teal-100' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {doc.filename}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {new Date(doc.upload_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinDocument(doc.id);
                      }}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        doc.isPinned
                          ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title={doc.isPinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3 gap-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <UserAvatar name={user?.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || user?.email}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 hover:scale-105"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-8 py-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-emerald-800 dark:from-white dark:via-teal-200 dark:to-emerald-200 bg-clip-text text-transparent">
                Chat with your documents
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activeDocumentId ? `Chatting with: ${documents.find(d => d.id === activeDocumentId)?.filename}` : 'Upload a PDF to get started'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu onOpenChange={(open) => { if (open) handleSettingsClick(); }}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-700 border border-gray-200/50 dark:border-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Settings 
                      className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${settingsRotating ? 'settings-rotate' : ''}`}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/feedback')} className="cursor-pointer">
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    Feedback
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            isUploading={isUploading}
            editingMessageId={editingMessageId}
            editedContent={editedContent}
            onEditMessage={handleEditMessage}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onEditContentChange={setEditedContent}
            userName={user?.name}
          />
        </div>
      </main>
    </div>
  );
};
