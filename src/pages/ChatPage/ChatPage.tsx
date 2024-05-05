import LeftSide from "@/components/ChatPage/LeftSide";
import RightSide from "@/components/ChatPage/RightSide";
import Footer from "@/components/Essentials/Footer";
import NavigationBar from "@/components/Essentials/NavigationBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect } from "react";
import { socket } from "@/components/Socket/SocketInstance";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { resetChatData } from "@/Redux/Slice/chatSlice";
export default function ChatPage() {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetChatData());
    console.log("Authenticating user")
    socket.emit("authenticate", user.id);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />
      <div className="flex-grow flex">
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border w-full">
          <ResizablePanel defaultSize={25} minSize={25}>
            <div className="h-full p-4">
              <LeftSide />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75} minSize={75}>
            <div className="h-full w-full p-4 flex justify-center align-middle">
              <RightSide />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Footer />
    </div>
  );
}