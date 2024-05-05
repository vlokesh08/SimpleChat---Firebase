import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/firebase";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setChatData } from "@/Redux/Slice/chatSlice";
import { socket } from "@/components/Socket/SocketInstance";

const LeftSide = () => {
  const user = useSelector((state: any) => state.user.user);
  const [chats, setChats] = useState([] as any);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", user.id),
      async (items: any) => {
        const temp = items.data().chats;

        const list = temp.map(async (item: any) => {
          const docRef = doc(db, "users", item.receiverId);
          const docSnap = await getDoc(docRef);

          const data = docSnap.data();
          return { ...items, data,temp };
        });

        const result = await Promise.all(list);

        setChats(result);
      }
    );
    return () => unSub();
  }, [user.id]);

    console.log(chats)

  const handleClick = async (id: any) => {
    console.log(id);
    try {
      const chatRef = doc(db, "userChats", id);
      const chatSnapshot = await getDoc(chatRef);
  
      if (chatSnapshot.exists()) {
        const chats = chatSnapshot.data()?.chats;
  
        if (chats && chats.length > 0) {
          const chatWithUser = chats.find((chat : any) => {
            return chat.receiverId === user.id;
          });
  
          if (chatWithUser && chatWithUser.chatId) {
            const chatId = chatWithUser.chatId;
            const lastMessage = chatWithUser.lastMessage;
            console.log(chatId);
            socket.emit('join-room', { otherUserId: id, roomId: chatId });
            dispatch(setChatData({ userId: id, chatId, lastMessage: lastMessage, extraData: null }));
          } else {
            console.error('No chat found with the given userId');
          }
        } else {
          console.error('No chats found for the user');
        }
      } else {
        console.error('User chats document not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2 className=" font-semibold text-xl mb-5 p-2">Chats</h2>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Enter Username" />
        <Button type="submit">Search</Button>
      </div>
      <ScrollArea className="h-[480px] w-[340px] rounded-md border p-4 mr-4 mt-4">
        {chats.map((chat: any) => (
          <div key={chat?.data.uid}>
            <div
              className="flex w-full items-center align-middle space-x-2 space-y-5 gap-4 p-5 cursor-pointer "
              onClick={()=>handleClick(chat?.data?.uid)}
            >
              <div className="flex align-middle space-y-2 ">
                <Avatar>
                  <AvatarImage
                    src={chat?.data?.picture || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex align-middle">
                <p>{chat?.data?.username}</p>
                <p>{chat?.data.lastMessage}</p>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default LeftSide;
