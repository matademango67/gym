import {test, expect, describe , beforeEach, afterEach } from "@jest/globals";

import request from 'supertest';
import {pool} from '../../db/gym.js';

import app from '../../app';
import jwt from "jsonwebtoken";
import {createTestToken} from "../helpers/auth_helper.js"
import {randomUUID} from 'node:crypto'

describe('GET /membership/me' , () => {

    describe("authorization" , () => {
           test('Get membership/me - no token > 401' , async () => {
       const response = await request(app)
       .get('/membership/me');

       expect(response.statusCode).toBe(401)
       expect(response.body).toEqual({
            status: "fail",
            message: "Access token required"
        });
    });

    test('Get membership/me - invalid token > 401' , async () => {
       const response = await request(app)
       .get('/membership/me')
       .set("Authorization", "Bearer invalid-token")

       expect(response.statusCode).toBe(401)
       expect(response.body).toEqual({
            status: "fail",
            message: "Invalid access token"
        });
    });
    });

   describe("with membership" , () => {
         let testUser;
    let testCustomer;
    let testMembership;

   beforeEach(async () => {

    const userResult = await pool.query(`
        INSERT INTO users (
            role,
            email,
            password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING *
    `, [
        "customer",
        `membership-${randomUUID()}@test.com`,
        "fake-password"
    ]);

    testUser = userResult.rows[0];

    const customerResult = await pool.query(`
        INSERT INTO customers (
            name,
            birth,
            email,
            user_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [
        "Integration Test",
        "2000-01-01",
        `${randomUUID()}@test.com`,
        testUser.id
    ]);

     testCustomer = customerResult.rows[0];

    const membershipResult = await pool.query(`INSERT INTO memberships (
        type,
        cost,
        customer_id
        )
        VALUES ($1 , $2 , $3)
        RETURNING *`, [
            "normal",
            "1500",
            testCustomer.id
        ]);

       testMembership = membershipResult.rows[0];
}); 

afterEach(async () => {

    await pool.query(
        "DELETE FROM users WHERE id = $1",
        [testUser.id]
    );

});
 
    test('Get membership/me - found membership > 200' , async () => {
         const token = jwt.sign(
                {
                    id: testUser.id,
                    role: testUser.role
                },
                process.env.ACCESS_TOKEN_SECRET
            );

            const response = await request(app)
                .get("/membership/me")
                .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200)
               
        expect(response.body).toEqual(
           expect.arrayContaining([
            expect.objectContaining({
                customer_id: testCustomer.id,
                user_id: testUser.id,
                type: "normal",
                status: "active",
                cost: "1500.00",
                email: testUser.email
            })
        ])
    );
    })
   });

   describe("with no membership" , () => {
        let testUser;

        beforeEach(async () => {

            const userResult = await pool.query(`
                INSERT INTO users (
                    role,
                    email,
                    password_hash
                )
                VALUES ($1, $2, $3)
                RETURNING *
            `, [
                "customer",
                `no-membership-${randomUUID()}@test.com`,
                "fake-password"
            ]);

            testUser = userResult.rows[0];


            await pool.query(`
                INSERT INTO customers (
                    name,
                    birth,
                    email,
                    user_id
                )
                VALUES ($1, $2, $3, $4)
            `, [
                "No Membership",
                "2000-01-01",
                `no-membership-customer-${randomUUID()}@test.com`,
                testUser.id
            ]);

        });


        afterEach(async () => {

            await pool.query(
                "DELETE FROM users WHERE id = $1",
                [testUser.id]
            );

        });

        test("no membership > 404" , async () => {
            const token = jwt.sign({
                id : testUser.id ,
                role : "customer"
            },
        process.env.ACCESS_TOKEN_SECRET
    )
      
         const response = await request(app)
          .get("/membership/me")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(404);

            expect(response.body).toEqual({
                error: "membership not found"
            });

        })
   })
 
})

describe('POST /membership/' , () => {
     let testUser;
    let testCustomer;

    beforeEach(async () => {

        const userResult = await pool.query(`
            INSERT INTO users (
                role,
                email,
                password_hash
            )
            VALUES ($1, $2, $3)
            RETURNING *
        `, [
            "customer",
            `membership-post-${randomUUID()}@test.com`,
            "fake-password"
        ]);

        testUser = userResult.rows[0];


        const customerResult = await pool.query(`
            INSERT INTO customers (
                name,
                birth,
                email,
                user_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [
            "Membership Test",
            "2000-01-01",
            `customer-${randomUUID()}@test.com`,
            testUser.id
        ]);

        testCustomer = customerResult.rows[0];

    });


    afterEach(async () => {

        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [testUser.id]
        );

    });

    test('POST /membership create a membership > 201' , async () =>{
        const token = jwt.sign({
            id : testUser.id ,
            role : "customer"
        },
          process.env.ACCESS_TOKEN_SECRET
       )

       const membershipData = {
           type : "normal"
       }

       const response = await request(app)
       .post('/membership/')
       .set("Authorization" , `Bearer ${token}`)
       .send(membershipData)

        expect(response.statusCode).toBe(201);

        const result = await pool.query(`
            SELECT *
            FROM memberships
            WHERE customer_id = $1
        `, [testCustomer.id]);

        expect(result.rows).toHaveLength(1);

        expect(result.rows[0]).toEqual(
            expect.objectContaining({
                customer_id: testCustomer.id,
                type: "normal"
            })
        )

        expect(result.rows[0].cost).toBe("1500.00");
    });

    test("POST /membership - invalid type > 400", async () => {

    const token = jwt.sign(
        {
            id: testUser.id,
            role: testUser.role
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    const response = await request(app)
        .post("/membership/")
        .set("Authorization", `Bearer ${token}`)
        .send({
            type: "premium"
        });

    expect(response.statusCode).toBe(400);

     expect(response.body).toEqual({
    error: "Invalid option: expected one of \"normal\"|\"vip\"",
});
     });

    test("POST /membership - missing type > 400", async () => {

    const token = jwt.sign(
        {
            id: testUser.id,
            role: testUser.role
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    const response = await request(app)
        .post("/membership/")
        .set("Authorization", `Bearer ${token}`)
        .send({});

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
    error: "Invalid option: expected one of \"normal\"|\"vip\"",
});
     });

    test("POST /membership - existing membership > 409", async () => {

    const token = jwt.sign(
        {
            id: testUser.id,
            role: testUser.role
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    const firstResponse = await request(app)
        .post("/membership/")
        .set("Authorization", `Bearer ${token}`)
        .send({
            type: "normal"
        });

    expect(firstResponse.statusCode).toBe(201);
 
    const secondResponse = await request(app)
        .post("/membership/")
        .set("Authorization", `Bearer ${token}`)
        .send({
            type: "vip"
        });

    expect(secondResponse.statusCode).toBe(409);

    expect(secondResponse.body).toEqual({
        error: "Account already has a membership"
    });

     });

     describe('no customer' , () => {
        let testUser;

         beforeEach(async () => {

        const userResult = await pool.query(`
            INSERT INTO users (
                role,
                email,
                password_hash
            )
            VALUES ($1, $2, $3)
            RETURNING *
        `, [
            "customer",
            `membership-post-${randomUUID()}@test.com`,
            "fake-password"
        ]);

        testUser = userResult.rows[0];
         });

        afterEach(async () => {

        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [testUser.id]
        );

        });

    test("POST /membership - no customer > 404", async () => {

    const token = jwt.sign(
        {
            id: testUser.id,
            role: testUser.role
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    const response = await request(app)
    .post('/membership/')
    .set("Authorization", `Bearer ${token}`)
        .send({
            type: "normal"
        });

    expect(response.statusCode).toBe(404)

     expect(response.body).toEqual({
    error: "Customer not found",
});
     })

})
})

describe('')


//pnpm test /membership.test.js