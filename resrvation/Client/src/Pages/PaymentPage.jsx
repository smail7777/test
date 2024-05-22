// PaymentPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CardPaymentForm from "./CardPaymentForm";
import PaypalPaymentForm from "./PaypalPaymentForm";

const PaymentPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Payment</h1>
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Choose payment method:</h2>
        <div className="flex gap-4">
          <div className="bg-gray-100 p-4 rounded-lg flex-1">
            <h3 className="text-lg font-semibold mb-2">Credit Card</h3>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
              onClick={() => handlePaymentMethodChange("card")}
            >
              Pay with Credit Card
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex-1">
            <h3 className="text-lg font-semibold mb-2">PayPal</h3>
            <PaypalPaymentForm />
          </div>
        </div>
        {selectedPaymentMethod === "card" && <CardPaymentForm />}
      </div>
    </div>
  );
};

export default PaymentPage;
