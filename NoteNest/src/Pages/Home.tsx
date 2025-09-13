import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";

function Home() {
  return (
    <div className="w-max flex flex-col items-center justify-center py-8 border rounded max-w-screen-sm mx-auto px-10">
      <div 
      className="w-full"
      >
        <h1 className="w-full text-3xl font-bold text-center mb-6">Note Nest</h1>
        <div>
            <NoteForm />
        </div>
        <NoteList />
      </div>
    </div>
  );
}

export default Home;
