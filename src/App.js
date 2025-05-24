import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import TakeAttendance from "./components/TakeAttendance"
import AdminPanel from "./components/AdminPanel"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import Footer from "./components/Footer"
import { AttendanceProvider } from "./AttendanceContext"
import "./App.css"
import welcomeImage from "./welcome.png"
import "leaflet/dist/leaflet.css"

const App = () => {
  // Function to get greeting based on current time
  const getGreeting = () => {
    const hours = new Date().getHours()
    if (hours < 12) {
      return "Selamat Pagi!"
    } else if (hours < 15) {
      return "Selamat Siang!"
    } else if (hours < 18) {
      return "Selamat Sore!"
    } else {
      return "Selamat Malam!"
    }
  }

  return (
    <AttendanceProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="welcome-container">
                    <img src={welcomeImage || "/placeholder.svg"} alt="Welcome" className="welcome-image" />
                    <h1>{getGreeting()} Assalamu'alaikum Warahmatullahi Wabarakatuh</h1>
                    <h2>Selamat datang di Sistem Kehadiran KL LAZISMU BANTUL</h2>
                    <p>Membangun transparansi dan akuntabilitas melalui teknologi digital</p>
                  </div>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/attendance" element={<TakeAttendance />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AttendanceProvider>
  )
}

export default App
