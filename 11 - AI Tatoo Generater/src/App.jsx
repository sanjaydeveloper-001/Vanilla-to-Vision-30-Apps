import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Generate from './components/Generate'
import Header from './components/Header'
import Gallery from './components/Gallery'
import { useState } from 'react'

function App() {

  const [activeTab, setActiveTab] = useState("Home");
  const [gallery, setGallery] = useState(() => {
    const data = localStorage.getItem('gallery');
    return data ? JSON.parse(data) : [];
  });

  return (
    
      
      <BrowserRouter>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className='w-full h-max p-2 sm:p-6 flex justify-center items-center'>
        <Routes>
          <Route path="/" element={<Home setActiveTab={setActiveTab} />} />
          <Route path="/generate" element={<Generate setGallery={setGallery} />} />
          <Route path="/gallery" element={<Gallery gallery={gallery} setGallery={setGallery} />} />
        </Routes>
        </div>
      </BrowserRouter>
      

  )
}

export default App