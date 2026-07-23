import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import {paymentController} from '../../controller/gym/payment_controller.js'
import * as paymentModelModule from '../../model/gym/payment_model.js'

describe("POST - /  it creates payments for the user" , () => {
    afterEach(() => {
    jest.restoreAllMocks();
});

    let req, res
    
    beforeEach(() => {
        req = {
            user : {id : "12121"}
        };
        res = {
            json : jest.fn().mockReturnThis(),
            status : jest.fn().mockReturnThis()
        };
    })

test("it should create a payment and return 201" , async () => {
    const mockPayment = {
       amount: 3000,
        time: "2025-09-04",
        membership_id: "1212"
    };

    spy = jest
    .spyOn(paymentModelModule.paymentsModel , "create_payment")
    .mockResolvedValue(mockPayment);

    await paymentController.create_payment(req,res);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("12121");

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockPayment);
});

test("should return 404 when membership is not found" ,async () => {
    const error = new Error("Membership not found");

  spy = jest 
    .spyOn(paymentModelModule.paymentsModel , "create_payment")
    .mockRejectedValue(error);

    await paymentController.create_payment(req,res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({error : "Membership not found"});
})
 
test("should return 500 when an unexpected error occurs" , async () => {
    const error = new Error("Database Error");

    spy = jest 
    .spyOn(paymentModelModule.paymentsModel , "create_payment")
    .mockRejectedValue(error);

    await paymentController.create_payment(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error : 'Database Error'});
})
} )