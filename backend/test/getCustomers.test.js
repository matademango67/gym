import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_controller } from "../controller/gym_controller.js";
import * as gymModelModule from "../model/gym_model.js";

describe("GET / - getCustomers", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should return all customers when successful", async () => {
    const mockCustomers = [
      { id: 1, name: "John", birth: "1990-01-01", email: "john@email.com" },
      { id: 2, name: "Jane", birth: "1995-05-05", email: "jane@email.com" },
    ];

    const spy = jest.spyOn(gymModelModule.gym_model, 'getCustomers').mockResolvedValue(mockCustomers);

    await gym_controller.getCustomers(req, res);

    expect(spy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockCustomers);
    
    spy.mockRestore();
  });

  test("should return 500 error when database query fails", async () => {
    const error = new Error("Database error");
    const spy = jest.spyOn(gymModelModule.gym_model, 'getCustomers').mockRejectedValue(error);

    await gym_controller.getCustomers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    
    spy.mockRestore();
  });
});
