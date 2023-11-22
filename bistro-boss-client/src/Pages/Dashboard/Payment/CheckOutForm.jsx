// import React from 'react';

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckOutForm = () => {
    const [clientSecret, setClientSecret] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const {user} = useAuth();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();
    const [cart, refetch] = useCart();
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    useEffect(() => {
        if(totalPrice > 0){
            axiosSecure.post('/create-payment-intent', {price: totalPrice})
            .then(res => {
                console.log("Client Secret recieved from backend : ",res.data.clientSecret);
                setClientSecret(res.data.clientSecret)
            })
        }

    },[axiosSecure, totalPrice]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card
        });

        if(error){
            console.log("Payment Error: ", error);
            setError(error.message)
        }
        else{
            console.log("Payment method: ", paymentMethod);
            setError('');
        }

        // Confirm Payment
        const { paymentIntent, error: confirmError} = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user?.email || 'Anonymous',
                        name: user?.displayName || 'Anonymous'
                    }
                }
            }
        );

        if(confirmError){
            console.log("COnfirm Error: ", confirmError);
        }
        else{
            console.log("Payment Intent: ", paymentIntent);
            if(paymentIntent.status === "succeeded"){
                console.log("Transacction ID: ", paymentIntent.id);
                setTransactionId(paymentIntent.id);

                // Now save the payment in the database:
                const payment = {
                    email: user.email,
                    price: totalPrice,
                    transactionId: paymentIntent.id,
                    date: new Date(), // UTC date convert. Use moment JS
                    cartIds: cart.map(item => item._id),
                    menuItemIds: cart.map(item => item.menuId),
                    status: "Pending"
                }

                const res = await axiosSecure.post("/payments", payment);
                console.log("Payment saved on DB: ", res);

                refetch();
                if(res.data?.paymentResult?.insertedId){
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Thanks for the taka ahah",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/dashboard/paymentHistory");
                }
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            <button 
                className="btn btn-outline btn-neutral btn-sm my-4" type="submit" 
                disabled={!stripe || !clientSecret}
            >
                Pay
            </button>
            <p className="text-red-600">{error}</p>
            {
                transactionId && <p className="text-green-600">Transaction ID: {transactionId}</p>
            }
        </form>
    );
};

export default CheckOutForm;