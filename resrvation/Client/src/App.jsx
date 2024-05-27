import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
import EditPage from './Pages/EditPage.jsx';
import MyAccommodationBookingsPage from './Pages/MyAccommodationBookings.jsx';
import PaymentPage from './Pages/PaymentPage.jsx';
import BookingDetailsPage from './Pages/BookingDetailsPage.jsx';
import TransportPage from './Pages/TransportPage.jsx';
import TransportFormPage from './Pages/TransportFormPage.jsx';
import TransportBookPage from './Pages/TransportBookPage.jsx';
import TransportBookingWidget from './Pages/TransportBookingWidget.jsx';
import TransportBookingPage from './Pages/TransportBookingPage.jsx';
import TransportBookingDates from './TransportBookingDates.jsx';
import BookingTransport from './Pages/BookingTransport.jsx';
import EditTransport from './Pages/EditTransport.jsx';
import BookingTransportDetailsPage from './Pages/BookingTransportDetails.jsx';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
          <Route path="/account/bookings/:id/edit" element={<EditPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/account/my-accommodation-bookings" element={<MyAccommodationBookingsPage />} />
          <Route path="/account/bookings/:id/details" element={<BookingDetailsPage />} />
          <Route path="/account/transport" element={<TransportPage />} />
          <Route path="/account/transport/new" element={<TransportFormPage />} />
          <Route path="/account/transport/:id" element={<TransportFormPage />} />
          <Route path="/account/transport/:id/book" element={<TransportBookPage />} />
          <Route path="/bookings" element={<TransportBookingWidget />} />
          <Route path="/bookings-transport/:id" element={<TransportBookingPage />} />
          <Route path="/account/transport-bookings" element={<TransportBookingDates />} />
          <Route path="/account/Book" element={<BookingTransport />} />
          <Route path="/account/bookings-transport/:bookingId/edit" element={<EditTransport />} />
          <Route path="/account/bookings/:id/details-transport" element={<BookingTransportDetailsPage />} />

        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
