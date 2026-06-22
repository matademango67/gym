 import {pool} from "../../db/gym.js";

export class Membership_model {
    static async get_memberships(){
        const result = await pool.query(`SELECT * FROM memberships`);
        const rows = result.rows;
        if(rows.length === 0){
            throw new Error("error")
        } else{
             return rows;
        }
    }

    static async search_membership(customer_id){
        try {
              const result = await pool.query(
        `SELECT * FROM memberships
         WHERE customer_id = $1`,[customer_id])
       return result.rows.length ? result.rows : null;
        } catch (error){
            throw new Error
        }
        
    }
   
    static async create_membership(input){
         const {customer_id , type} = input
 const query = `
        INSERT INTO memberships (customer_id, type, cost)
        VALUES (
            $1,
            $2,
            CASE
                WHEN $2 = 'normal' THEN 1500
                WHEN $2 = 'vip' THEN 3000
            END
        )
        RETURNING *;
    `;
try {
    const result = await pool.query(query, [customer_id, type]);

    return result.rows[0];

} catch (error) {

    if (error.code === '23505') {
        const customError = new Error(
            "Account already has a membership"
        );

        customError.statusCode = 409;

        throw customError;
    }

   throw new Error
} }

  static async paused_membership(user_id){
  const customerResult = await pool.query(
    `SELECT id FROM customers WHERE user_id = $1`,
    [user_id]
  );

  if (customerResult.rowCount === 0) {
    throw new Error("Customer not found");
  }

  const customerId = customerResult.rows[0].id;

  const membershipResult = await pool.query(
    `SELECT status FROM memberships WHERE customer_id = $1`,
    [customerId]
  );

  if (membershipResult.rowCount === 0) {
    throw new Error("Membership not found");
  }

  const status = membershipResult.rows[0].status;

  if (status !== 'active') {
    throw new Error("You can't pause your membership due to your current status");
  }

  const result = await pool.query(
  `UPDATE memberships
   SET status = 'paused'
   WHERE customer_id = $1`,
  [customerId]
);

  if (result.rowCount === 0) {
    throw new Error("Membership could not be paused");
  }

  return { message: "Membership paused successfully" };
}
}
