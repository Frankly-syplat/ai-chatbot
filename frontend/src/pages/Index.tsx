import { useState, useCallback } from "react";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [chatKey, setChatKey] = useState(0);

  const handleNewChat = useCallback(() => {
    setChatKey((prev) => prev + 1);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background p-4">
      <ChatInterface key={chatKey} onNewChat={handleNewChat} />
    </div>
  );
};

export default Index;
