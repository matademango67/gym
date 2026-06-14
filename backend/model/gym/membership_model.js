import {pool} from "../../db/gym.js";

export class Membership_model {
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

    throw error;
} }

}