"use client";

import React from "react";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
// import ChatMessage from "./ChatMessage";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { askQuestion } from "@/actions/askQuestion";

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isPending, startTransition] = useTransition();
  const bottomOfChatRef = useRef(null);
  const {user} = useUser()

  

  // const [snapshot, loading, error] = useCollection(
  //   user &&
  //     query(
  //       collection(db, "users", user?.id, "files", id, "chat"),
  //       orderBy("createdAt", "asc")
  //     )
  // );

  // useEffect(()=>{
  //   if(!snapshot) return;

  //   console.log("updated snapshot", snapshot.docs)

  // })


  return (
    <div className="h-[calc(100vh-80px)]    w-full flex flex-col">
      {/* Scrollable chat area */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center overflow-x-hidden p-4">
      🚧 Project Paused <br />
      This project is currently on hold and will be resumed soon. Stay tuned!
        {/* Chat messages go here */}
      </div>

      {/* Sticky-like form (stuck at bottom because it's below scroll area) */}
      <form className="bg-blue-400 p-3 w-full  flex items-end gap-1">
        <Input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="flex-1 bg-white/90 rounded-sm"
        />

        <Button  type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-indigo-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}




export default ChatPage