import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/navbar'
import Home from '../pages/Home'
import UserData from '../pages/UserData'
import Analyze from '../pages/Analyze'
import Footer from '../components/footer'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userdata" element={<UserData />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
