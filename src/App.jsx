import './App.css'
import Scores from './pages/scores'
import {Routes, Route} from "react-router"
import Home from './pages/home'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/notas/:id' element={<Scores/>}/>
      </Routes>
    </>
  )
}

export default App
