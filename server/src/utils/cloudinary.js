import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config({
    path : './.env'
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        console.log(response);
        // file has been uploaded successfully
        console.log("File is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("Error while uploading on Cloudinary");
        
        // As I have the local file path it means file is on my local server but the upload operation is failed. So we need to remove this useless file from our local server. We can do that by unlinking it from the server
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadOnCloudinary}