import React from 'react'
import {assets} from '../assets/assets'
import { useState } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
 import { ToastContainer, toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {
  
   const[state , setState] =  useState('Admin')
   const[email , setEmail] = useState('')
   const[password , setPassword] = useState('')
   
   //token for the admin
   const{setAToken , backendUrl } = useContext(AdminContext)
   //token for the doctor
   const{setDToken} = useContext(DoctorContext)


   const onSubmitHandler = async (event) =>{
      event.preventDefault()   //when i submit the form , it will not refresh the page

      try{
          if(state === 'Admin'){
            const {data} = await axios.post(backendUrl + "/api/admin/login" , {email , password})
             if(data.success)
             {
              localStorage.setItem('aToken' , data.token)
              setAToken(data.token)
             }
             else{
              toast.error(data.message)
             }
          }
          else{
             
             const { data } = await axios.post(backendUrl + "/api/doctor/login" , {email , password})
             if(data.success)
             {
              localStorage.setItem('dToken' , data.token)
              setDToken(data.token)
              console.log(data.token);
             }
             else{
              toast.error(data.message)
             }
          }
      }
      catch(error){

      }
   }

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96  rounded-xl text-[#5E5E5E] text-sm shadow-xl bg-white">
          <p className="text-2xl font-semibold m-auto">
            {" "}
            <span style={{ color: "#5f6FFF" }}>{state}</span> Login
          </p>
          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="password"
              required
            />
          </div>

          <button
            className="text-white w-full py-2 rounded-md text-base cursor-pointer"
            style={{ backgroundColor: "#5f6FFF" }}
          >
            Login
          </button>
          {state === "Admin" ? (
            <p>
              Doctor Login ?{" "}
              <span
                className="underline cursor-pointer"
                style={{ color: "#5f6FFF" }}
                onClick={() => setState("Doctor")}
              >
                click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login ?{" "}
              <span
                className="underline cursor-pointer"
                style={{ color: "#5f6FFF" }}
                onClick={() => setState("Admin")}
              >
                click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login