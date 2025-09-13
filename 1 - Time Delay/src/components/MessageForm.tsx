import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

function MessageForm() {

  const [message , setMessage] = useState<string>("");
  const [delay , setDelay] = useState<number>(2);
  const [isSending , setIsSending] = useState<boolean>(false);
  const [timerId , setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [sendMessage , setSendMessage] = useState<string>("");
  const [alert , setAlert] = useState<boolean>(false);


  const handleSend = () => {
    if(message){
      setIsSending(true);
      const id = setTimeout(()=>{
        setSendMessage(message);
        setMessage("");
        setIsSending(false);
      },delay*1000);

      setTimerId(id);
    }
    else{
      setAlert(true);
    }
  }

  const handleCancel = () => {
    if(timerId) clearTimeout(timerId);
    setIsSending(false);
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 px-2 py-5 bg-white relative">
      <h1 className="text-[15px] text-gray-800">You can customize your time to send the message</h1>
      <Textarea
        className="w-full h-50 overflow-x-hidden whitespace-pre-wrap break-words break-all"
        placeholder="Type your message..."
        value={message}
        onChange={(e)=> {setMessage(e.target.value); setAlert(false); setSendMessage("") }}
      />
      <Input
        type="number"
        placeholder="Delay in seconds"
        value={delay}
        onChange={(e)=> {setDelay(Number(e.target.value)); setAlert(false)}}
        disabled={isSending}
      />
      {
        !isSending ? 
        <Button 
          className="w-full sticky bottom-5 cursor-pointer"
          onClick={handleSend}
        >
        Send with Delay
      </Button> 
      : 
      <Button 
      variant="destructive"
      className="w-full cursor-pointer"
      onClick={handleCancel}
      >
        Cancel Sending
      </Button>
      }

      {
        alert ? 
        <div className="bg-red-200 rounded p-3 text-red-900 border">
          <p>{"Enter the Message !"}</p>
        </div>
        :
        (
          sendMessage &&
          <div className="max-w-full overflow-x-hidden whitespace-pre-wrap break-all break-words bg-green-200 rounded p-3 text-green-900 border">
            <p className="font-semibold">Message Sent :</p>
            <p>{sendMessage}</p>
          </div>
        )
      }


    </div>
  )
}

export default MessageForm