// TransportBookingPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TransportGallery from "../TransportGallery.jsx";

export default function TransportBookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        axios.get(`/bookings-transport/${id}`).then(response => {
            if (response.data) {
                setBooking(response.data);
            }
        });
    }, [id]);

    if (!booking) {
        return '';
    }

    // Calcul du prix en fonction de la durée
    const numberOfDays = calculateNumberOfDays(booking.checkIn, booking.checkOut);
    const totalPrice = numberOfDays * booking.transport.price;

    return (
        <div className="my-8">
            <h1 className="text-3xl">{booking.transport.title}</h1>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-2">Your booking information:</h2>
                    <div>
                        <p>Departure Date: {booking.checkIn}</p>
                        <p>Return Date: {booking.checkOut}</p>
                        <p>Name: {booking.name}</p>
                        <p>Phone: {booking.phone}</p>
                    </div>
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    {/* Lien vers la page de paiement */}
                    <Link to="/payment" className="text-lg font-semibold">{`Total price: $${totalPrice}`}</Link>
                </div>
            </div>
            <TransportGallery transport={booking.transport} />
        </div>
    );
}

// Fonction pour calculer le nombre de jours entre deux dates
function calculateNumberOfDays(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000; // Nombre total de millisecondes dans un jour
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const numberOfDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return numberOfDays;
}
