import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_controller } from "../controller/gym_controller.js";
import * as gymModelModule from "../model/gym_model.js";

describe("POST / - createCustomer", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John",
        birth: "1990-01-01",
        email: "john@email.com",
      },
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should create a new customer when valid input is provided", async () => {
    const mockNewCustomer = {
      name: "John",
      birth: "1990-01-01",
      email: "john@email.com",
    };

    const createSpy = jest.spyOn(gymModelModule.gym_model, 'createCustomer').mockResolvedValue(mockNewCustomer);

    await gym_controller.createCustomer(req, res);

    expect(createSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockNewCustomer);
    
    createSpy.mockRestore();
  });

  test("should return 400 error when validation fails", async () => {
    req.body = { name: "" }; // Empty name should fail validation

    await gym_controller.createCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid input" });
  });

  test("should return 500 error when database insert fails", async () => {
    const error = new Error("Failed to create customer");

    const createSpy = jest.spyOn(gymModelModule.gym_model, 'createCustomer').mockRejectedValue(error);

    await gym_controller.createCustomer(req, res);

    expect(createSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to create customer" });
    
    createSpy.mockRestore();
  });
});
