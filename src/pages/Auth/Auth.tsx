import Login from "@/components/Auth/Login";
import Signup from "@/components/Auth/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Auth = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row h-screen w-full">
        <div className="rounded-md border m-9 p-12 flex justify-center flex-col align-middle">
          <div className="w-full flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
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
          <p className="w-[550px] text-justify">
            Streamline your communication with SimpleChat, a user-friendly
            chatting application that connects you with friends, family, and
            colleagues in real-time. Enjoy a seamless and intuitive experience
            as you exchange messages, share files, and stay connected on the go.
          </p>
        </div>
        <div className="m-9 p-12 flex justify-center flex-col align-middle">
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Login</TabsTrigger>
              <TabsTrigger value="password">Signup</TabsTrigger>
            </TabsList>
            <Login />
            <Signup />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
