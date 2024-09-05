import {v2 as cloudinay} from "cloudinary" 
const connectCloudinary= async()=>{
    await cloudinay.config({
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINAR_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET_KEY
    })
}
export default connectCloudinary