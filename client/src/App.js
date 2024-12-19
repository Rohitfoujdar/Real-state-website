import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AuthProvider from './context/auth';
import Main from './components/nav/Main';
import {Toaster} from "react-hot-toast"
import AccounActivate from './pages/auth/AccounActivate';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Main/>
        <Toaster/>
        <AuthProvider>
          <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/auth/activate-account/:token' element={<AccounActivate/>}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
