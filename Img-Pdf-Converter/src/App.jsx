import { useState } from "react";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
import { X, FileDown, Eye } from "lucide-react";

export default function App() {
  const [images, setImages] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [newName , setNewName] = useState("Converted PDF");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    const pdf = new jsPDF();
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = () => {
          const imgData = reader.result;
          pdf.addImage(imgData, "JPEG", 10, 10, 180, 250);
          if (i < images.length - 1) pdf.addPage();
          resolve();
        };
        reader.readAsDataURL(img);
      });
    }

    // Save blob instead of downloading immediately
    const pdfOutput = pdf.output("blob");
    setPdfBlob(URL.createObjectURL(pdfOutput));
  };

  const downloadPDF = () => {
    if (!pdfBlob) return;
    const a = document.createElement("a");
    a.href = pdfBlob;
    a.download = `${newName}.pdf`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <motion.div
        className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center mb-8 
          bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 
          bg-clip-text text-transparent tracking-wide drop-shadow-sm"
        >
          Image to PDF Converter
        </h1>



        {/* Upload Section */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">
          {
            images.length === 0 ?
            <span className="text-gray-500">Click to Drop Images</span>
            :
            <span className="text-gray-500">Add Images</span>
          }
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-xl shadow-md"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="cursor-pointer absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={18} />
                </button>
                <button
                  className="cursor-not-allowed absolute top-2 left-2 bg-gray-600 text-white rounded-full px-2 transition"
                >
                  {idx+1}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Convert Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={generatePDF}
            disabled={images.length === 0}
            className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FileDown size={20} /> Generate PDF
          </button>
        </div>

        {/* PDF Preview + Download */}
        {pdfBlob && (
          <motion.div
            className="mt-8 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 
              onClick={() => setShowPreview(!showPreview)}
              className="text-xl font-semibold text-gray-700 flex items-center gap-2 hover:text-blue-700 cursor-pointer">
              <Eye size={20} /> Preview
            </h2>

            {/* Clean PDF Preview without toolbar */}
            {
              showPreview && (
                <div className="w-full h-100 border rounded-xl shadow-md">
                  <embed
                    src={`${pdfBlob}#toolbar=0&navpanes=0&scrollbar=0`}
                    type="application/pdf"
                    className="w-full h-100 border rounded-xl shadow-md"
                  />
                </div>
              )
            }

            <div className="flex sm:flex-row flex-col space-y-4 w-full items-center justify-between">
              <div className="space-x-2">
                <label htmlFor="name" className="text-xl"> File Name:</label>
                <input type="text" id="name" autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} className="p-2 outline-none focus:border-gray-700 rounded-md border-gray-400 border-2" placeholder="Enter File Name" />
              </div>
            <button
              onClick={downloadPDF}
              className=" w-full sm:w-auto text-center cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
            >
              <FileDown size={20} /> Download PDF
            </button>

            </div>
          </motion.div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold">Sanjay</span>
        </p>

      </motion.div>
    </div>
  );
}
