import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {validateUser} from "../middleware/auth_validation.js";
import {auth_model} from "../model/auth_model.js";

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
        const hashedPassword = await bcrypt.hash(password, 10);
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
        const hashedPassword = await bcrypt.hash(password, 10);
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
        const hashedPassword = await bcrypt.hash(password, 10);
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
}
