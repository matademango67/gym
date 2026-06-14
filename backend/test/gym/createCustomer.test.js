import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_controller } from "../../controller/gym/gym_controller.js";
import * as gymModelModule from "../../model/gym/gym_model.js";

describe("POST /", () => {
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

  test("should create a customer successfully", async () => {
    const mockCustomer = {
      id: 1,
      name: "John",
      birth: "1990-01-01",
      email: "john@email.com",
    };

    const spy = jest
      .spyOn(gymModelModule.gym_model, "createCustomer")
      .mockResolvedValue(mockCustomer);

    await gym_controller.createCustomer(req, res);

    expect(spy).toHaveBeenCalledWith( {
      birth: "1990-01-01",
      email: "john@email.com",
      name: "John" }
    );

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(mockCustomer);

    spy.mockRestore();
  });

  test("should return 500 when customer creation fails", async () => {
    const error = new Error("Failed to create customer");

    const spy = jest
      .spyOn(gymModelModule.gym_model, "createCustomer")
      .mockRejectedValue(error);

    await gym_controller.createCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to create customer",
    });

    spy.mockRestore();
  });
});