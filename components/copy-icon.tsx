import React, {useState} from 'react'
import { Copy, Check } from "lucide-react";

export const CopyIcon = ({ result = '' }: { result: string }) => {
  const [isClick, setIsClick] = useState(false);

  const copyToClipBoard = async (textToCopy:string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsClick(true);
      setTimeout(() => {setIsClick(false)}, 3000); // Reset after 3 seconds
    } catch (err) {
      setIsClick(false);
    }
  }

  return (
    <div onClick={() => copyToClipBoard(result)}>
        {isClick ? <Check size={20} color="grey" /> : <Copy size={20} color="grey" />}
    </div>
  )
}