// BookingPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery.jsx";
import BookingDates from "../BookingDates.jsx";

export default function BookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        axios.get('/bookings').then(response => {
            const foundBooking = response.data.find(({ _id }) => _id === id);
            if (foundBooking) {
                setBooking(foundBooking);
            }
        });
    }, [id]);

    if (!booking) {
        return '';
    }

    // Calcul du prix en fonction du nombre de nuits
    const numberOfNights = calculateNumberOfNights(booking.checkIn, booking.checkOut);
    const totalPrice = numberOfNights * booking.place.price;

    return (
        <div className="my-8">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-2">Your booking information:</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    {/* Lien vers la page de paiement */}
                    <Link to="/payment" className="text-lg font-semibold">{`Total price: $${totalPrice}`}</Link>
                </div>
            </div>
            <PlaceGallery place={booking.place} />
        </div>
    );
}

// Fonction pour calculer le nombre de nuits entre deux dates
function calculateNumberOfNights(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000; // Nombre total de millisecondes dans un jour
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const numberOfNights = Math.round(Math.abs((startDate - endDate) / oneDay));
    return numberOfNights;
}
