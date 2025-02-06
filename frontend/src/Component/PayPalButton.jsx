import React, { useContext } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount }) => {
  return (
    // <PayPalScriptProvider options={{ "client-id": config.client_id, currency: "JPY" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount, // 支払い金額
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            console.log("Payment Successful", details);
          });
        }}
      />
    // </PayPalScriptProvider>
  );
};

export default PayPalButton;
