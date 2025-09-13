import MessageForm from "@/components/MessageForm"
import phone from '../assets/Phone.png';
import Time from "@/components/Time";
import Percentage from '../assets/Percentage.png'
import { useState } from "react";
import { Button } from "@/components/ui/button";

function Home() {

  const [startMessage , setStartMessage] = useState<boolean>(false);

  return (
    <div className='w-[300px] h-[600px] rounded-[50px] px-2 py-1.5 relative flex items-center flex-col bg-white'>
        <img src={phone} className='w-full h-full absolute top-0 left-0 z-1' draggable={false} />

        <div className="absolute top-2 w-full h-max flex justify-between items-center pr-8 border-b-1">
          <Time/>
          <img className="h-10 w-15" src={Percentage} />
        </div>

        <div  className=" w-[90%] h-max mb-1.5 mt-11 overflow-y-auto z-2 scrollbar-hide rounded-b-[35px] flex items-center flex-col">
          { startMessage ?
            <div className="flex flex-col gap-1 items-center">
              <h1 onClick={()=> setStartMessage(false)} className="text-2xl font-bold text-[#2bb2d4] cursor-pointer">Time Text</h1>
              <MessageForm/>
            </div>
            :
            <div className="flex flex-col gap-5 items-center">
              <h1 className="text-3xl font-bold text-[#2bb2d4]">Welcome..!</h1>
              <Button className="cursor-pointer" onClick={()=> setStartMessage(true)}>Start Message</Button>
            </div>
          }
        </div>

    </div>
  )
}

export default Home