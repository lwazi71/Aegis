import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/navbar'
import Home from '../pages/Home'
import UserData from '../pages/UserData'
import Analyze from '../pages/Analyze'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userdata" element={<UserData />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </>
  )
}

export default App
