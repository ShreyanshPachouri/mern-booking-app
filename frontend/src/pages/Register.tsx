import {useForm} from "react-hook-form"
import {useMutation, useQueryClient} from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

const Register = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const {showToast} = useAppContext()
    const {register, watch, handleSubmit, formState: {errors}} = useForm<RegisterFormData>()

    const mutation = useMutation(apiClient.register,{
        onSuccess: async() => {
            showToast({message: "Registartion success", type: "SUCCESS"})
            await queryClient.invalidateQueries("validateToken")
            navigate("/")
    },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"})
        }
    }
)
// The first argument is the function that performs the mutation. In this case, it's apiClient.register, which likely sends a POST request to your registration endpoint.
// The second argument is an object containing options to configure the mutation's behavior, including callback functions for success and error scenarios.

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)
    })
    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Create an account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {...register("firstName", {required: "This field is required"})}></input>
                    {/* The {...register("firstName", { required: "This field is required" })} part uses the register function from the react-hook-form library to connect the input field to form handling logic. It specifies that the firstName field is required, and if it's not filled out, an error message ("This field is required") will be shown. */}
                    {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                    {...register("lastName", {required: "This field is required"})}></input>
                    {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
                </label>
            </div>

            <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type = "email"className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", {required: "This field is required"})}></input>
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </label>

                <label className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type = "password"className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {required: "This field is required", 
                    minLength: 
                    {value: 6,
                    message: "Password must be at least 6 characters long"}})}></input>
                    {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </label>

                    
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Confirm Password
                    <input type = "password"className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        // The confirmPassword field is registered with a custom validation function.
                        // validate: This is a custom validation function that takes the value (val) of the confirmPassword input field as an argument.
                        validate: (val) => {
                            if(!val){
                                return "This field is required"
                            } else if(watch("password") !== val){
                                // The watch function from react-hook-form is used to get the current value of the password field.
                                return "Passwords do not match"
                            }
                        }
                    })}></input>
                    {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                    </label>
                    <span>
                        <button type = "submit" className="bg-blue-600 text-white p-2 font-bold hover: bg-blue-500 text-xl">Create Account </button>
                    </span>
        </form>
    )
}

export default Register