import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import upload from "@/lib/uploadImage";
const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState({
    file: null,
    preview: "",
  });
  const { toast } = useToast()

  const handleAvatar = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPicture({
        file: file,
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const email = username + "@simplechat.com";
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const url = await upload(picture.file);
        if (res.user) {
            const user = res.user;
            await setDoc(doc(db, "users", user.uid), {
                name,
                username,
                picture: url,
                uid: user.uid,
            });
            await setDoc(doc(db, "userChats", user.uid), {
                chats: [],
            });
        }

        toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });
    } catch (error) {
        console.error(error);   
    }
  };

  return (
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Create a new account by filling in the details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="current">Full Name</Label>
            <Input
              id="current"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">Username</Label>
            <Input
              id="new"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">Password</Label>
            <Input
              id="new"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">Confirm Password</Label>
            <Input
              id="new"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">Picture</Label>
            <Input id="picture" type="file" onChange={handleAvatar} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Signup</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default Signup;
