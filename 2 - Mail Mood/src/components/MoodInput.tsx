import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
    mood:string,
    setMood : (val:string) => void,
    onGenerate : () => void,
    disable : boolean
}

const MoodInput = ({mood , setMood , onGenerate , disable}:Props) => {

  return (
    <div className="space-y-4">
      <Input
        placeholder="How are you feeling today (Happy, Sad, Angry...)"
        value={mood}
        onChange={(e) => setMood(e.target.value) }
        disabled={disable}
      />
      <Button className="w-full" onClick={onGenerate} disabled={disable}> Generate Email Templete</Button>
    </div>
  )
}

export default MoodInput