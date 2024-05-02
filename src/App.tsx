
import './App.css'

import {Routes,Route} from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import ChatPage from './pages/ChatPage/ChatPage'
import Protect from './components/Auth/Protect'
function App() {

  return (
    <>
      
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Protect><ChatPage /></Protect>} />
      </Routes>
    </>
  )
}

export default App
