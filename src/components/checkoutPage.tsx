'use client'
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react";

const CheckoutPage = ({ amount }: { amount: number }) => {
const stripe = useStripe();
const elements = useElements();
const [error, setErrorMessage] = useState<string>();
const [clientSecret, setClientSecret] = useState("");
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) })
    })
      .then((res) => res.json())
      .then((data) => 
        setClientSecret(data.clientSecret)
      );
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if(!stripe || !elements) return;
   const {error:submitError} = await elements.submit()

   if(submitError){
    setErrorMessage(submitError.message);
    setIsLoading(false);
    return;
   }
   const { error } = await stripe?.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
        return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
    }
  })
    
  if(error){
    setErrorMessage(error.message)
  }else{

  }
setIsLoading(false)
  }

  if(!clientSecret|| !stripe || !elements){
    return <div>Procesing...</div>
  }

return(
    <form onSubmit={handleSubmit} className="mt-5">
        <PaymentElement />
        <button
          type="submit"
          className="text-white bg-blacky px-4 w-full py-2 rounded-md mt-5"
        >
          <span>{isLoading ? "Đang xử lý..." : "Thanh toán"}</span>
        </button>
    </form>
)
}

export default CheckoutPage;