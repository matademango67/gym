import { pool } from '../db/gym.js';
import crypto from 'node:crypto';
import { hashToken } from '../config/refresh_token.js';

export class token_model {
    static async save_token(user_id, refreshToken) {
        const token_id = crypto.randomUUID();
        const token_hash = hashToken(refreshToken);
        const expires = new Date();
        expires.setDate(expires.getDate() + 7)

        const query = `INSERT INTO refresh_tokens (Token_id, token_hash, user_id, expires_at)
            VALUES ($1, $2, $3, $4);`
            try {
                await pool.query(query, [
                    token_id,
                    token_hash,
                    user_id,
                    expires
                ]);
            } catch (error) {
                console.error('Error saving token:', error);
                throw error;
            }
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