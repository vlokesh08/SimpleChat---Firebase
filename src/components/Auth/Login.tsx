import {  TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/Redux/Slice/useSlice";
import { doc, getDoc } from "firebase/firestore";
import { socket } from "../Socket/SocketInstance";
const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const email = name + "@simplechat.com";
    const res = signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        console.log(res)
        const user = userCredential.user;
        // get name and imageurl from firebase
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          const { name, picture, username, uid } = docSnap.data();
          socket.emit('authenticate', uid);
          dispatch(loginSuccess({ name, picture, username, uid }));
          window.location.href = "/";
        } else {
          console.log("No such document!");
        }
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  return (
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Password</Label>
            <Input
              id="username"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin}>Login</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default Login;
