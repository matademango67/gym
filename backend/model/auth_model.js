import {pool} from "../db/gym.js";

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
}

