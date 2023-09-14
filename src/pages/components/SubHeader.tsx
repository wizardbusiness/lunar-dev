import React, {useEffect, useState} from "react";
import Cursor from "./Cursor";

export default function SubHeader({msg}) {
  const [ msgIndex, setMsgIndex ] = useState(0);
  const [ text, setText ] = useState(" ");

  useEffect(() => {
    if (!msg[msgIndex]) return;
    const interval = msg[msgIndex - 1] === "." ? 500 : 55; // pause on end of sentence.
    const typeChars = setInterval(() => {
      setText(prevText => prevText += msg[msgIndex]);
      setMsgIndex(prevMsgIndex => prevMsgIndex += 1);
    }, interval);
    return () => clearInterval(typeChars);
  }, [msgIndex])

  return (
    <div className="flex justify-center items-center h-32 w-2/5 text-gray-100 bg-foggy-glass shadow-lg translate-x-1 rounded-md">
      <h1 className="h-10 font-mono text-center text-4xl ">
            { 
              msgIndex === msg.length && text.split(" ").map((str, index) => {
                const key = str + index
                if (!str.includes(".")) return <span key={key} className="font-extrabold">{str + " "}</span>
                else return str + " ";
              })
              ||
              text
            }
      </h1>
      <Cursor animStart={msgIndex === msg.length} />
    </div>
  );
}