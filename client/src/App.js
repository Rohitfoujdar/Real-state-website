import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AuthProvider from './context/auth';
import Main from './components/nav/Main';
import {Toaster} from "react-hot-toast"
import AccounActivate from './pages/auth/AccounActivate';
import ForgetPassword from './pages/auth/ForgetPassword';
import AccessAccount from './pages/auth/AccessAccount';
import Dashboard from './pages/user/Dashboard';
import Adcreate from './pages/user/ad/AdCreate';
import PrivateRoute from './components/routes/PrivateRoute';
import SellHouse from './pages/user/ad/SellHouse';
import SellLand from './pages/user/ad/SellLand';
import RentHouse from './pages/user/ad/RentHouse';
import RentLand from './pages/user/ad/RentLand';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Main/>
          <Toaster/>
          <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/auth/activate-account/:token' element={<AccounActivate/>}/>
          <Route path='/auth/forget-password' element={<ForgetPassword/>}/>
          <Route path='/auth/access-account/:token' element={<AccessAccount/>}/>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='ad/create' element={<Adcreate/>}/>
            <Route path='ad/create/sell/house' element={<SellHouse/>}/>
            <Route path='ad/create/sell/land' element={<SellLand/>}/>
            <Route path='ad/create/rent/house' element={<RentHouse/>}/>
            <Route path='ad/create/rent/land' element={<RentLand/>}/>
          </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
