import React, { use, useEffect, useState } from 'react'
import maleVideo from "../assets/Videos/male-ai.mp4"
import femaleVideo from "../assets/Videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from 'motion/react'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import { useRef } from 'react'
import { current } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverUrl } from '../utils/serverUrl'
import { BsArrowRight } from 'react-icons/bs'

const Step2Interview = ({interviewData, onFinish}) => {

  const {interviewId, questions, userName} = interviewData
  const [isIntroPhase, setIntroPhase] = useState(true)

  const [isMicOn, setIsMicOn] = useState(true)
  const recognitionRef = React.useRef(null)
  const [isAiPlaying, setIsAiPlaying] = useState(false)
  const isMicOnRef = useRef(true)
  const isAiPlayingRef = useRef(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60)

  const [selectedVoice, setselectedVoice ] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voiceGender, setVoiceGender] = useState("female")
  const [subtitle, setSubtitle] = useState("")

  const videoRef = useRef(null)

  const currentQuestion = questions[currentIndex]

  useEffect(()=>{
    isMicOnRef.current = isMicOn
  }, [isMicOn])

  useEffect(()=>{
    isAiPlayingRef.current = isAiPlaying
  }, [isAiPlaying])

  useEffect(()=>{
      const loadVoices = ()=>{
        const voices = window.speechSynthesis.getVoices()
        if(!voices.length) return

        const femaleVoice = voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

        if(femaleVoice){
          setselectedVoice(femaleVoice)
          setVoiceGender("female")
          return
        }

        const maleVoice = voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

        if(maleVoice){
          setselectedVoice(maleVoice)
          setVoiceGender("male")
          return
        } 

        setselectedVoice(voices[0])
        setVoiceGender("female")
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices

  },[])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo

  const speakText = (text)=>{
    return new Promise((resolve)=>{
      if(!window.speechSynthesis || !selectedVoice){
        resolve()
        return
      }

      window.speechSynthesis.cancel()

      const humanText = text.replace(/,/g,", ... ").replace(/\./g,". ... ") 

      const utterance = new SpeechSynthesisUtterance(humanText)

      utterance.voice = selectedVoice

      utterance.rate = 0.92
      utterance.pitch = 1.05
      utterance.volume = 1

      utterance.onstart = ()=>{
        setIsAiPlaying(true)
        stopMic()
        videoRef.current?.play()
      }

      utterance.onend = ()=>{
        videoRef.current?.pause()
        videoRef.current.currentTime = 0
        setIsAiPlaying(false)

        if(isMicOn){
          startMic()
        }

        setTimeout(()=>{
          setSubtitle("")
          resolve()
        }, 300)
      }

      setSubtitle(text)

      window.speechSynthesis.speak(utterance)
    })
  }

  useEffect(()=>{
    if(!selectedVoice){
      return 
    }

    const runintro = async ()=>{
      if(isIntroPhase){
        await speakText(`Hello ${userName}!, it's great to meet you today. I hope you're feeling confident and ready.`)

        await speakText("I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.")
        
        setIntroPhase(false)
      }
      else if(currentQuestion){
        await new Promise(r => setTimeout(r, 800))

        if(currentIndex === questions.length - 1){
          await speakText("Alright, this one might be a bit more challenging.")
        }

        await speakText(currentQuestion.question)

        if(isMicOn){
          startMic()
        }
      }

    }

    runintro()


  }, [selectedVoice, isIntroPhase, currentIndex])


  useEffect(()=>{
    if(isIntroPhase)return
    if(!currentQuestion)return
    if(isSubmitting)return

    const timer = setInterval(()=>{
      setTimeLeft(prev=>{
        if(prev <= 1){
          clearInterval(timer)    
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return ()=> clearInterval(timer)

  }, [isIntroPhase, currentQuestion, isSubmitting])


  useEffect(()=>{
    if(!("webkitSpeechRecognition" in window))return

    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.continuous = true

    recognition.onstart = ()=>{
      console.log("Speech recognition started")
    }

    recognition.onresult = (event)=>{
      let transcript = ""
      for(let i = event.resultIndex; i < event.results.length; i++){
        transcript += event.results[i][0].transcript
        if(event.results[i].isFinal){
          transcript += " "
        }
      }
      
      if(transcript.trim()){
        setAnswer((prev)=>{
          const newAnswer = prev + transcript
          return newAnswer.trim()
        })
      }
    }

    recognition.onend = ()=>{
      console.log("Speech recognition ended")
      if(isMicOnRef.current && !isAiPlayingRef.current){
        try{
          recognition.start()
        }
        catch(error){
          console.log("Error restarting recognition:", error)
        }
      }
    }

    recognition.onerror = (event)=>{
      console.log("Speech recognition error:", event.error)
      if(isMicOnRef.current && !isAiPlayingRef.current){
        setTimeout(()=>{
          try{
            recognition.start()
          }
          catch(error){
            console.log("Error recovering from error:", error)
          }
        }, 1000)
      }
    }

    recognitionRef.current = recognition

  }, [])

  const startMic = ()=>{
    if(recognitionRef.current && !isAiPlaying){
      try{
        recognitionRef.current.start()
      }
      catch(error){

      }
    }
  }

  const stopMic = ()=>{
    if(recognitionRef.current){
      recognitionRef.current.stop()
    }
  }

  const toggleMic = ()=>{
    if(isMicOn){
      stopMic()
    }
    else{
      startMic()
    }
    setIsMicOn(!isMicOn)
  }

  const submitAnswer = async ()=>{
    if(isSubmitting)return
    stopMic()
    setIsSubmitting(true)

    try{
      const timeTaken = (currentQuestion?.timeLimit || 60) - timeLeft
      const result = await axios.post(serverUrl + "/api/interview/submit-answer", {interviewId, questionId: currentQuestion._id, answer, timeTaken}, {withCredentials:true})

      setFeedback(result.data.feedback)
      await speakText(result.data.feedback)
      setIsSubmitting(false)
    }
    catch(error){
      console.log(error)
      setIsSubmitting(false)  
    }
  }

  const handleNext = async()=>{
    setAnswer("")
    setFeedback("")

    if(currentIndex + 1 >= questions.length){
      finishInterview()
      return
    }

    await speakText("Alright, let's move on to the next question.")

    setCurrentIndex(currentIndex + 1)
    setTimeLeft(questions[currentIndex + 1]?.timeLimit || 60)
    
    if(isMicOn){
      setTimeout(()=>{
        startMic()
      }, 500)
    }
  }

  const finishInterview = async()=>{
    stopMic()
    setIsMicOn(false)
    try{
      const result = await axios.post(serverUrl + "/api/interview/finish", {interviewId}, {withCredentials:true})

      console.log(result.data)

      onFinish(result.data)
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(isIntroPhase)return
    if(!currentQuestion)return

    if(timeLeft === 0 && !isSubmitting && !feedback){
      submitAnswer()
    }
  }, [timeLeft])

  useEffect(()=>{
    return ()=>{
      if(recognitionRef.current){
        recognitionRef.current.stop()
        recognitionRef.current.abort()
      }

      window.speechSynthesis.cancel()
    }
  }, [])


  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
        <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>
              
            {/* video section */}
              <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>

                  <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
                        <video src={videoSource} key={videoSource} ref={videoRef} muted playsInline preload='auto' className='w-full h-auto object-cover'/>
                  </div>

                {/* subtitle pending */}
                {
                  subtitle && (
                    <div className='w-full max-w-md bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm'>
                      <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>
                        {subtitle}
                      </p>
                    </div>
                  )
                }

                {/* timer area */}
                <div className='w-full max-w-md bg-white-border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>

                  <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500'>
                          Interview Status
                      </span>
                      {isAiPlaying && <span className='text-sm font-semibold text-emerald-600'>
                          {isAiPlaying ? "AI is Speaking..." : ""}
                      </span>}
                  </div>

                  <div className='h-px bg-gray-200'></div>

                  <div className='flex justify-center'>
                      <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60}/>
                  </div>

                  <div className='h-px bg-gray-200'></div>

                  <div className='grid grid-cols-2 gap-6 text-center'>
                    <div>
                      <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                      <span className='text-xs text-gray-400'>Current Question</span>
                    </div>

                    <div>
                      <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                      <span className='text-xs text-gray-400'>Total Questions</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* text section */}
              <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
                  <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
                      AI Smart Interview
                  </h2>

                  {!isIntroPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
                      <p className='text-xs sm:text-sm text-gray-400 mb-2'>Question {currentIndex + 1} of {questions.length}</p>

                      <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed'>
                          {currentQuestion?.question}
                      </div>
                  </div>)}

                  <textarea onChange={(e) => setAnswer(e.target.value)} value={answer} placeholder='Type your answer here...' className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800'>
                  </textarea>

                  {!feedback ? (<div className='flex items-center gap-4 mt-6'>
                      <motion.button 
                      onClick={toggleMic}
                      whileTap={{scale:0.9}}
                      className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'>
                          {isMicOn ?<FaMicrophone size={20}/> : <FaMicrophoneSlash size={20}/>}

                      </motion.button>

                      <motion.button
                      onClick={submitAnswer}
                      disabled={isSubmitting} 
                      whileTap={{scale:0.95}}
                      className='flex-1 bg-linear-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500'>
                          {isSubmitting ? "Submitting..." : "Submit Answer"}
                      </motion.button>

                  </div>) : (
                    <motion.div className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
                      <p className='text-emerald-700 font-medium mb-4'>
                        {feedback}
                      </p>

                      <button 
                      onClick={handleNext}
                      className='w-full flex items-center justify-center gap-1 bg-linear-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition'>

                        Next Question <BsArrowRight size={18}/>

                      </button>

                    </motion.div>
                  )}
              </div> 
        </div>
    </div>
  )
}

export default Step2Interview
