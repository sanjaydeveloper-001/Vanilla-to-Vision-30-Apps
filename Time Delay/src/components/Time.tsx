import { useEffect, useState } from "react";

function Time() {

    const [time, setTime] = useState(new Date());
    const formatTime = (date: Date) => {
      const hours = date.getHours() % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}.${minutes}`;
    };
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);


  return (
    <>
        <h1 className="ml-10 sticky top-0">{formatTime(time)}</h1>
    </>
  )
}

export default Time