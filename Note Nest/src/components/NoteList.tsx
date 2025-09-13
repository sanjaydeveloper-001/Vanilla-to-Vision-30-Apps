import {db} from "@/lib/firebase";
import { collection , onSnapshot, deleteDoc , doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Note{
    id:string,
    content:string,
    
}

function NoteList() {

    const [notes, setNotes] = useState<Note[]>([]);

    const deleteItem = async (id:string) => {
        await deleteDoc(doc (db, "notes" , id));
    }


    useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);


  if(notes.length == 0 ){
    return <p className="text-xl mt-2">No notes yet . Start typing</p>
  }


  return (
    <div className={`grid grid-4 mt-4 ${notes.length ===1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} space-x-4`} >
        {
          notes.map((note)=> (
            <div key={note.id} className="mt-5 p-5 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-200 flex justify-between items-center gap-2" >
              <p>{note.content}</p>
              <Button 
                variant="destructive"
                onClick={()=> deleteItem(note.id)}>
              Delete
              </Button>
            </div>
          ))
        }

    </div>
  )

}
export default NoteList