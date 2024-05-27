import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AccountNav from '../AccountNav';
import PlaceImg from '../PlaceImg';
import BookingDates from '../BookingDates';
import { Link } from 'react-router-dom';

const MyAccommodationBookingsPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchReceivedBookings();
    }, []);

    const fetchReceivedBookings = async () => {
        try {
            const response = await axios.get('/owner/bookings');
            console.log('Fetched Bookings:', response.data); // Debugging log
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching received bookings:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/transport/bookings/${id}`);
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
        } catch (error) {
            console.error('Error deleting transport booking:', error);
        }
    };

    const handleDeleteAccommodation = async (id) => {
        try {
            await axios.delete(`/bookings/${id}`);
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
        } catch (error) {
            console.error('Error deleting accommodation booking:', error);
        }
    };

    const handleValidateAccommodation = async (id) => {
        try {
            await axios.put(`/bookings/${id}/validate`);
            setBookings(prevBookings => prevBookings.map(booking =>
                booking._id === id ? { ...booking, status: 'validated' } : booking
            ));
        } catch (error) {
            console.error('Error validating accommodation booking:', error);
        }
    };

    const handleValidateTransport = async (id) => {
        try {
            await axios.post(`/owner/bookings/${id}/validate`);
            setBookings(prevBookings => prevBookings.map(booking =>
                booking._id === id ? { ...booking, status: 'validated' } : booking
            ));
        } catch (error) {
            console.error('Error validating booking:', error);
        }
    };

    // Fonction pour calculer le nombre de nuits entre deux dates
    const calculateNumberOfNights = (checkIn, checkOut) => {
        const oneDay = 24 * 60 * 60 * 1000; // Nombre total de millisecondes dans un jour
        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const numberOfNights = Math.round(Math.abs((startDate - endDate) / oneDay));
        return numberOfNights;
    };

    // Fonction pour calculer le prix total en fonction du nombre de nuits
    const calculateTotalPrice = (booking) => {
        const numberOfNights = calculateNumberOfNights(booking.checkIn, booking.checkOut);
        if (booking.place) {
            return numberOfNights * booking.place.price;
        } else if (booking.transport) {
            return numberOfNights * booking.transport.price;
        } else {
            return 0; // Mettez ici la logique si aucun prix n'est trouvé
        }
    };

    return (
        <div className="mt-5 min-h-screen bg-gradient-to-r from-blue-50 to-purple-100">
            <AccountNav />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Received Bookings</h1>
                <div className="grid grid-cols-1 gap-6">
                    {bookings.length > 0 ? bookings.map(booking => (
                        <div key={booking._id} className="flex gap-4 bg-white rounded-2xl shadow-lg p-4 transform hover:scale-105 transition duration-300">
                            <div className="w-48 relative">
                                <div className={`absolute top-0 left-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'validated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {booking.status === 'validated' ? 'Validated' : 'Pending'}
                                </div>
                                <div className="h-full rounded-lg overflow-hidden">
                                    {booking.place ? (
                                        <PlaceImg place={booking.place} className="w-full h-full object-cover" />
                                    ) : booking.transport ? (
                                        <PlaceImg place={booking.transport} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="py-3 pr-3 flex flex-col justify-between flex-grow">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        {booking.place ? booking.place.title : booking.transport ? booking.transport.title : 'No Title Available'}
                                    </h2>
                                    <BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />
                                    <div className="text-xl text-gray-700 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 inline-block mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                        </svg>
                                        Total price: ${calculateTotalPrice(booking)}
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4">
                                   
                                    {/* La logique pour le rendu des boutons reste la même */}
{booking.place ? (
    <Link to={`/account/bookings/${booking._id}/details`} className="flex items-center text-blue-500 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        View Details
    </Link>
) : booking.transport ? (
    <Link to={`/account/bookings/:id/details-transport`} className="flex items-center text-blue-500 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        View Details
    </Link>
) : (
    <div>No Details Available</div>
)}

                                    {booking.transport ? (
                                        <div className="flex gap-2 items-center">
                                            <button className="flex bg-transparent text-red-500 hover:text-red-700" onClick={() => handleDelete(booking._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                                Delete 
                                            </button>
                                            <button className="flex bg-transparent text-green-500 hover:text-green-700" onClick={() => handleValidateTransport(booking._id)}>
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                               <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                             </svg>
                                                Validate 
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center">
                                            <button className="flex bg-transparent text-red-500 hover:text-red-700" onClick={() => handleDeleteAccommodation(booking._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                                Delete 
                                            </button>
                                            <button className="flex bg-transparent text-green-500 hover:text-green-700" onClick={() => handleValidateAccommodation(booking._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                               <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                             </svg>
                                                Validate 
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-gray-600 text-lg mt-8">
                            No received bookings found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccommodationBookingsPage;
