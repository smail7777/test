import PhotosUploader from "../PhotosUploader.jsx";
import { useState, useEffect } from "react";
import AccountNav from "../AccountNav.jsx";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function TransportFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [price, setPrice] = useState(100);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/transports/${id}`).then(response => {
            const { data } = response;
            setTitle(data.title);
            setDescription(data.description);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setPrice(data.price);
            setExtraInfo(data.extraInfo || ''); 
            setCheckIn(data.checkIn || ''); 
            setCheckOut(data.checkOut || ''); 

        }).catch(error => {
            console.error('Error fetching transport:', error);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function saveTransport(ev) {
        ev.preventDefault();
        // Vérifier les champs obligatoires
        if (!title || !description || !address || !checkIn || !checkOut) {
            alert('Please fill in all required fields.');
            return;
        }

        const transportData = {
            title,
            description,
            address,
            addedPhotos,
            price,
            extraInfo,
            checkIn,
            checkOut,
        };
        try {
            if (id) {
                // Mettre à jour le transport
                await axios.put(`/transports/${id}`, transportData);
            } else {
                // Nouveau transport
                await axios.post('/transports', transportData);
            }
            // Redirection vers la page des transports dans le compte après la soumission réussie
            navigate('/account/transport');
        } catch (error) {
            console.error('Error saving transport:', error);
        }
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={saveTransport}>
                {preInput('Title', 'Title for your transport. Should be short and catchy.')}
                <input 
                    type="text" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)} 
                    placeholder="Title, for example: Luxury Car" 
                />
                {preInput('Description', 'Description of the transport')}
                <textarea 
                    value={description} 
                    onChange={ev => setDescription(ev.target.value)} 
                />
                {preInput('Address', 'Address of the transport')}
                <input 
                    type="text" 
                    value={address} 
                    onChange={ev => setAddress(ev.target.value)} 
                    placeholder="Address" 
                />
                {preInput('Photos', 'More photos = better')}
                <PhotosUploader 
                    addedPhotos={addedPhotos} 
                    onChange={setAddedPhotos} 
                />
                {preInput('Price', 'Price per day')}
                <input 
                    type="number" 
                    value={price} 
                    onChange={ev => setPrice(ev.target.value)} 
                />
                {preInput('Extra Info', 'Additional information about the transport')}
                <textarea 
                    value={extraInfo} 
                    onChange={ev => setExtraInfo(ev.target.value)} 
                />
                {preInput('Departure Date', 'Date of departure')}
                <input 
                    type="text" 
                    value={checkIn} 
                    onChange={ev => setCheckIn(ev.target.value)} 
                />
                {preInput('Return Date', 'Date of return')}
                <input 
                    type="text" 
                    value={checkOut} 
                    onChange={ev => setCheckOut(ev.target.value)} 
                />
                <button className="primary my-4">Save</button>
            </form>
        </div>
    );
}
