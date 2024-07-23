import { useMutation, useQueryClient } from "react-query"
import * as apiClient from '../api-client'
import { useAppContext } from "../contexts/AppContext"

const SignOutButton = () => {
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async() => {
            await queryClient.invalidateQueries("validateToken")
            // This line uses the queryClient to invalidate any queries associated with the key "validateToken". This is typically done to refresh or refetch the data related to that query key, ensuring that any subsequent operations use the most up-to-date information. It will ensure that the user gets signed out as soon as he clicks the button and will not have to refresh the page to see that he is signed out. 
            showToast({message: "Signed Out!", type: "SUCCESS"})
        }, onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"})
        }
    })

    const handleClick = () => {
        mutation.mutate()
    }
    return (
        <button onClick = {handleClick} className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">Sign Out</button>
    )
} 

export default SignOutButton