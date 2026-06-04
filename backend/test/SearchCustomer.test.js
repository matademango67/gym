import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_controller } from "../controller/gym_controller.js";
import * as gymModelModule from "../model/gym_model.js";

describe("GET /:search - SearchCustomer", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { search: "John" },
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should return matching customers when found", async () => {
    const mockCustomer = [
      { id: 1, name: "John", birth: "1990-01-01", email: "john@email.com" },
    ];

    const spy = jest.spyOn(gymModelModule.gym_model, 'SearchCustomer').mockResolvedValue(mockCustomer);

    await gym_controller.SearchCustomer(req, res);

    expect(spy).toHaveBeenCalledWith("John");
    expect(res.json).toHaveBeenCalledWith(mockCustomer);
    
    spy.mockRestore();
  });

  test("should return 404 when customer not found", async () => {
    const spy = jest.spyOn(gymModelModule.gym_model, 'SearchCustomer').mockResolvedValue(null);

    await gym_controller.SearchCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Customer not found" });
    
    spy.mockRestore();
  });

  test("should return 500 error when database query fails", async () => {
    const error = new Error("Database error");
    const spy = jest.spyOn(gymModelModule.gym_model, 'SearchCustomer').mockRejectedValue(error);

    await gym_controller.SearchCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    
    spy.mockRestore();
  });
});
