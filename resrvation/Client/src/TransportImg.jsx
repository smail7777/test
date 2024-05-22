export default function TransportImg({ transport, index = 0, className = null }) {
    if (!transport.photos?.length) {
        return <div className="flex justify-center items-center w-full h-full bg-gray-300 text-gray-500">No Image Available</div>;
    }

    // Ajouter la classe 'h-full' si className est null
    if (!className) {
        className = 'object-cover h-full'; // Ajout de 'h-full' ici
    } else {
        className += ' h-full'; // Ajout de 'h-full' si className est défini
    }

    return (
        <img className={className} src={'http://localhost:4000/uploads/' + transport.photos[index]} alt={transport.title} />
    );
}
