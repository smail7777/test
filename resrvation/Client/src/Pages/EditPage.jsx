import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        name: '',
        phone: ''
    });

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`/bookings/${bookingId}`);
                const { checkIn, checkOut, name, phone } = response.data;
                setFormData({
                    checkIn: checkIn.slice(0, 10),
                    checkOut: checkOut.slice(0, 10),
                    name,
                    phone
                });
            } catch (error) {
                console.error('Error fetching booking:', error);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/bookings/${bookingId}`, formData);
            navigate('/account/bookings');
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    return (
        <div className="mt-8 flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
            <Link to="/account/bookings" className="flex mt-5 absolute top-12 left-6 text-gray-700 hover:text-gray-900">
    <svg className="w-4 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
    Back
</Link>

            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Booking</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">Check-In Date:</label>
                        <input
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">Check-Out Date:</label>
                        <input
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPage;
