import {pool} from "../../db/gym.js";

export class gym_model {
    static async getCustomers (user_id){
        const result = await pool.query(`SELECT * 
                                       FROM customers c
                                       WHERE c.user_id = $1`,[user_id]);
        const rows = result.rows;
        if(rows.length === 0){
            throw new Error("error")
        } else{
             return rows;
        }
    };

    static async getAllCustomers() {
        const result = await pool.query(`SELECT * FROM customers`);
         const rows = result.rows;
        if(rows.length === 0){
            throw new Error("error")
        } else{
             return rows;
        }
    }

   static async SearchCustomer(search) {
    const result = await pool.query(
        `
        SELECT *
        FROM customers
        WHERE name ILIKE $1
           OR email ILIKE $1
        `,
        [`%${search}%`]
    );

    return result.rows.length ? result.rows : null;
}

  static async createCustomer(input, user_id) {
    try {
      const { name, birth } = input;
      const id = user_id;
      const select_email = await pool.query(
        `SELECT email from users
         WHERE id = $1`,[user_id]
      ) 

      const email = select_email.rows[0].email
    
      const result = await pool.query(
        `
        INSERT INTO customers (name, birth, email, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [name, birth, email, id]
      );

      return result.rows[0];
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
  
/*static async deleteCustomer(user_id) {
    const result = await pool.query(
        `
        DELETE FROM customers
        WHERE user_id = $1
        `,
        [user_id]
    );
    if (result.rowCount === 0) {
        throw new Error("Customer not found");
    } else {
        return { message: "Customer deleted successfully" };
    }
}*/

 static async UpdateCustomer(user_id, input) {
    const { name, birth, email } = input;
    const result = await pool.query(
         `
    UPDATE customers
    SET name = $1,
        birth = $2,
        email = $3
    WHERE user_id = $4
    `,
    [name, birth, email, user_id]
    );
   if (result.rowCount === 0) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
}
} }