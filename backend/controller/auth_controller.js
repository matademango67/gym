import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {validateUser} from "../middleware/auth_validation.js";
import {auth_model} from "../model/auth_model.js";
import {token_model} from "../model/token_model.js";

const saltrounds = Number(process.env.SALT_ROUNDS.trim())

export class auth_controller {
   static async getUsers (req,res){
        try {
            const users = await auth_model.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}

   static async registerUser(req,res){
    const result = validateUser(req.body)
    if(!result.success){
        return res.status(400).json({ error: result.error.errors });
    }
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await auth_model.registerUser(email, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        if(error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
      return res.status(500).json({ error: error.message });
   }
}
    
    static async registerEmployee(req,res){
    const result = validateUser(req.body)
    if(!result.success){
        return res.status(400).json({ error: result.error.errors });
    }
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await auth_model.registerEmployee(email, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        if(error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
      return res.status(500).json({ error: error.message });
   }
}

      static async registerAdmin(req,res){
    const result = validateUser(req.body)
    if(!result.success){
        return res.status(400).json({ error: result.error.errors });
    }
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await auth_model.registerAdmin(email, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        if(error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
      return res.status(500).json({ error: error.message });
   }
    }

    static async login(req,res){
        const result = validateUser(req.body)
        if(!result.success){
            return res.status(400).json({ error: result.error.errors });
        }
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, saltrounds);
            const user = await auth_model.login(email, password);

            if(!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            res.cookie('refreshToken', user.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })

            return res.status(200).json({
                message : "Login successful",
                accessToken: user.AccessToken
            })
        } catch (error) {
            if(error.statusCode === 401) {
                return res.status(401).json({
                    status: "fail",
                    message: error.message
                })
            }
            return res.status(500).json({
                status: "fail",
                message: error.message
            })
        }
    }
}

