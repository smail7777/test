import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  if (!booking) return <div className="flex items-center justify-center h-screen text-xl text-gray-700">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-12">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 w-full">Booking Details</h1>
      </div>
      <div className="flex justify-start ">
        <Link to="/account/my-accommodation-bookings" className="flex items-center text-gray-700 hover:text-gray-900">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-2xl p-10 transition duration-500 hover:shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">{booking.place.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-xl">
              <strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}
            </p>
            <p className="text-xl">
              <strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-xl">
              <strong>Name:</strong> {booking.name}
            </p>
            <p className="text-xl">
              <strong>Phone:</strong> {booking.phone}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-xl">
              <strong>Price:</strong> ${booking.price}
            </p>
            <p className="text-xl">
              <strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded-full text-white ${booking.status === 'validated' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </p>
            <p className="text-xl">
              <strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}
            </p>
            <p className="text-xl">
              <strong>User Name:</strong> {booking.user.name}
            </p>
            <p className="text-xl">
              <strong>User Email:</strong> {booking.user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
