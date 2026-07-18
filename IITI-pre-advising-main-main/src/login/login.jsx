import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import iitiLOGO from '../navbar/navbarLOGO/iitiLogo.png'   

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    setLoading(true)
    try {
      const res = await fetch('/bridge/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        // Try to parse backend error message (if any)
        let errMsg = `Server responded with status ${res.status}`
        try {
          const errData = await res.json()
          if (errData && errData.error) errMsg = errData.error
        } catch (e) {
          // non-JSON response
        }
        alert(errMsg || 'Hindi ma-connect sa server, subukan ulit')
        return
      }

      // Parse JSON safely
      let data = null
      try {
        data = await res.json()
      } catch (e) {
        console.error('Failed to parse JSON from /bridge/login', e)
        alert('Maling tugon mula sa server, subukan ulit')
        return
      }

      if (data && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        const msg = (data && (data.error || data.message)) || 'Invalid credentials'
        alert(msg)
      }
    } catch (err) {
      console.error('Login request failed', err)
      alert('Hindi ma-connect sa server, subukan ulit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen font-RB bg-[#3B8126] px-4 py-8'>
        
        <div 
            className='bg-white rounded-2xl shadow-xl w-86.75 h-149.5 overflow-hidden flex flex-col'
        >
              
            <div className='flex flex-col h-full justify-start'>

                <div className="flex flex-col items-center pt-10 px-8">
                  <img 
                    src={iitiLOGO} 
                    alt="IITI Logo" 
                    className="bg-white rounded-full w-24 h-24" 
                  />
                  <div className="mt-4 text-center">
                    <h1 className='font-RB font-semibold text-center text-xl leading-7 tracking-tight'>
                      Instituto ng Teknolohiya ng
                      <br />Impormasyon at Pagbabago
                    </h1>
                  </div>
                </div>

                <div className='px-8 pt-28'>
                  <form onSubmit={handleSubmit}
                    className='flex flex-col items-center space-y-4'>
                        {/*username*/}
                        <input  type="text" id="username" name="username" required
                                className='input-field border border-[#0E5A1280] rounded-full
                                           h-[43px] w-[293px] p-4 
                                           focus:outline-none focus:ring-2 focus:ring-green-400
                                           placeholder:text-xs text-black/45
                                           cursor-pointer active:scale-95' 
                                placeholder='Username'/>

                        <div className='relative'>
                            <input  type={showPassword ? "text" : "password"} id="password" name="password" required
                                    className='input-field border border-[#0E5A1280] rounded-full
                                               h-[43px] w-[293px] p-4 pr-11
                                               focus:outline-none focus:ring-2 focus:ring-green-400
                                               placeholder:text-xs text-black/45
                                               cursor-pointer active:scale-95' 
                                    placeholder='Password'/>
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className='absolute inset-y-0 right-3 flex items-center justify-center text-[#0E5A12] cursor-pointer'
                                aria-label='Toggle password visibility'
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.5-6.75 9.75-6.75S21.75 12 21.75 12s-3.5 6.75-9.75 6.75S2.25 12 2.25 12Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 002.83 2.83" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.53 6.53C4.36 8 2.75 10 2.25 12c0 0 3.5 6.75 9.75 6.75 1.86 0 3.47-.5 4.83-1.22M9.9 5.4A9.77 9.77 0 0112 5.25c6.25 0 9.75 6.75 9.75 6.75-.47 .91-1.14 1.9-2 2.8" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/*Login Button */}
                        <div>

                            <button
                              type="submit"
                              disabled={loading}
                              aria-busy={loading}
                              className=" bg-[#1C6100] rounded-full w-72.5 h-10.75 cursor-pointer active:scale-95 disabled:opacity-60"
                            >
                              <h1 className="font-bold text-white">
                                {loading ? 'LOADING...' : 'LOG IN'}
                              </h1>
                            </button>

                        </div>

                    </form>
                </div>
            </div>


        </div>

    </div>
  )
}

export default Login
