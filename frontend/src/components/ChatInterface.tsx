import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef, useEffect } from "react";
import { Send, X, Trash2, ChevronDown, Sparkles, Code, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onNewChat: () => void;
}

const suggestedTasks = [
  {
    icon: Sparkles,
    title: "Generate Ideas",
    description: "Brainstorm creative solutions for your project",
  },
  {
    icon: Code,
    title: "Code Assistance",
    description: "Get help with coding and debugging",
  },
  {
    icon: FileText,
    title: "Write Content",
    description: "Create documentation, emails, or articles",
  },
];

const ChatInterface = ({ onNewChat }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("value-a");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Send message to backend API
    try {
      const resp = await fetch("https://ai-chatbot-86bo.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!resp.ok) {
        throw new Error(`Request failed with status ${resp.status}`);
      }

      const data = await resp.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response ?? "(no response)",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${err?.message ?? String(err)}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsLoading(false);
  };

  const handleClear = () => {
    setMessages([]);
    onNewChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestedTask = (task: typeof suggestedTasks[0]) => {
    setInputValue(`Help me ${task.title.toLowerCase()}`);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-border px-6 flex items-center gap-4">
        <h1 className="text-sm font-medium text-foreground">Master Identity (ID) Store</h1>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-40 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value-a">Value A</SelectItem>
            <SelectItem value="value-b">Value B</SelectItem>
            <SelectItem value="value-c">Value C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chat Canvas */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <EmptyState onSelectTask={handleSuggestedTask} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="bg-chat-ai text-chat-ai-foreground rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full min-h-[56px] max-h-32 px-4 py-4 pr-12 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              rows={1}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Submit
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={!isLoading}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={handleClear}
              disabled={messages.length === 0}
              className="gap-2 text-muted-foreground"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-primary" : "bg-secondary"
        }`}
      >
        {isUser ? (
          <span className="text-primary-foreground text-xs font-medium">MC</span>
        ) : (
          <Sparkles className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
            <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
            : "bg-chat-ai text-chat-ai-foreground rounded-tl-md"
        }`}
      >
        {/* Markdown Renderer with Tailwind Prose styling */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className={`prose prose-sm max-w-none break-words ${
            isUser 
              ? "prose-invert text-chat-user-foreground" 
              : "text-chat-ai-foreground"
          } 
          /* This target specific markdown elements to ensure they look good in chat bubbles */
          prose-p:leading-relaxed prose-p:my-2
          prose-table:my-4 prose-table:border-collapse
          prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:p-2 prose-th:text-left
          prose-td:border prose-td:border-border prose-td:p-2 prose-td:align-top
          prose-ul:my-2 prose-li:my-0`}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

interface EmptyStateProps {
  onSelectTask: (task: typeof suggestedTasks[0]) => void;
}

const EmptyState = ({ onSelectTask }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        How can I help you today?
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Choose a suggested task or start typing your question
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {suggestedTasks.map((task, index) => (
          <motion.button
            key={task.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTask(task)}
            className="flex flex-col items-start p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
              <task.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-foreground mb-1">{task.title}</h3>
            <p className="text-xs text-muted-foreground">{task.description}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ChatInterface;
