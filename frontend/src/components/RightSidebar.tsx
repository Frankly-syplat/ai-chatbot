import { MessageSquare, FileText, Clock, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AppSection } from "./LeftSidebar";

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  starred?: boolean;
}

interface RightSidebarProps {
  activeSection: AppSection;
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

const mockChatHistory: ChatHistory[] = [
  {
    id: "1",
    title: "API Integration Help",
    preview: "How do I connect to the REST API...",
    timestamp: "2 hours ago",
    starred: true,
  },
  {
    id: "2",
    title: "Data Analysis Query",
    preview: "Analyze the sales data from Q4...",
    timestamp: "Yesterday",
  },
  {
    id: "3",
    title: "Code Review Request",
    preview: "Please review this Python script...",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    title: "Documentation Draft",
    preview: "Help me write documentation for...",
    timestamp: "1 week ago",
  },
];

const sectionConfig = {
  home: {
    title: "Recent Chats",
    icon: MessageSquare,
    items: mockChatHistory,
  },
  dashboard: {
    title: "Analytics",
    icon: FileText,
    items: [
      { id: "d1", title: "Usage Overview", preview: "View your usage statistics", timestamp: "Updated now" },
      { id: "d2", title: "Performance Metrics", preview: "Response times and accuracy", timestamp: "Updated hourly" },
    ],
  },
  users: {
    title: "Team Members",
    icon: Clock,
    items: [
      { id: "u1", title: "Workspace Settings", preview: "Manage team access", timestamp: "" },
      { id: "u2", title: "Invite Members", preview: "Add new collaborators", timestamp: "" },
    ],
  },
  settings: {
    title: "Preferences",
    icon: Star,
    items: [
      { id: "s1", title: "API Keys", preview: "Manage your API credentials", timestamp: "" },
      { id: "s2", title: "Model Settings", preview: "Configure default models", timestamp: "" },
      { id: "s3", title: "Notifications", preview: "Alert preferences", timestamp: "" },
    ],
  },
};

const RightSidebar = ({ activeSection, selectedChatId, onSelectChat }: RightSidebarProps) => {
  const config = sectionConfig[activeSection];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 bg-sidebar border-l border-sidebar-border flex flex-col"
    >
      {/* Header */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border">
        <config.icon className="w-4 h-4 text-sidebar-foreground" />
        <h2 className="font-medium text-sm text-sidebar-foreground">{config.title}</h2>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto py-2">
        <AnimatePresence mode="popLayout">
          {config.items.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectChat(item.id)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                selectedChatId === item.id
                  ? "bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {item.title}
                    </p>
                    {"starred" in item && item.starred && (
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {item.preview}
                  </p>
                </div>
              </div>
              {item.timestamp && (
                <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;
