import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../utils/serverUrl.js'
import Step3Report from '../components/Step3Report.jsx'

const InterviewReport = () => {

  const {id} = useParams()
  const [report, setReport] = useState(null)

  useEffect(()=>{
    const fetchReport = async ()=>{
      try{
        const result = await axios.get(serverUrl + "/api/interview/report/" + id , { withCredentials: true})
        setReport(result.data)
      }
      catch(error){
        console.error("Error fetching interview report:", error.response?.data || error.message);
      }
    }
    fetchReport()
  })

  if(!report){
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>
          Loading Report...
        </p>
      </div>
    )
  }

  return <Step3Report report={report} />
}

export default InterviewReport
