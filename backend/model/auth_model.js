import {pool} from "../db/gym.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {role} from "../config/role.js";
import {token_model} from "./token_model.js";
import {generateRefreshToken, hashToken} from "../config/refresh_token.js";

export class auth_model {
    static async getUsers (){
        try {
        const users = await pool.query("SELECT * FROM users");
        return users.rows;
        } catch (error) {
            throw new Error("Error fetching users: " + error.message);
        }
    }

    static async registerUser(email ,hashedPassword) {
        try {
            const result = await pool.query(
                "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
                [email, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {        
    throw new Error("Error registering user: " + error.message);
        }
    }

    static async registerEmployee(email ,hashedPassword) {
        try {
            const result = await pool.query(
                "INSERT INTO users (email, password_hash, role) VALUES ($1, $2,'employee') RETURNING *",
                [email, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {        
    throw new Error("Error registering user: " + error.message);
        }
    }

    static async registerAdmin(email ,hashedPassword) {
        try {
            const result = await pool.query(
                "INSERT INTO users (email, password_hash,role) VALUES ($1, $2,'admin') RETURNING *",
                [email, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {        
    throw new Error("Error registering user: " + error.message);
        }
    }

    static async login(email , hashedPassword){
    const result = await pool.query(
                "SELECT * FROM users WHERE email = $1",
                [email]   );

             const user = result.rows[0];
             if (!user) {
                throw new Error("User not found");
             }       


     const isValid = await bcrypt.compare(hashedPassword, user.password_hash);
     if (!isValid) {
        throw new Error("Invalid password");
     } 
       const AccessToken = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
       }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
       
       const refreshToken = generateRefreshToken();
       await token_model.save_token(user.id, refreshToken);

       return { AccessToken, refreshToken };
    }
}

