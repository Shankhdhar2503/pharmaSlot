import React from 'react'
import { assets } from '../assets/assets'
import pharmaSlot from '../assets/pharmaSlot.png';

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/*-----------left section----------------- */}
        <div>
           <img className='mb-5 w-40' src={pharmaSlot} alt="" />
           <p className='w-full md:w-2/3 text-gray-600 leading-6' >Find qualified doctors across major specialties and locations. View detailed profiles with experience, fees, and clinic hours. Book appointments for in-person or video consultations. Manage your bookings and stay updated with timely reminders.</p>
        </div>

         {/*-----------center section----------------- */}
        <div >
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

         {/*-----------right section----------------- */}
        <div >
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+919528234379</li>
            <li>kartikShankhdhar3@gmail.com</li>
          </ul>
        </div>
      </div>
      {/*------------------copyright text--------------*/}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024 @ KartikShankhdhar.dev - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer