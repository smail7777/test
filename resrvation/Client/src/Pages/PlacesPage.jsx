import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";
import { useState, useEffect } from "react";
import PlaceImg from "../PlaceImg";

axios.defaults.baseURL = 'http://localhost:4000';

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/user-places');
                setPlaces(response.data);
            } catch (error) {
                console.error('Error fetching places:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/places/${id}`);
            setPlaces(prevPlaces => prevPlaces.filter(place => place._id !== id));
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    };

    return (
        <div className="mt-5 min-h-screen bg-gradient-to-r from-blue-50 to-purple-100">
            <AccountNav />
            <div className="text-center mt-8">
                <Link className="inline-flex gap-1 items-center bg-blue-500 text-white py-3 px-8 rounded-full shadow-md hover:bg-blue-600 transition duration-300" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className="mt-8 px-4">
                {places.length > 0 ? places.map(place => (
                    <div key={place._id} className="flex flex-col md:flex-row cursor-pointer gap-4 bg-white p-6 rounded-2xl shadow-lg mb-6 transform hover:scale-105 transition duration-300">
                        <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 p-4 rounded-2xl">
                        <div className="flex w-full md:w-1/3 h-48 bg-gray-200 rounded-lg overflow-hidden">
                            <PlaceImg place={place} />
                        </div>
                        <div className="flex-grow">
                        <h2 className="text-2xl font-semibold text-gray-800">{place.title}</h2>
                        <p className="text-gray-600 mt-2">{place.description}</p>
                        
                        </div>
                    </Link>
                       
                        <button className="flex text-red-500 hover:text-red-700 items-center ml-auto bg-transparent" onClick={() => handleDelete(place._id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete
                        </button>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-xl text-gray-700">No bookings found for your accommodations.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
