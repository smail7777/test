import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from 'date-fns';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1); 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const { user } = useContext(UserContext);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    // Vérifier si tous les champs obligatoires sont remplis
    if (!checkIn || !checkOut || !numberOfGuests || !name || !phone) {
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

    // Vérifier que numberOfGuests est supérieur à zéro
    if (numberOfGuests <= 0) {
      setBookingError('Number of guests must be greater than zero.');
      return;
    }

    // Calculer le prix
    const price = numberOfGuests * place.price; 

    try {
      const response = await axios.post('/bookings', {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: price,
      });

      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setBookingError('The selected dates are already booked. Please choose other dates.');
      } else {
        setBookingError('An unexpected error occurred. Please try again later.');
        console.error('Error making booking:', error);
      }

      setTimeout(() => {
        setBookingError('');
      }, 5000);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date" value={checkIn} onChange={(ev) => setCheckIn(ev.target.value)} />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" value={checkOut} onChange={(ev) => setCheckOut(ev.target.value)} />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number" value={numberOfGuests} onChange={(ev) => setNumberOfGuests(ev.target.value)} />
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
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
      {bookingError && (
        <div className="text-red-500 mt-2">{bookingError}</div>
      )}
    </div>
  );
}
