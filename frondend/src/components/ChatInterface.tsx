import { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Trash2,
  Sparkles,
  Code,
  FileText,
} from "lucide-react";
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
}

const SUGGESTED_TASKS = [
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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("value-a");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // 🔗 BACKEND CALL (replace later)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Response from LLM using ${model}`,
        },
      ]);
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b px-6 flex items-center gap-4">
        <span className="text-sm font-medium">
          Master Identity (ID) Store
        </span>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value-a">Value A</SelectItem>
            <SelectItem value="value-b">Value B</SelectItem>
            <SelectItem value="value-c">Value C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <EmptyState onSelect={(t) => setInput(`Help me ${t}`)} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </AnimatePresence>

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full min-h-[56px] max-h-32 resize-none rounded-xl border px-4 py-3 focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <div className="flex gap-2 mt-3">
            <Button onClick={sendMessage} disabled={loading}>
              <Send className="w-4 h-4 mr-1" /> Submit
            </Button>
            <Button variant="outline" onClick={() => setLoading(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={() => setMessages([])}
              disabled={!messages.length}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function MessageBubble({ message }: { message: Message }) {
  const user = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${user ? "justify-end" : ""}`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
          user
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : "bg-muted rounded-tl-md"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300" />
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (t: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <Sparkles className="text-primary w-6 h-6" />
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        How can I help you today?
      </h2>
      <p className="text-muted-foreground mb-8">
        Choose a suggested task or start typing your question
      </p>

      <div className="grid sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {SUGGESTED_TASKS.map((t) => (
          <button
            key={t.title}
            onClick={() => onSelect(t.title.toLowerCase())}
            className="border rounded-xl p-4 text-left hover:bg-accent transition"
          >
            <t.icon className="w-5 h-5 text-primary mb-2" />
            <div className="font-medium">{t.title}</div>
            <div className="text-xs text-muted-foreground">
              {t.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
