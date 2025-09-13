import { LuDownload } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";


function Gallery({ gallery, setGallery }) {

  const handleDelete = (index) => {
    const updatedGallery = [...gallery];
    updatedGallery.splice(index, 1);
    setGallery(updatedGallery);
  };

  const handleDownload = (src) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "tattoo-design.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex justify-center items-center sm:px-4 py-8 ">
      <div className="w-full max-w-[900px] bg-transparent border border-gray-300 shadow-lg shadow-gray-400/40 rounded-2xl p-6 sm:p-10">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-gray-900">
          Tattoo <span className="text-gray-600">Gallery</span>
        </h1>

        <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
          Browse some of our AI-designed tattoos.
        </p>

        {/* Grid Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {gallery && gallery.map((src, idx) => (
            <div
              key={idx}
              className="relative border border-gray-300 rounded-xl overflow-hidden shadow-md shadow-gray-400 hover:scale-102 transition-transform duration-300"
            >
              <div className="flex w-full justify-between items-center absolute p-2">
                <button onClick={() => handleDownload(src)} className="p-2 bg-blue-200 hover:bg-blue-400 hover:text-white cursor-pointer rounded-full text-black "><LuDownload /></button>
                <button onClick={() => handleDelete(idx)} className="p-2 bg-red-200 hover:bg-red-400 hover:text-white cursor-pointer rounded-full text-black "><MdOutlineDelete /></button>
              </div>
              <img src={src} alt={`Tattoo ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {!gallery.length && (
            <div className="col-span-full text-center text-gray-500">
              No tattoos in the gallery yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
