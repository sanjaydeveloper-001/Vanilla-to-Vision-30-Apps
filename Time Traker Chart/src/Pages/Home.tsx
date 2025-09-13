import TimeChart from "@/components/TimeChart";
import TimeForm from "@/components/TimeForm"
import { useState } from "react"

function Home() {

  const [data , setData] = useState<{activity:string; hours:number}[]>([]);
  
  const handleAdd = (activity:string, hours:number) => {
    setData((prev) => [...prev , {activity , hours}]);
  }

  console.log(data);

  return (
    <div className="w-380px h-max p-5 border rounded space-y-5">
        <h1 className="text-3xl font-bold text-blue-600">Chart My Day</h1>
        <TimeForm 
          onAdd={handleAdd}
        />
        {
          data.length != 0 && 
          <TimeChart data={data} />
        }
    </div>
  )
}

export default Home