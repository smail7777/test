import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
    const [places, setPlaces] = useState([]);
    const [transports, setTransports] = useState([]);

    useEffect(() => {
        // Récupération des lieux
        axios.get('/places').then(response => {
            setPlaces(response.data);
        });
        
        // Récupération des transports
        axios.get('/all-transports').then(response => {
            setTransports(response.data);
        });
    }, []);

    return (
        <div>
            {/* Section des lieux et des transports */}
            <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {/* Lieux */}
                {places.length > 0 && places.map(place => (
                    <Link key={place._id} to={`/place/${place._id}`} className="hover:no-underline">
                        <div className="bg-gray-500 mb-2 rounded-2xl flex">
                            {place.photos?.[0] && (
                                <img className="rounded-2xl object-cover aspect-square" src={`http://localhost:4000/uploads/${place.photos?.[0]}`} alt="" />
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold">{place.address}</h2>
                            <h3 className="text-sm text-gray-500">{place.title}</h3>
                            <div className="mt-1">
                                <span className="font-bold">${place.price}</span> per night  
                            </div>            
                        </div>
                    </Link>
                ))}

                {/* Transports */}
                {transports.length > 0 && transports.map(transport => (
                    <Link key={transport._id} to={`/account/transport/${transport._id}/book`} className="hover:no-underline">
                        <div className="bg-gray-500 mb-2 rounded-2xl flex">
                            {/* Assurez-vous d'avoir une image de transport pour l'afficher */}
                            {transport.photos?.[0] && (
                                <img className="rounded-2xl object-cover aspect-square" src={`http://localhost:4000/uploads/${transport.photos?.[0]}`} alt="" />
                            )}
                        </div>
                        <div>
                            <h2 className="font-bold">{transport.address}</h2>
                            <h3 className="text-sm text-gray-500">{transport.title}</h3>
                            <div className="mt-1">
                                <span className="font-bold">${transport.price}</span> per night  
                            </div>            
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
