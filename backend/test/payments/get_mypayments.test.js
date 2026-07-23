import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import {paymentController} from '../../controller/gym/payment_controller.js'
import * as paymentModelModule from '../../model/gym/payment_model.js'

describe('Get - it gets the users payments' , () => {
  let req , res

  beforeEach( ()=> {
       req = {
        user : {id : "123123"}
    },
    res = {
        json : jest.fn().mockReturnThis(),
        status : jest.fn().mockReturnThis()
    }
  })

  test("this test should return all the payments the user did and a 200 status code", async () => {
    const mockPayments = [
    {
        amount: 3000,
        time: "2025-09-04",
        membership_id: "1212"
    },
    {
        amount: 1500,
        time: "2025-10-04",
        membership_id: "1212"
    }
];

    const spy = jest
    .spyOn(paymentModelModule.paymentsModel , "get_mypayments")
    .mockResolvedValue(mockPayments)

    await paymentController.get_mypayments(req,res)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith("123123")

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockPayments)

    spy.mockRestore();

  })

  test("should return 500 when the model throws an error" , async () => {
     const error = new Error("Database error");
      const spy = jest
    .spyOn(paymentModelModule.paymentsModel , "get_mypayments")
    .mockRejectedValue(error);

    await paymentController.get_mypayments(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error : 'Database error'});

    spy.mockRestore();       
  })
})

//pnpm test payments/get_mypayments.test.js