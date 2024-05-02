import LeftSide from "@/components/ChatPage/LeftSide";
import RightSide from "@/components/ChatPage/RightSide";
import Footer from "@/components/Essentials/Footer";
import NavigationBar from "@/components/Essentials/NavigationBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />
      <div className="flex-1 p-5 flex justify-center">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-full"
        >
          <ResizablePanel defaultSize={25} minSize={25}>
            <div className="p-4">
              <LeftSide />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75} minSize={75}>
            <div className="p-4">
              <RightSide />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Footer />
    </div>
  );
}
