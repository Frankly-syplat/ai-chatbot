
import ChatInterface from "./components/ChatInterface";

export default function App() {
  return (
    <div className="h-screen w-screen flex">
      <ChatInterface onNewChat={() => console.log("New chat")} />
    </div>
  );
}
