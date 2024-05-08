
import './App.css'
import {Route, Routes} from "react-router-dom";
import LoginPage from './Pages/Loginpage.jsx';
import Layout from './Pages/Layout.jsx';
import IndexPage from './Pages/IndexPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import axios from 'axios';
import { UserContextProvider } from './UserContext.jsx';
 import ProfilePage from './Pages/ProfilePage.jsx';
import PlacesPage from './Pages/PlacesPage.jsx';
import PlacesFormPage from './Pages/PlacesFormPage.jsx';
import PlacePage from './Pages/PlacePage.jsx';
import BookingsPage from './Pages/BookingsPage.jsx';
import BookingPage from './Pages/BookingPage.jsx';

axios.defaults.baseURL= 'http://localhost:4000';
axios.defaults.withCredentials= true ;

function App() {

  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}>
         <Route index element={<IndexPage  />} />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/Register" element={<RegisterPage />} />
         <Route path="/account" element={<ProfilePage />} />
         <Route path="/account/places" element={<PlacesPage />} />
         <Route path="/account/places/new" element={<PlacesFormPage  />} />
         <Route path="/account/places/:id" element={<PlacesFormPage  />} />c
         <Route path="/place/:id" element={<PlacePage  />} />
         <Route path="/account/bookings" element={<BookingsPage />} />
         <Route path="/account/bookings/:id" element={<BookingPage />} />
         
         </Route>
 
    </Routes> 
    </UserContextProvider>
  )
}

export default App
