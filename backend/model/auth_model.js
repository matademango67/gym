import {pool} from "../db/gym.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {role} from "../config/role.js";
import {token_model} from "./token_model.js";
import { hashToken , generateRefreshToken} from "../config/refresh_token.js";

const saltrounds = Number(process.env.SALT_ROUNDS.trim())

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

    static async update(email , hashedPassword, new_email, new_password){
        const result = await pool.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email] );
                    const user = result.rows[0];
                    console.log(user);
                    console.log(email , hashedPassword, new_email, new_password);
            if (!user) {
                throw new Error("User not found");
             }
        
        const isValid = await bcrypt.compare(hashedPassword, user.password_hash);
        if (!isValid) {
           throw new Error("Invalid password");
        }
        const newhashedPassword = await bcrypt.hash(new_password, saltrounds)
        console.log(newhashedPassword)
        const newUser = await pool.query(
            "UPDATE users SET password_hash = $1 , email = $2 WHERE email = $3 RETURNING *",
            [newhashedPassword, new_email, email]
        );
        return newUser.rows[0];
    }

    static async refresh_token(refreshToken) {
        const token_hash = hashToken(refreshToken);
        console.log('Received refreshToken:', refreshToken);
        console.log('Token hash:', token_hash);
        const query = `SELECT user_id , expires_at FROM refresh_tokens WHERE token_hash = $1;`
        try {
           const result = await pool.query(query, [token_hash]);
           console.log('Query result:', result.rows);

              if (!result.rows.length) {
            throw new Error('Invalid refresh token');
        }   
          const { user_id, expires_at } = result.rows[0];

        if (result.rows[0].expires_at < new Date()) {
             await pool.query( `Delete FROM refresh_tokens WHERE token_hash = $1;`, [token_hash] )
            throw new Error('Refresh token expired');
        }
            const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
            const user = userResult.rows[0];
             if (!user) {
            throw new Error('User not found');
        }
            const tokens = await token_model.refresh_token(refreshToken,user);
            return tokens; 
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
    }
        } 

        static async logout(refreshToken) {
        if (typeof refreshToken !== 'string' || !refreshToken) return;

        const tokenHash = hashToken(refreshToken);
        try {
            await pool.query(
                `DELETE FROM refresh_tokens WHERE token_hash = $1`,
                [tokenHash]
            );
            console.log('Token deleted successfully');
        } catch (error) {
            console.error('Error deleting token:', error);
            throw error;
        }
    }

     static async delete_user(id){
        console.log(id)
        const user = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [id])
            try{
                if(!user.rows.length){
              throw new Error('user doesnt exist')
            }
            await pool.query(
                `DELETE FROM users WHERE id = $1`,[id]
              )
            } catch (error){
                console.error('Error deleting user:', error)
            }
     }
}
