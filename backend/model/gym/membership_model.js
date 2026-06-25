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

    static async search_membership(user_id){
         const result = await pool.query(
    `
    SELECT m.*
    FROM memberships m
    JOIN customers c
      ON c.id = m.customer_id
    WHERE c.user_id = $1
    `,
    [user_id]
);

return result.rows;

    }
   
    static async create_membership(input , user_id){
         const { type } = input
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
  const customerResult = await pool.query(
 `SELECT id  from customers where user_id = $1` ,
  [user_id]); 
                               
  if (customerResult.rowCount === 0) {
    throw new Error("Customer not found");
  }

  const customer_id = customerResult.rows[0].id;

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

  static async changeStatus_membership(user_id){
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

  if (status !== 'active' && status !== 'paused') {
    throw new Error("You can't change your membership's status due to your current status");
  }

  const result = await pool.query(
  `UPDATE memberships
SET status =
  CASE
    WHEN status = 'paused' THEN 'active'
    WHEN status = 'active' THEN 'paused'
  END
WHERE customer_id = $1`,
  [customerId]
);

  if (result.rowCount === 0) {
    throw new Error("Membership's status could not be changed");
  }

  return { message: "Membership's status changed successfully" };
}

 static async changeType_membership(user_id){
      const membershipResult = await pool.query(`SELECT memberships.status
        from memberships
        JOIN customers on
        customers.id = memberships.customer_id
        where customers.user_id = $1`, 
        [user_id])

      if (membershipResult.rowCount === 0) {
    throw new Error("Membership not found");
  }

  const status = membershipResult.rows[0].status;

        if (status !== 'active') {
    throw new Error("You can't change your membership's type due to your current status");
  }
      const result = await pool.query(
        `UPDATE memberships m
        SET 
        type = CASE
    WHEN m.type = 'vip' THEN 'normal'
    WHEN m.type = 'normal' THEN 'vip'
  END,
   cost = CASE
        WHEN m.type = 'normal' THEN 3000
        WHEN m.type = 'vip' THEN 1500
    END
  from customers c
WHERE c.id = m.customer_id
AND c.user_id = $1
RETURNING *;`, [user_id]
      )
 }
}

