import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_membership } from '../../../controller/gym/membership_controller.js';
import * as gymModelModule from '../membership_model.js'

describe("POST /", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
          customer_id : "07c7bc82-5c5f-448f-ad78-cc82ffab6a88",
          type: "vip"
      },
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should create a membership successfully", async () => {
    const mockCustomer = {
      customer_id : "07c7bc82-5c5f-448f-ad78-cc82ffab6a88",
      type: "vip"
    };

    const spy = jest
      .spyOn(gymModelModule.Membership_model, "create_membership")
      .mockResolvedValue(mockCustomer);

    await  gym_membership.create_membership(req, res);

    expect(spy).toHaveBeenCalledWith( {
       customer_id : "07c7bc82-5c5f-448f-ad78-cc82ffab6a88",
      type: "vip" }
    );

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(mockCustomer);

    spy.mockRestore();
  });

  test("should return 500 when customer creation fails", async () => {
    const error = new Error("Failed to create a membership");

    const spy = jest
      .spyOn(gymModelModule.Membership_model, "create_membership")
      .mockRejectedValue(error);

    await gym_membership.create_membership(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to create a membership",
    });

    spy.mockRestore();
  });
});