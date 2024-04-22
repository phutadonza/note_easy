import { useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './Components/Register'
import Navbar from './Components/Navbar'
import Login from './Components/Login'
import Note from './Components/Note'
export const userContext = createContext()
export const userDataContext = createContext()
export const dataContext = createContext()
export const baseUrl = 'https://note-easy-server.onrender.com'

function App() {
  let [signedIn, setSignedIn] = useState(null)
  let [userData, setUserData] = useState(null)
  let [data, setData] = useState([])
  return (
    <userContext.Provider value={[signedIn, setSignedIn]}>
      <userDataContext.Provider value={[userData, setUserData]}>
        <dataContext.Provider value={[data, setData]}>
          <Navbar />
          <>
            <Routes>
              <Route path="/" element={<Note />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </>
        </dataContext.Provider>
      </userDataContext.Provider>
    </userContext.Provider>
  )
}

export default App
