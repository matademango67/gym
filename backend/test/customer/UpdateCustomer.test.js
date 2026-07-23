import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_controller } from "../../controller/gym/gym_controller.js";
import * as gymModelModule from "../../model/gym/gym_model.js";

describe("PATCH /:id", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id:  "cb40b343-1c63-4e3c-baeb-e3ce225d3c21" },

      body: {
        name: "John Updated",
        birth: "1990-01-01"
      },
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should update a customer successfully", async () => {
    const spy = jest
      .spyOn(gymModelModule.gym_model, "UpdateCustomer")
      .mockResolvedValue();

    await gym_controller.UpdateCustomer(req, res);

    expect(spy).toHaveBeenCalledWith(
      "cb40b343-1c63-4e3c-baeb-e3ce225d3c21",
      {"birth": "1990-01-01", 
       "name": "John Updated"
      }
    );

    expect(res.json).toHaveBeenCalledWith({
      message: "Customer updated successfully",
    });

    spy.mockRestore();
  });

  test("should return 404 when customer is not found", async () => {
    const error = new Error("Customer not found");
    error.statusCode = 404;

    const spy = jest
      .spyOn(gymModelModule.gym_model, "UpdateCustomer")
      .mockRejectedValue(error);

    await gym_controller.UpdateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      error: "Customer not found",
    });

    spy.mockRestore();
  });

  test("should return 500 when database update fails", async () => {
    const error = new Error("Database error");

    const spy = jest
      .spyOn(gymModelModule.gym_model, "UpdateCustomer")
      .mockRejectedValue(error);

    await gym_controller.UpdateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: "Database error",
    });

    spy.mockRestore();
  });
});