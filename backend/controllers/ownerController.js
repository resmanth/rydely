import User from "../models/User.js";
import Car from '../models/Car.js';
import fs from 'fs';
import imagekit from "../configs/imagekit.js";
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }

}


// API to List Car
export const addCar = async (req, res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file; I

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: '/cars'
        })
        
        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
        path: response.filePath,
        transformation : [
        {width: '1280'}, // Width resizing
        {quality: 'auto' },
        // Auto compression
        { format: 'webp' }
        // Convert to modern format
        ]
        });

        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image})
        res.json({})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// API to List Owner Cars
export const getOwnerCars = async (req, res)=>{
try {
const {_id} = req.user;
const cars = await Car.find({owner: _id })
res.json({success: true, cars})|
} catch (error) {
console.log(error.message);
res.json({success: false, message: error.message})
}
}