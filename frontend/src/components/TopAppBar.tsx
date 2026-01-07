import { Bell, Settings, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TopAppBarProps {
  userName?: string;
  userInitials?: string;
}

const TopAppBar = ({ userName = "Maya Collins", userInitials = "MC" }: TopAppBarProps) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-card border-b border-border elevation-1 flex items-center justify-between px-6 z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          <span className="font-semibold text-foreground text-lg tracking-tight">Orchestrator</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Icon Buttons */}
        <IconButton icon={Bell} label="Notifications" />
        <IconButton icon={Settings} label="Settings" />
        <IconButton icon={HelpCircle} label="Help" />

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-2" />

        {/* User Avatar Chip */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-secondary transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">{userInitials}</span>
          </div>
          <span className="text-sm font-medium text-foreground hidden sm:block">{userName}</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

interface IconButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const IconButton = ({ icon: Icon, label, onClick }: IconButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
};

export default TopAppBar;
