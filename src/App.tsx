import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserForm from './page/userForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className=" h-screen w-full flex items-center  justify-center">
        
        <UserForm />
      </div>
    </>
  )
}

export default App
