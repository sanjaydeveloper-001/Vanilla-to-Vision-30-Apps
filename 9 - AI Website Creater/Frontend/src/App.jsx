import React from 'react'
import Home from './Pages/Home'
import Start from './Pages/Start'
import { useState } from 'react'

function App() {
  const [start , setStart] = useState(false);
  return (
    <div className='w-full h-[100vh] overflow-y-auto  bg-blue-50 flex justify-center p-2 sm:p-6'>
      {
        !start ?
        <Start setStart={setStart} />
        :
        <Home />}
    </div>
  )
}

export default App