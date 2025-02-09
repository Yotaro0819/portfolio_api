import React, { useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ post }) => {

  const createOrder = async () => {
    try {
      const response = await fetch(`/api/paypal/create-order/${post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        // PayPalのapproveリンクにリダイレクト
        window.location.href = data.redirect_url;
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  return (
    // <PayPalScriptProvider options={{ "client-id": config.client_id, currency: "JPY" }}>
    <PayPalButtons
    createOrder={createOrder}
    onApprove={async (data, actions) => {
      try {
        const details = await actions.order.authorize();
        console.log("Payment Successful", details);
      } catch (error) {
        console.error("Payment error:", error);
      }
    }}
  />
    // </PayPalScriptProvider>
  );
};

export default PayPalButton;
