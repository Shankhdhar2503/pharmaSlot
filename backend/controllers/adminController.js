import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'


// api for adding doctor
const addDoctor = async (req , res) =>{
     try{
     
       const{name , email , password , speciality , degree , experience , about , fees , address} = req.body
       const imageFile = req.file

      //  console.log({name , email , password , speciality , degree , experience , about , fees , address} , imageFile);

      //check for all data to add doctor
      if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
      {
        return res.json({success:false , message : "missing details"})
      }

      //validating email formate
      if(!validator.isEmail(email))
      {
        return res.json({success:false , message : "Please enter a valid email"})
      }

      

      //validating the strong password
      if(password.length < 8)
      {
         return res.json({success:false , message : "Please enter a strong password"})
      }

      // to encrypt the password we use the bcrypt package ,, hashing doctor password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password , salt)

      //upload the image in the cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path , {resource_type : "image"})
      const imageUrl = imageUpload.secure_url


      const doctorData = {
        name,
        email,
        password:hashedPassword,
        image:imageUrl,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),     //isse address ka js object milega string ni
        date:Date.now()
      }

      const newDoctor = new doctorModel(doctorData)
      await newDoctor.save()

      res.json({success:true , message : "Doctor Added"})

     }
     catch(error)
     {
       console.log(error);
       res.json({success:false , message : error.message})
     }
}

//api for the admin login
const loginAdmin = async (req , res) =>{
   try{
        const {email , password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
        {
          const token = jwt.sign(email + password , process.env.JWT_SECRET)
          res.json({success:true , token})
        }
        else{
          res.json({success : false , message : "Invalid credentials"})
        }
   }
   catch(error)
   {
       console.log(error);
       res.json({success:false , message : error.message})
   }
}

//api to get all doctor list for admin panel

const allDoctors = async (req , res) =>{
   try{
    const doctors = await doctorModel.find({}).select('-password') // select it will remove the password property from the doc res
    res.json({ success: true, doctors });
   }
   catch(error)
   {
    console.log(error)
    res.json({ success: false, message: error.message })
   }
}

//api to get all appointment list for admin panel
const appointmentsAdmin = async (req , res) =>{

  try{
      const appointments = await appointmentModel.find({})
      res.json({ success: true, appointments })
  }
  catch(error)
  {
     console.log(error)
     res.json({ success: false, message: error.message })
  }
}

//api for admin to cancel the appointment
const appointmentCancel = async (req, res) => {
  try {
    const {  appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //realising doctor slots
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({
      success: true,
      message: "Appointment Cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const user = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      users: user.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    //at the end we should always send the data in json format in response
    res.json({ success: true,dashData })


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export {addDoctor , loginAdmin , allDoctors , appointmentsAdmin , appointmentCancel , adminDashboard}