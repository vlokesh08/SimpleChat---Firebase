import { useState } from "react";
import { db } from "@/firebase";
import { collection, query, where, getDocs, setDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// Mock data for profiles

interface Profile {
  id: number;
  username: string;
  avatarUrl: string;
}

function ProfileSearch() {
  const [input, setInput] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const user = useSelector((state: any) => state.user.user);
  // Handle input change
  const handleInputChange = async (event: any) => {

    const value = event.target.value;
    setInput(value);
    if (value.length>0) {
      // Filter profiles based on input

      const q = query(collection(db, "users"), where("username", "==", value));

      const querySnapshot = await getDocs(q);
      const newProfiles = querySnapshot.docs.map(doc => {
        const { uid, username, picture } = doc.data();
        return { id: uid, username, avatarUrl: picture };
      });
  
      setFilteredProfiles(newProfiles);

      // const filtered = profiles.filter((profile) =>
      //   profile.username.toLowerCase().includes(value.toLowerCase())
      // );
      // setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles([]);
    }
  };


  const handleClick = async (uid: any) => {
    // Handle click on profile
    // console.log(`Clicked on profile with id ${uid}`);

    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userChats");

    try {
        // Get the current user's username
        // const currentUserSnapshot = await getDoc(doc(db, "users", user.id));
        // const currentUserData = currentUserSnapshot.data();

        // Check if the same user's username is entered
        if (uid === user.id) {
            console.log("Cannot start a chat with yourself.");
            return;
        }

        // Check if the user is already in the userChats collection of that ID
        const userChatSnapshot = await getDoc(doc(userChatRef, user.id));
        const userChatData = userChatSnapshot.data();
        if (userChatData && userChatData.chats) {
            const existingChat = userChatData.chats.find((chat: any) => chat.receiverId === uid);
            if (existingChat) {
                console.log("Chat with this user already exists.");
                return;
            }
        }

        // Create a new chat document
        const newChatRef = doc(chatRef);
        const chatData = {
            chatId: newChatRef.id,
            receiverId: uid,
            lastMessage: "",
            seen: false,
            updatedAt: Date.now(),
        };

        // Update the current user's chat document
        await setDoc(doc(userChatRef, user.id), { chats: arrayUnion(chatData) }, { merge: true });

        // Update the receiver's chat document
        await setDoc(doc(userChatRef, uid), { chats: arrayUnion(chatData) }, { merge: true });

    } catch (error) {
        console.error("Error handling click:", error);
    }
};


  return (
    <div>
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search profiles..."
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
        className="dark:text-white text-black"
      />
      {filteredProfiles.length > 0 && (
        <div
          style={{
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            position: "absolute",
            width: "300px",
            background: "black",
          }}
        >
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <span style={{ flexGrow: 1 }}>{profile.username}</span>
              <Button
                onClick={() => handleClick(profile.id)}
              >
                Chat
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileSearch;
