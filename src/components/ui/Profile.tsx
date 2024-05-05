import { LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { loginFailure } from "@/Redux/Slice/useSlice";
import { Navigate } from "react-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { updateUser } from "@/Redux/Slice/useSlice";
import upload from "@/lib/uploadImage";
export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const imageURL = user?.pic;
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user?.fullName);
  const [username, setUsername] = useState(user?.username);
  const [picture, setPicture] = useState({
    file: null,
    preview: "",
  });

  const handleProfileClick = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(loginFailure());
    window.location.href = "/login";
  };

  const handleChange = async () => {
    try {
      const url = await upload(picture.file);
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        username: username,
        name: name,
        picture: url,
      });
      dispatch(updateUser({ username, name, pic: url}));
      console.log("User profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  };

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src={imageURL || "https://github.com/shadcn.png"}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>@ {user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup onClick={handleProfileClick}>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger>
          {/* <Button variant="outline"></Button> */}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 w-full">
            <div className="grid grid-cols-4 w-full justify-center items-center gap-4">
              <div className=" w-full  space-y-1 flex justify-center gap-5 bg-black">
                
                <Avatar>
                  <AvatarImage
                    src={picture.preview || imageURL }
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
                <Input id="picture" type="file" onChange={handleAvatar}  />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={`${user.fullName}`}
                className="col-span-3"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue={`${user.username}`}
                className="col-span-3"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleChange}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
