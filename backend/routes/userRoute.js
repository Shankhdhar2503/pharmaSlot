import express from "express"
import { registerUser , loginUser, getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

//create the endpoint to register the user
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile",authUser , getProfile)
userRouter.post("/update-profile", upload.single("image"),authUser , updateProfile);  //there are two middleware 1 is passing the form data 2 is authenticate and geting the user id from the token

userRouter.post('/book-appointment' , authUser , bookAppointment)
userRouter.get('/appointments' , authUser , listAppointments)
userRouter.post('/cancel-appointment' , authUser , cancelAppointment)
userRouter.post('/payment-razorpay' , authUser , paymentRazorpay)
userRouter.post('/verifyRazorpay' , authUser , verifyRazorpay)


export default userRouter