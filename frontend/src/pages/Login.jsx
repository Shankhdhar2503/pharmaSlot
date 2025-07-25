import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from "axios";
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  //destructure the token 
  const { backendUrl , token , setToken } = useContext(AppContext) 

  //user ko login krne ke baad home page pr redirect kra jaaye
  const navigate = useNavigate()

  const[state , setState] = useState('Sign Up')

  const[email , setEmail] = useState('')
  const[password , setPassword] = useState('')
  const[name , setName] = useState('')

  const onSubmitHandler = async (event)=>{
    event.preventDefault()

    //we need axiaos package to make api call
    try{
      if(state === 'Sign Up')
      {
         const {data} = await axios.post(backendUrl + '/api/user/register' , {name , password , email})
         if(data.success)
         {
          localStorage.setItem('token' , data.token)
          setToken(data.token)
         }
         else{
          toast.error(data.message)
         }
      }
      else{
         const {data} = await axios.post(backendUrl + '/api/user/login' , {password , email})
         if(data.success)
         {
          localStorage.setItem('token' , data.token)
          setToken(data.token)
         }
         else{
          toast.error(data.message)
         }
      }
    }
    catch(error)
    {
       toast.error(error.message)
       
    }

  }

  //whenever the token get updated this fn will be executed
  useEffect(()=>{
    if(token)
    {
       navigate("/");
    }
  },[token])
  

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex justify-center items-center'>
        <div className='flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg' style={{gridTemplateColumns:"repeat(auto-fill, minmax(180px ,1fr))"}}>
          <p className='text-2xl font-semibold '>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
          <p>Please {state === 'Sign Up' ? 'Sign Up' : 'login'} to book appointment</p>
          {
            state === "Sign Up" && <div className='w-full'>
            <p>Full Name</p>
            <input type="text" className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e) =>setName(e.target.value)}  value={name} required/>
          </div>
          }
          

          <div className='w-full'>
            <p>Email</p>
            <input type="email" className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e) =>setEmail(e.target.value)}  value={email} required/>
          </div>

          <div className='w-full'>
            <p>Password</p>
            <input type="password" className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e) =>setPassword(e.target.value)}  value={password} required/>
          </div>

          <button type='submit' className='text-white w-full py-2 rounded-md text-base cursor-pointer '  style={{ backgroundColor: '#5f6FFF' }}>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>
          {
            state === 'Sign Up'
            ? <p>Already have an account? <span onClick={()=>setState('Login')} className='underline cursor-pointer' style={{ color: '#5f6FFF' }} > Login here</span></p>
            : <p>Create an new account? <span onClick={()=>setState('Sign Up')} className='underline cursor-pointer'style={{ color : '#5f6FFF' }} > click here</span></p>
          }
        </div>
    </form>
  )
}

export default Login