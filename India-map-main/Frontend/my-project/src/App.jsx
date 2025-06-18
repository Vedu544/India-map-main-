import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
console.log(import.meta.env.VITE_API_BASE_URL)

function App() {
  return (
    <>
   <Routes>
    <Route path="/" element={<Home/>}>
    </Route>
   </Routes>
    </>
  )
}

export default App
