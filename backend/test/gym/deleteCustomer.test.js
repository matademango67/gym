import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_controller } from "../../controller/gym/gym_controller.js";
import { gym_model } from '../../model/gym/gym_model.js';

describe("DELETE / - deleteCustomer", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { id: 1 },
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should delete a customer when valid ID is provided", async () => {
    const mockResponse = { message: "Customer deleted successfully" };

    const spy = jest.spyOn(gym_model, 'deleteCustomer').mockResolvedValue(mockResponse);

    await gym_controller.deleteCustomer(req, res);

    expect(spy).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    
    spy.mockRestore();
  });

  test("should return 400 error when ID is not provided", async () => {
    req.body = {};

    await gym_controller.deleteCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "id is required" });
  });

  test("should return 500 error when customer is not found", async () => {
    const error = new Error("Customer not found");
    const spy = jest.spyOn(gym_model, 'deleteCustomer').mockRejectedValue(error);

    await gym_controller.deleteCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Customer not found" });
    
    spy.mockRestore();
  });
});
