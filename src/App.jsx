import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import QuoteGen from './Components/QuoteGen'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuoteGen />} />
        </Routes>
      </BrowserRouter>
        
      
    </div>
  )
}

export default App
