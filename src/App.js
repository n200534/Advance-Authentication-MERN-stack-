

import './App.css';
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login'
import Signup from './components/Signup'
import Welcome from './components/Welcome';

function App() {
  return (
    <>
      <header>
      <NavBar/>
    </header>
      
    <main>
      <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/user' element={<Welcome/>}/>

          
      </Routes>
    </main>
    </>
    
)}

export default App;
