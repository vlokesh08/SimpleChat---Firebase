import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import chatSlice from "@/Redux/Slice/chatSlice";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
const RightSide = () => {
  const chatId = useSelector((state: any) => state.chat.chatId);
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    

  };
  // console.log(chatId);

  useEffect(() => {
    const chatUnsubscribe = onSnapshot(doc(db, "chats", chatId), (chatDoc) => {
      setMessages(chatDoc.data()?.messages );
      console.log(chatDoc.data()?.messages);
    });
    
    return () => chatUnsubscribe();
  }, [chatId]);

  return (
    <div className=" h-max">
      <div className="flex px-5 gap-8 h-full">
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className=" text-lg">Venkata Lokesh</h1>
          <p>🟢 Online</p>
        </div>
      </div>
      <div>
        <ScrollArea className="h-[440px] rounded-md border p-4 mr-4 mt-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.from === "To" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.from === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className=" flex  p-4 mr-4 mt-4 gap-3">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full text-white-700"
          />
          <Button
            className="bold py-2 px-4 rounded"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
