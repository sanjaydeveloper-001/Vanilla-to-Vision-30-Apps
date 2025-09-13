import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props{
  onAdd:(activity:string, hours:number)=> void;
}

function TimeForm({ onAdd }:Props) {
  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("");
  const [error , setError] = useState("");

  const handleSubmit = () => {
    if(!activity.trim() || !hours){
      setError("Please fill those boxes...!");
    }
    else{
      setError("");
      onAdd(activity , Number(hours))
      setActivity("");
      setHours("");
    }
  }

  return (
    <div className="space-y-4">
      { error && <h1 className="text-red-500">{error}</h1>}
      <label className="pl-1">Activity :</label>
      <Input
        placeholder="Activity ex: sleep "
        value={activity}
        onChange={(e) => {setActivity(e.target.value); setError("") }}
      />
      <label className="pl-1">Hours :</label>
      <Input
        placeholder="Hours ex: 8 "
        type="number"
        value={hours}
        onChange={(e) => {setHours(e.target.value); setError("")}}
      />

      <Button onClick={handleSubmit} className="w-full cursor-pointer">Add Activity</Button>
    </div>
  );
}

export default TimeForm;
