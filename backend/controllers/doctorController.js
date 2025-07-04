import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";



const changeAvailability = async(req , res) =>{
  try{
    const{docId} = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId , {available : !docData.available})
    res.json({ success: true, message: "Availability changed" })

  }
  catch(error)
  {
    console.log(error)
    res.json({ success: false, message: error.message});
  }
}

const doctorList = async(req , res) =>{
    try{

      const doctors  = await doctorModel.find({}).select(['-password' , '-email'])
      res.json({ success: true, doctors })
    }
    catch(error)
    {
        console.log(error)
        res.json({ success: false, message: error.message});
    }
}

//craete api for the doctor login
const loginDoctor = async(req , res) =>{
    try{
     
       const {email , password} = req.body
       const doctor = await doctorModel.findOne({email}).select('+password');
       if(!doctor)
       {
        return res.json({ success: false, message: "Invalid Credentials"})
       }
       console.log("Request password:", password);
       console.log("Doctor password from DB:", doctor?.password);


       const isMatch = await bcrypt.compare(password , doctor.password)
       if(isMatch)
       {
        const token = jwt.sign({id : doctor._id} , process.env.JWT_SECRET)
        res.json({success: true , token })
        
       }
       else
       {
        return res.json({ success: false, message: "Invalid Credentials"})
       }
    }
    catch(error)
    {
        console.log(error)
        res.json({ success: false, message: error.message});
    }
}  

//api for all  the appointment for the specific doctor
const appointmentsDoctor = async(req , res) =>{
  try{

    const { docId } =  req.body
    const appointments = await appointmentModel.find({docId}).select('-__v -password -email')
    res.json({ success: true, appointments })
  

  }
  catch(error)
  {
    console.log(error)
    res.json({ success: false, message: error.message});
  }
}

//api to mark the appointment completed on the doctor panel
const appointmentCompleted = async(req , res) =>{
  try{
      const { docId , appointmentId } = req.body
      const appointmentData =await appointmentModel.findById(appointmentId)

      if (!appointmentData) 
        {
        return res.json({ success: false, message: "Appointment not found" });
       }

      if(appointmentData && appointmentData.docId === docId)
      {
        await appointmentModel.findByIdAndUpdate(appointmentId , {isCompleted : true})
        return res.json({ success: true, message: "Appointment marked completed" })
      }
      else{
         return res.json({ success: false, message: "marked failed" })
      }
  }
  catch(error)
  {
    console.log(error)
    res.json({ success: false, message: error.message});
  }
}

//api to cancel the appointment for doctor panel
const appointmentCancel = async(req , res) =>{
  try{
      const { docId , appointmentId } = req.body
      const appointmentData =await appointmentModel.findById(appointmentId)

      if(appointmentData && appointmentData.docId === docId)
      {
        await appointmentModel.findByIdAndUpdate(appointmentId , {cancelled : true})
        return res.json({ success: true, message: "Appointment marked cancelled" })
      }
      else{
         return res.json({ success: false, message: "cancellation failed" })
      }
  }
  catch(error)
  {
    console.log(error)
    res.json({ success: false, message: error.message});
  }
}

//api to get the dashboard data
const doctorDashboard = async(req , res) =>{
  try{
       const { docId } = req.body

       const appointments = await appointmentModel.find({docId})

       let earnings = 0

       appointments.map((item)=>{
        if(item.isCompleted || item.payment)
        {
          earnings += item.amount
        }
       })

       let patients = []

       appointments.map((item)=>{
          if(!patients.includes(item.userId))
          {
            patients.push(item.userId)
          }
       })


       const dashData = {
         earnings,
         appointments: appointments.length,
         patients: patients.length,
         latestAppointments: appointments.reverse().slice(0, 5)
       };

       res.json({ success: true, dashData })
  
  }
 catch(error)
 {
    console.log(error)
    res.json({ success: false, message: error.message});
 }
}

//api to get doctor profile for doctor panel
const doctorProfile = async(req , res) =>{
  try{
    const { docId } = req.body
    const profileData = await doctorModel.findById(docId).select('-password')
    res.json({ success: true , profileData})
   
  }
  catch(error)
  {
    console.log(error)
    res.json({ success: false, message: error.message}); 
  }
}

//api to update doctor profile data from doctor panel
const updateDoctorProfile = async(req , res) =>{
  try{
    const { docId , fees , address , available } = req.body
    
    await doctorModel.findByIdAndUpdate(docId , {fees , address , available})
    res.json({ success: true, message: "Profile updated successfully" });
   
  }
  catch(error)
  {
    console.log(error)
    res.json({ success: false, message: error.message}); 
  }
}

export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor  , appointmentCancel , appointmentCompleted , doctorDashboard , doctorProfile , updateDoctorProfile};