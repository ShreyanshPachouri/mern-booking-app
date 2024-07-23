import express, {Request, Response}from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verify } from "crypto";
import verifyToken from "../middleware/auth";

const router = express.Router()

router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({min: 6})
],

async(req:Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        
    }

    const {email, password} = req.body

    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'})
        }
        
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn: "1d"})

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        })
        res.status(200).json({userId: user._id})
    } catch (error){
        console.error(error)
        res.json(500).json({message: "Something went wrong"})
    }
}
)

router.get('/validate-token', verifyToken, (req: Request, res: Response) => {
    res.status(200).json({userId: req.userId})
})

//This route facilitates the communication between the front-end and the server in order to verify if the user is logged in or not. The frontend hits the validate-token route and the server responds with the status code which has the answer.

router.post('/logout', (req:Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
    })
    res.send()
})

//We created an invalid token and expired it immediately so that it logs out.
export default router


