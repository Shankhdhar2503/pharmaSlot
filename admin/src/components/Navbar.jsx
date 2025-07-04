import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import pharmaSlot from '../assets/pharmaSlot.png';

const Navbar = () => {
 
  const{aToken , setAToken} = useContext(AdminContext)
  const{dToken , setDToken} = useContext(DoctorContext)

  const navigate = useNavigate()

  const logout = () =>{
      navigate('/') 
      aToken && setAToken('')
      aToken && localStorage.removeItem('aToken')
      dToken && setAToken('')
      dToken && localStorage.removeItem('dToken')
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img className='w-5 h-20 sm:w-40 cursor-pointer' src={pharmaSlot} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? "Admin" : "Doctor"}</p>
      </div>
      <button onClick={logout} className='text-white text-sm px-10 py-2 rounded-full cursor-pointer'  style={{ backgroundColor: "#5f6FFF" }}> Logout</button>
    </div>
  );
}

export default Navbar