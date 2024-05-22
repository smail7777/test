// TransportDetails.jsx
import React from 'react';

const TransportDetails = ({ transport }) => {
  return (
    <div>
      <h2>Transport Details</h2>
      <p>Title: {transport.title}</p>
      <p>Description: {transport.description}</p>
      <p>Address: {transport.address}</p>
      {/* Ajoutez d'autres détails du transport ici selon votre modèle de données */}
    </div>
  );
};

export default TransportDetails;
