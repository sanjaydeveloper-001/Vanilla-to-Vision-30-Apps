import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { db } from '../lib/firebase'
import { collection , addDoc , serverTimestamp} from 'firebase/firestore'

function NoteForm() {

    const [note , setNote] = useState("");
    const [loading , setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading (true);
        if(!note.trim()){ 
            alert("Fill the box!"); 
        }
        else{
            await addDoc(collection(db, "notes"),{
                content:note,
                createdAr:serverTimestamp()
            })
            
        }
        setNote("");
        setLoading(false);

    }

  return (
    <div className="space-y-2">
        <Input
        placeholder="Type your note..."
        value={note}
        maxLength={50}
        onChange={(e)=> { setNote(e.target.value)}}
        />

        <Button disabled={loading} onClick={handleSubmit} className="w-full mt-3">{ loading ? "Saving..." : "Save Note"}</Button>
    </div>
  )
}

export default NoteForm