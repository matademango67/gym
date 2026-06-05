import { pool } from '../db/gym.js';
import crypto from 'node:crypto';
import { hashToken , generateRefreshToken } from '../config/refresh_token.js';
import { auth_model } from './auth_model.js';
import jwt from 'jsonwebtoken';

export class token_model {
    static async save_token(user_id, refreshToken) {
        const token_id = crypto.randomUUID();
        const token_hash = hashToken(refreshToken);
        const expires = new Date();
        expires.setDate(expires.getDate() + 7)
        console.log('Saving token - user_id:', user_id, 'refreshToken:', refreshToken, 'token_hash:', token_hash);

        const query = `INSERT INTO refresh_tokens (Token_id, token_hash, user_id, expires_at)
            VALUES ($1, $2, $3, $4);`
            try {
                await pool.query(query, [
                    token_id,
                    token_hash,
                    user_id,
                    expires
                ]);
                console.log('Token saved successfully');
            } catch (error) {
                console.error('Error saving token:', error);
                throw error;
            }
}

    static async refresh_token(refreshToken, user) {
        const newRefreshToken = generateRefreshToken();
        const user_id = user.id;
        console.log('User ID:', user_id);
        console.log('New Refresh Token:', newRefreshToken);
      await token_model.save_token(user_id, newRefreshToken);

      const AccessToken = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
       }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
     console.log('Access Token:', AccessToken);
      return  { AccessToken, refreshToken : newRefreshToken };
    }
}

 /*   static async logout(refreshToken){

        if(typeof refreshToken !== 'string' || !refreshToken) return;

         const tokenHash = hashToken(refreshToken)
         
         await pool.execute(
            `DELETE FROM refresh_tokens WHERE Token_hash = ?`,
            [tokenHash]
         )
    }
} */ 