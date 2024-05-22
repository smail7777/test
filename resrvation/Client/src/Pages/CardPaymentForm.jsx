// CardPaymentForm.jsx
import React, { useState } from "react";

const CardPaymentForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour soumettre les détails de la carte de crédit
    console.log("Card Payment Details:", { cardNumber, expiryDate, cvv });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Expiry Date</label>
        <input
          type="text"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">CVV</label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4">
        Pay with Credit Card
      </button>
    </form>
  );
};

export default CardPaymentForm;
