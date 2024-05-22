import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from 'date-fns';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function TransportBookingWidget({ transport }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState(null); // Utilisation de null pour indiquer qu'aucune redirection n'est nécessaire
  const [bookingError, setBookingError] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisTransport() {
    // Vérifier si tous les champs obligatoires sont remplis
    if (!checkIn || !checkOut || !name || !phone) {
      setBookingError('Please fill in all required fields.');
      return;
    }
  
    // Vérifier que checkOut est postérieur à checkIn
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      setBookingError('Check-out date must be after check-in date.');
      return;
    }
  
    try {
      const response = await axios.post('/bookings-transport', {
        transport: transport._id,
        checkIn,
        checkOut,
        name,
        phone,
      });
  
      const bookingId = response.data._id;
      // Rediriger vers la page BookingTransportInfos avec l'ID de la réservation
      setRedirect(`/bookings-transport/${bookingId}`);
    } catch (error) {
      setBookingError('An unexpected error occurred. Please try again later.');
      console.error('Error making booking:', error);
  
      setTimeout(() => {
        setBookingError('');
      }, 5000);
    }
  }
  
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  
  return (
    <div className="bg-white shadow p-4 rounded-2xl">
<div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${transport.price} / per trip
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Departure Date:</label>
            <input type="date" value={checkIn} onChange={(ev) => setCheckIn(ev.target.value)} />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Return Date:</label>
            <input type="date" value={checkOut} onChange={(ev) => setCheckOut(ev.target.value)} />
          </div>
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
            <label>Phone number:</label> <br />
            <input type="tel" value={phone} onChange={(ev) => setPhone(ev.target.value)} />
          </div>
        )}
      </div>
      <button onClick={bookThisTransport} className="primary mt-4">
        Book this transport
        {numberOfNights > 0 && (
          <span> ${numberOfNights * transport.price}</span>
        )}
      </button>
      {bookingError && (
        <div className="text-red-500 mt-2">{bookingError}</div>
      )}
    </div>    </div>
  );
}
