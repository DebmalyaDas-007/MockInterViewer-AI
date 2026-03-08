import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Interview from "./pages/Interview"
import Evaluation from "./pages/Evaluation"

function App() {

  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route path="/interview" element={<Interview />} />

      <Route path="/evaluation" element={<Evaluation />} />

    </Routes>
  )
}

export default App