import React, { useContext } from 'react'
import PayPalButton from '../../Component/PayPalButton';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { AppContext } from '../../Context/AppContext';

const Payment = () => {
    const { config } = useContext(AppContext);
  
  return (
    <>
    {config ? (
      <>
      <div>Payment</div>
                <PayPalScriptProvider options={{ "client-id": config.client_id, currency: "JPY" }}>
                  <PayPalButton />
                </PayPalScriptProvider>
      </>
    ) : (
    <></>
    )}
    </>
  )
}

export default Payment