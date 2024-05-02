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


const LeftSide = () => {
  const user = useSelector((state: any) => state.user);
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
          return { ...items, data };
        });

        const result = await Promise.all(list);
        setChats(result);
        // console.log(result[0].data);
      }
    );
    return () => unSub();
  }, [user.id]);

  const handleClick = async (id: any) => {
    try {
      const chatRef = doc(db, "userChats", id);
      const chatSnapshot = await getDoc(chatRef);
  
      if (chatSnapshot.exists()) {
        const chats = chatSnapshot.data().chats;
        if (chats.length > 0) {
          const chatId = chats[0].chatId;
          dispatch(setChatData({ chatId, lastMessage: null, extraData: null }));
        }
      }
    } catch (error) {
      console.error(error);
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
          <div>
            <div
              className="flex w-full items-center align-middle space-x-2 space-y-5 gap-4 p-5 "
              onClick={()=>handleClick(chat.data.uid)}
            >
              <div className="flex align-middle space-y-2 ">
                <Avatar>
                  <AvatarImage
                    src={chat.data.picture || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex align-middle">
                <p>{chat.data.username}</p>
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
