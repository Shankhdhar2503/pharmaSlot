import { createContext } from "react";
import axios from 'axios';
import { useEffect , useState} from "react";
import {toast} from 'react-toastify'


export const AppContext = createContext()

const AppContextProvider=(props)=>{
 
  const currencySymbol = '$'
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors , setDoctors] = useState([])

 

  //to store the token of the user so the logedin
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)

  //state variable to store the user data
  const[userData , setUserData] = useState(false)

  const loadUserProfileData = async () => {
    try{

       const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers : {token}})
       if(data.success)
       {
        setUserData(data.userData)
       
       }
       else{
        toast.error(data.message)
       }
    }
    catch(error)
    {
       console.log(error);
       toast.error(error.message)
    }
  }
  


 //to add the api of the doctors
 const getDoctorsData = async () =>{
     try{

      const {data} = await axios.get(backendUrl + '/api/doctor/list')
      if(data.success){
        setDoctors(data.doctors);
     }
     else
     {
      toast.error(data.message);
     }
    }
     catch(error){
        console.log(error);
        toast.error(error.message)
     }
 }


 //value property m store krne se ham kisi bhi component m use kr skte h
  const value = {
   doctors,getDoctorsData,
   currencySymbol,
   token,
   setToken,
   backendUrl,
   userData,
   setUserData,
   loadUserProfileData,
 }

 //call the data of the doctors
 useEffect(()=>{
  getDoctorsData()
 },[])

 //call the data of the users
 useEffect(()=>{
  if(token)
  {
    loadUserProfileData()   // when user logged in the system so the data of the user will be loaded  
  }
  else{
    setUserData(false); //when user not logged in the system so the data of the user will not be loaded
  }
 },[token])

 return(
  <AppContext.Provider value={value}>
          {props.children}
  </AppContext.Provider>
 )

}

export default AppContextProvider