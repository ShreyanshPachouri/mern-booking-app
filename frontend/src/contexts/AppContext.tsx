import React, { useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client'
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";


type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
  
};

type AppContext = {
    showToast: (toastMessage: ToastMessage) => void
    isLoggedIn: boolean
    stripePromise: Promise <Stripe | null>
}
//The type AppContext contains all the things that we are exposing to the different components. All the things inside AppContext will be availabe to all the components.

const AppContext = React.createContext<AppContext | undefined>(undefined)

const stripePromise = loadStripe(STRIPE_PUB_KEY);

export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
    const[toast, setToast] = useState<ToastMessage | undefined>(undefined)

    const {isError} = useQuery("validateToken", apiClient.validateToken, {retry: false})
    //The result is stored in the validateToken key
    return (
        <AppContext.Provider
          value={{
            showToast: (toastMessage) => {
              setToast(toastMessage);
            },
            isLoggedIn: !isError,
            stripePromise
          }}
        >
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(undefined)}
            />
          )}
          {children}
        </AppContext.Provider>
      );
    };

export const useAppContext = () => {
    const context = React.useContext(AppContext)
    return context as AppContext
}