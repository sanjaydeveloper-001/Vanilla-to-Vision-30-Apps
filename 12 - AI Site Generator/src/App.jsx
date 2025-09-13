import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Home from './Pages/Home'
import Generate from './Pages/Generate'

function App() {
  return (
    
    <BrowserRouter >

        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/generate' element={<Generate/>}/>
        </Routes>

    </BrowserRouter>


  )
}

export default App