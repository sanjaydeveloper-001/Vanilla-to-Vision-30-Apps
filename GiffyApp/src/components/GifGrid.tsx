import React from "react";
import { FiDownload } from "react-icons/fi";

interface Props {
  gifs: any[];
  loading: boolean;
  error:string,
}

const GifGrid: React.FC<Props> = ({ gifs, loading , error}) => {

  const downloadGif = async (url: string , fileName:string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName+".gif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  if (loading) return <p>Loading Gif...</p>;


  return (
    <>
    {
      gifs.length != 0 ? 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        { gifs.map((g) => (
           <div className="w-40 md:w-50 lg:w-50 h-max relative group">
            <h1 onClick={() => downloadGif(g.images.fixed_height.url, g.alt_text)} className="absolute top-0 left-0 p-2 bg-white/80 cursor-pointer m-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white "><FiDownload /></h1>
            <img src={g.images.fixed_height.url} />
           </div>
         ))
         }
      </div>
      :
      ( error ?
        <div className="text-xl font-medium text-red-500">
          {error}
        </div>
        :
        <div className="text-xl font-medium text-gray-700">
          Your Giphy will show here!
        </div>)
    }
    </>
    
  );
};

export default GifGrid;
