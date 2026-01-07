import { Menu, Plus, Home, LayoutDashboard, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

export type AppSection = "home" | "dashboard" | "users" | "settings";

interface LeftSidebarProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  onNewChat: () => void;
}

const navItems = [
  { id: "home" as AppSection, icon: Home, label: "Home" },
  { id: "dashboard" as AppSection, icon: LayoutDashboard, label: "Dashboard" },
  { id: "users" as AppSection, icon: Users, label: "Users" },
  { id: "settings" as AppSection, icon: Settings, label: "Settings" },
];

const LeftSidebar = ({ activeSection, onSectionChange, onNewChat }: LeftSidebarProps) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-4"
    >
      {/* Hamburger Menu */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* New Chat Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNewChat}
        className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground elevation-2 hover:opacity-90 transition-opacity"
        aria-label="New Chat"
      >
        <Plus className="w-5 h-5" strokeWidth={2.5} />
      </motion.button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Navigation Items */}
      <nav className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSectionChange(item.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Spacer */}
      <div className="h-4" />
    </motion.aside>
  );
};

export default LeftSidebar;
