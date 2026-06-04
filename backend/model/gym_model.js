import {pool} from "../db/gym.js";

export class gym_model {
    static async getCustomers (){
        const result = await pool.query("SELECT * FROM customers");
        const rows = result.rows;
        if(rows.length === 0){
            throw new Error("error")
        } else{
             return rows;
        }
    };

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

  static async createCustomer(input) {
    const {name,birth,email} = input;
    const result = await pool.query(
        `
        INSERT INTO customers (name, birth, email)
        VALUES ($1, $2, $3)
        `,
        [name, birth, email]
    );
    if (result.rowCount === 0) {
        throw new Error("Failed to create customer");
    } else {
        return { name, birth, email };
    }
  }
  
static async deleteCustomer(id) {
    const result = await pool.query(
        `
        DELETE FROM customers
        WHERE id = $1
        `,
        [id]
    );
    if (result.rowCount === 0) {
        throw new Error("Customer not found");
    } else {
        return { message: "Customer deleted successfully" };
    }
}

 static async UpdateCustomer(id, input) {
    const { name, birth, email } = input;
    const result = await pool.query(
         `
    UPDATE customers
    SET name = $1,
        birth = $2,
        email = $3
    WHERE id = $4
    `,
    [name, birth, email, id]
    );
    if (result.rowCount === 0) {
        throw new Error("Customer not found or update failed");
    } 
} }