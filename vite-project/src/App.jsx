import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TextEditor from './components/TextEditor'
import SignUp from './auth/signup'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import SignIn from './auth/signin';
import {v4 as uuidv4} from 'uuid';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' exact/>
        <Redirect to={`/documents/${uuidv4()}`}/>
<Route path= "/signup" element={<SignUp/>}/>
<Route path= "/signin" element={<SignIn/>}/>
<Route path='/document/:id'>
<TextEditor/>
</Route>
      </Routes>
    </Router>
  )
}

export default App
