import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Team from './components/Team'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-grow-1">
        {activePage === 'home' && <Home setActivePage={setActivePage} />}
        {activePage === 'team' && <Team />}
        {activePage === 'contact' && <Contact />}
      </main>
      <Footer />
    </div>
  )
}

export default App
