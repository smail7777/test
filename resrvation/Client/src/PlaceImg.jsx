export default function PlaceImg({ place, index = 0, className = null }) {
    if (!place.photos?.length) {
        return '';
    }

    // Ajouter la classe 'h-full' si className est null
    if (!className) {
        className = 'object-cover h-full'; // Ajout de 'h-full' ici
    } else {
        className += ' h-full'; // Ajout de 'h-full' si className est défini
    }

    return (
        <img className={className} src={'http://localhost:4000/uploads/' + place.photos[index]} alt="" />
    );
}
