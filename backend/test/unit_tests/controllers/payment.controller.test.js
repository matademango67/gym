import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import {paymentController} from '../../../controller/gym/payment_controller.js'
import * as paymentModelModule from '../../../model/gym/payment_model.js'

describe("POST / - create_payment" , () => {
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
} );

describe('GET / - get_mypayments' , () => {
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

  test("should return 200 and the authenticated user's payments", async () => {
    const mockPayments = [
    {
        amount: 3000,
        time: "2025-09-04",
        membership_id: "12123"
    },
    {
        amount: 1500,
        time: "2025-10-04",
        membership_id: "12123"
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
});

describe('GET / - get_allpayments' , () => {
  let req , res

  beforeEach( ()=> {
    res = {
        json : jest.fn().mockReturnThis(),
        status : jest.fn().mockReturnThis()
    }
  })

  test("this test should return all the payments ", async () => {
    const mockPayments = [
    {
        amount: 3000,
        time: "2025-09-04",
        membership_id: "121212"
    },
       {
        amount: 3000,
        time: "2025-09-04",
        membership_id: "11212"
    },
       {
        amount: 3000,
        time: "2025-09-04",
        membership_id: "11212"
    },
    {
        amount: 1500,
        time: "2025-10-04",
        membership_id: "1210"
    }
];

    const spy = jest
    .spyOn(paymentModelModule.paymentsModel , "get_allpayments")
    .mockResolvedValue(mockPayments)

    await paymentController.get_allpayments(req,res)

    expect(spy).toHaveBeenCalledTimes(1)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockPayments)

    spy.mockRestore();

  })

  test("should return 500 when the model throws an error" , async () => {
     const error = new Error("Database error");
      const spy = jest
    .spyOn(paymentModelModule.paymentsModel , "get_allpayments")
    .mockRejectedValue(error);

    await paymentController.get_allpayments(req,res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error : 'Database error'});

    spy.mockRestore();       
  })
});


//pnpm test /payment.controller.test.js