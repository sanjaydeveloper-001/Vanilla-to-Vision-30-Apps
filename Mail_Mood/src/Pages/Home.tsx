import MoodInput from "@/components/MoodInput";
import MoodOnput from "@/components/MoodOutput";
import { useState } from "react";

function Home() {
  const [mood, setMood] = useState("");
  const [subject, setSubject] = useState("");
  const [footer, setFooter] = useState("");
  const [generate, setGenerate] = useState(false);


  const handleGenerate = () => {

    let lowerMood = mood.toLowerCase();
    if(lowerMood.includes("happy")){
        setSubject("Feeling Great Today!");
        setFooter("Stay Awesome");
    }
    else if(lowerMood.includes("sad")){
        setSubject("Just another tough day!");
        setFooter("Sending Hugs");
    }
    else if(lowerMood.includes("angry")){
        setSubject("Need to cool off!");
        setFooter("Deep Breath")
    }
    else{
        setSubject("Mood Update");
        setFooter("Catch you later");
    }
    setGenerate(true);
    
  }

  const handleReset = () => {
    setSubject("");
    setFooter("");
    setMood("");
    setGenerate(false);
  }

  return (
    <div className="p-6 border-2 max-w-xl mx-auto rounded space-y-6  ">
      <h1 className="text-xl font-semibold">Mood Mail Generator</h1>
        {
          !generate ? 
          <MoodInput
            mood={mood}
            setMood={setMood}
            onGenerate={handleGenerate}
            disable={generate}
          />

          :

          <MoodOnput
            subject={subject}
            footer={footer}
            onReset={handleReset}
          />
        }
    </div>
  );
}

export default Home;
