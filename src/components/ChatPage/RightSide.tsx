import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { socket } from "../Socket/SocketInstance";
import { useDispatch } from "react-redux";
import { resetChatData } from "@/Redux/Slice/chatSlice";

interface UserDetails {
  picture?: string;
  name?: string;
  username?: string;
}

interface Message {
  content: string;
  sender: string;
}

const RightSide = () => {
  const dispatch = useDispatch();
  const chatId = useSelector((state: any) => state.chat.chatId);
  const userId = useSelector((state: any) => state.chat.userId);
  const [userdetails, setUserDetails] = useState<UserDetails>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("receive-message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("load-messages", (messages: Message[]) => {
      setMessages(messages);
    });

    return () => {
      socket.off("receive-message");
      socket.off("load-messages");
    };
  }, []);

  const handleSendMessage = () => {
    const sendMessage = () => {
      if (newMessage.trim()) {
        const message = {
          content: { content: newMessage },
          sender: userId,
        };
        socket.emit("send-message", {
          otherUserId: userId,
          roomId: chatId,
          message,
        });
        setNewMessage("");
      }
    };

    sendMessage();
  };

  const handleEnterKeyPress = (event : any) => {
    if (event.key === 'Enter') {
      // Call your function here
      handleSendMessage();
    }
  };
  useEffect(() => {
    socket.on("receive-message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(messages);
    });

    socket.on("load-messages", (messages: Message[]) => {
      setMessages(messages);
      console.log(messages);
    });

    return () => {
      socket.off("receive-message");
      socket.off("load-messages");
    };
  });

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      dispatch(resetChatData());
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    let userUnsubscribe: (() => void) | null = null;

    if (userId) {
      const unsubscribe = onSnapshot(doc(db, "users", userId), (userDoc) => {
        setUserDetails(userDoc.data() as UserDetails);
      });
      userUnsubscribe = unsubscribe;
    } else {
      console.log("no user id")
    }

    return () => {
      if (userUnsubscribe) {
        userUnsubscribe();
      }
    };
  }, [userId]);

  if (!userId) {
    return (
      <div className="w-full flex flex-col justify-center align-middle">
        <div className="w-full flex justify-center align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-circle-dashed"
          >
            <path d="M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1" />
            <path d="M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1" />
            <path d="M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5" />
            <path d="M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1" />
            <path d="M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1" />
            <path d="M3.5 17.5 2 22l4.5-1.5" />
            <path d="M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5" />
            <path d="M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1" />
          </svg>
        </div>
        <h1 className=" text-2xl font-bold text-center p-5">SimpleChat</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-max">
      <div className="flex px-5 gap-8 h-full">
        <div>
          <Avatar>
            <AvatarImage
              src={userdetails?.picture || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className=" text-lg">{userdetails?.name}</h1>
          <p>🟢 {userdetails?.username}</p>
        </div>
      </div>
      <div>
        <ScrollArea className="h-[440px] rounded-md border p-4 mr-4 mt-4">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender !== userId ? "justify-end" : "justify-start"
              } mb-2 message ${index === messages.length - 1 ? "sticky" : ""}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.sender === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                } `}
              >
                {message?.content}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className=" flex p-4 mr-4 mt-4 gap-3">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full text-white-700"
            onKeyPress={handleEnterKeyPress}
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
