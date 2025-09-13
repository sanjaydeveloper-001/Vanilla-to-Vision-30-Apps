

import GifGrid from "@/components/GifGrid";
import SearchBar from "@/components/SearchBar"
import { fetchGif } from "@/lib/giffy";
import React, { useState } from "react"

function Home() {

    const [query , setQuery] = useState("");
    const [limit , setLimit] = useState<number>(20);

    const [gif , setGif] =React.useState<any[]>([]);
    const [loading , setLoading] = React.useState<boolean>(false);
    const [error , setError] = React.useState<string>("");

    const getGifs = async () => {
        setLoading(true);
        try {
            if(!query){
                setError("Type something to search !");
                return;
            }
            if(limit == 0){
                setError("Add limit to search !");
                return;
            }
            const res = await fetchGif(query , limit);
            setGif(res);
        } catch (error) {
            console.log("Error :" + error);
        }
        finally{
            setLoading(false);
        }
    }

  return (
    <div className="w-full h-max max-w-4xl mx-auto text-center space-y-6 p-5 ">
        <h1 className="text-3xl font-bold">Gif Quest</h1>
        <SearchBar query={query} setQuery={setQuery} limit={limit} setLimit={setLimit} getGifs={getGifs} gif={gif} setGif={setGif} setError={setError} />
        <GifGrid gifs={gif} loading={loading} error={error} />
    </div>
  )
}

export default Home