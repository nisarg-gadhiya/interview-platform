import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "./redux/userSlice"
import { serverUrl } from "./utils/serverUrl"
import InterviewPage from "./pages/InterviewPage.jsx"
import InterviewHistory from "./pages/InterviewHistory.jsx"
import Pricing from "./pages/Pricing.jsx"
import InterviewReport from "./pages/InterviewReport.jsx"
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx"
import AptitudeTest from "./pages/AptitudeTest.jsx"
import CSFundamentals from "./pages/CSFundamentals.jsx"
import SubjectTopics from "./pages/SubjectTopics.jsx"
import TopicDetail from "./pages/TopicDetail.jsx"
import OAPage from "./pages/OAPage.jsx"
import OAResultPage from "./pages/OAResultPage.jsx"

export const ServUrl = "https://interview-platform-r1ak.onrender.com"

function App() {

  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const getUser = async () =>{
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token")
        
        if (token) {
          const result = await axios.get(serverUrl + "/api/user/current-user", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          dispatch(setUserData(result.data))
        } else {
          dispatch(setUserData(null))
        }
      }
      catch (error) {
        console.log("Error fetching user:", error.message)
        localStorage.removeItem("token")
        dispatch(setUserData(null))
      }
      finally {
        setIsLoading(false)
      }
    }
    getUser()
  },[dispatch])

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={userData ? <Navigate to="/" /> : <Auth/>} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/history" element={<InterviewHistory />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/report/:id" element={<InterviewReport />} />
      <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
      <Route path="/aptitude" element={<AptitudeTest />} />
      <Route path="/cs-fundamentals" element={<CSFundamentals />} />
      <Route path="/cs-fundamentals/:subject" element={<SubjectTopics />} />
      <Route path="/cs-fundamentals/topic/:topicId" element={<TopicDetail />} />
      <Route path="/oa" element={<OAPage />} />
      <Route path="/oa-result/:sessionId" element={<OAResultPage />} />
    </Routes>
  )
}

export default App
