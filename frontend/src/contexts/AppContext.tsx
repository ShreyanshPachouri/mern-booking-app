import React, { useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client'

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
  
};

type AppContext = {
    showToast: (toastMessage: ToastMessage) => void
    isLoggedIn: boolean
}
//The type AppContext contains all the things that we are exposing to the different components. All the things inside AppContext will be availabe to all the components.

const AppContext = React.createContext<AppContext | undefined>(undefined)

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