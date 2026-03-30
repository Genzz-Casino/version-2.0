import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/home/Home'
import Payment from './pages/payment/Payment'
import Verification from './pages/verification/Verification'
import OtpVerification from './pages/otpverification/Otpverification'
import PinVerification from './pages/pinverification/PinVerification'
import Confirmation from './pages/confirm/Confirmation'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/loan-request" element={<Payment/>}/>
        <Route exact path="/number-verification" element={<Verification/>}/>
        <Route exact path="/otp-verification" element={<OtpVerification/>}/>
        <Route exact path="/pin-verification" element={<PinVerification/>}/>
        <Route exact path="/processing" element={<Confirmation/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
