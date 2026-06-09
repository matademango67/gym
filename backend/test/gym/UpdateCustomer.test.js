import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_controller } from "../../controller/gym_controller.js";
import * as gymModelModule from "../../model/gym_model.js";

describe("PUT /:id - UpdateCustomer", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: {
        name: "John Updated",
        birth: "1990-01-01",
        email: "johnupdated@email.com",
      },
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should update a customer when valid input and ID are provided", async () => {
    const mockData = {
      name: "John Updated",
      birth: "1990-01-01",
      email: "johnupdated@email.com",
    };

    const updateSpy = jest.spyOn(gymModelModule.gym_model, 'UpdateCustomer').mockResolvedValue();

    await gym_controller.UpdateCustomer(req, res);

    expect(updateSpy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Customer updated successfully" });
    
    updateSpy.mockRestore();
  });

  test("should return 400 error when validation fails", async () => {
    req.body = { name: "" }; // Empty name should fail validation

    await gym_controller.UpdateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid input" });
  });

  test("should return 400 error when ID is not provided", async () => {
    req.params = {};
    const mockData = {
      name: "John Updated",
      birth: "1990-01-01",
      email: "johnupdated@email.com",
    };

    await gym_controller.UpdateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "ID is required" });
  });

  test("should return 500 error when database update fails", async () => {
    const error = new Error("Customer not found or update failed");

    const updateSpy = jest.spyOn(gymModelModule.gym_model, 'UpdateCustomer').mockRejectedValue(error);

    await gym_controller.UpdateCustomer(req, res);

    expect(updateSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Customer not found or update failed" });
    
    updateSpy.mockRestore();
  });
});
