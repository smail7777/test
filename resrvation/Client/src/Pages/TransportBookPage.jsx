import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TransportBookingWidget from "./TransportBookingWidget.jsx";
import TransportGallery from "../TransportGallery.jsx";
import TransportAddressLink from "../TransportAddressLink.jsx";

export default function TransportBookPage() {
    const { id } = useParams();
    const [transport, setTransport] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        
        axios.get(`/transports/${id}`).then(response => {
            setTransport(response.data);
        }).catch(error => {
            console.error('Error fetching transport:', error);
        });
    }, [id]);

    if (!transport) return null;

    // Vérifiez si les propriétés checkIn et checkOut sont présentes dans l'objet transport
    if (!transport.checkIn || !transport.checkOut) {
        return <div>Check-in and/or check-out dates not found for this transport.</div>;
    }

    return (
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
            <h1 className="text-2xl">{transport.title}</h1>
            <TransportAddressLink>{transport.address}</TransportAddressLink>
            <TransportGallery transport={transport} />
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        <p>{transport.description}</p>
                    </div>
                    <div>Check-in: {transport.checkIn}</div>
                    <div>Check-out: {transport.checkOut}</div>
                </div>
                <div>
                    <TransportBookingWidget transport={transport} />
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{transport.extraInfo}</div>
            </div>
        </div>
    );
}
