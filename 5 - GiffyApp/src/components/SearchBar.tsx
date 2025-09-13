import React, { useRef } from "react";
import { Button } from "./ui/button";

interface Props{
    query:string,
    setQuery: (value:string) => void;
    limit:number,
    setLimit: (value:number) => void;
    getGifs: () => void;
    gif:any[],
    setGif:(value:any[]) => void,
    setError:(value:string) => void,
}

const SearchBar:React.FC<Props> = ({query , setQuery , limit, setLimit , getGifs , gif , setGif, setError}) => {

  const buttonRef = useRef(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      getGifs();
    }
  };

  const handleClear = () => {
    setGif([]);
    setQuery("");
  }


  return (
    <div className="flex flex-col lg:flex-row space-x-5 space-y-5">
        <input type="text" value={query} placeholder="Search gif" onChange={(e)=> {setQuery(e.target.value); setError("")}} onKeyDown={handleKeyDown} className="w-full px-4 py-2 border rounded-md shadow-sm" />
        <input type="number" value={limit} placeholder="Enter Limit" onChange={(e)=> {setLimit(Number(e.target.value)); setError("")}} onKeyDown={handleKeyDown} className="w-full lg:w-max px-4 py-2 border rounded-md shadow-sm" />
        {
          gif.length ==0 ?
            <Button ref={buttonRef} onClick={getGifs} className="w-full lg:w-max py-5 px-10 cursor-pointer">Search</Button> :
            <Button onClick={handleClear} className="w-full lg:w-max py-5 px-10 cursor-pointer">Clear</Button>
        }
        
    </div>
  )
}

export default SearchBar