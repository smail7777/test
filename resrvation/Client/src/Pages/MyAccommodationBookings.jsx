import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountNav from '../AccountNav';
import PlaceImg from '../PlaceImg';
import BookingDates from '../BookingDates';

const MyAccommodationBookingsPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const accommodationBookings = await axios.get('/my-accommodation-bookings');
            const transportBookings = await axios.get('/transport/bookings');
            const mergedBookings = [
                ...accommodationBookings.data,
                ...transportBookings.data.map(item => ({
                    ...item,
                    place: item.transport,
                    isTransport: true,
                })),
            ];
            setBookings(mergedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/account/bookings/${id}/edit`);
    };

    const handleDelete = async (id, isTransport) => {
        try {
            const url = isTransport ? `/transport/bookings/${id}` : `/bookings/${id}`;
            await axios.delete(url);
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const handleValidate = async (id, isTransport) => {
        try {
            const url = isTransport ? `/bookings-transport/${id}/validate` : `/bookings/${id}/validate`;
            await axios.put(url);
            setBookings(prevBookings => prevBookings.map(booking => booking._id === id ? { ...booking, status: 'validated' } : booking));
        } catch (error) {
            console.error('Error validating booking:', error);
        }
    };

    return (
        <div className="mt-5 min-h-screen bg-gradient-to-r from-blue-50 to-purple-100">
            <AccountNav />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Bookings</h1>
                <div className="grid grid-cols-1 gap-6">
                    {bookings.length > 0 ? (
                        bookings.map(booking => (
                            <div key={booking._id} className="flex gap-4 bg-white rounded-2xl shadow-lg p-4 transform hover:scale-105 transition duration-300">
                                <div className="w-48 relative">
                                    <div className={`absolute top-0 left-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'validated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {booking.status === 'validated' ? 'Validated' : 'Pending'}
                                    </div>
                                    <div className="h-full rounded-lg overflow-hidden">
                                        <PlaceImg place={booking.place} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="py-3 pr-3 flex flex-col justify-between flex-grow">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-800">{booking.place ? booking.place.title : 'No Title Available'}</h2>
                                        <BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />
                                        <div className="text-xl text-gray-700 flex items-center">
                                            Total price: ${booking.price}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <Link to={`/account/bookings/${booking._id}/details`} className="flex items-center text-blue-500 hover:text-blue-700">
                                            View Details
                                        </Link>
                                        <button className="flex items-center text-green-500 hover:text-green-700" onClick={() => handleValidate(booking._id, booking.isTransport)}>
                                            Validate
                                        </button>
                                        <button className="flex items-center text-red-500 hover:text-red-700" onClick={() => handleDelete(booking._id, booking.isTransport)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-600 text-lg mt-8">
                            No bookings found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccommodationBookingsPage;
