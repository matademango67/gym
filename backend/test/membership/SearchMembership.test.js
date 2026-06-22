import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_membership } from '../../controller/gym/membership_controller';
import * as gymModelModule from '../../model/gym/membership_model'

describe("GET /:customer_id - SearchCustomer", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { customer_id: "ba5e434e-0ed6-45dd-ac92-3dfb39234e43" },
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should return matching Membership when found", async () => {
    const mockCustomer = [
      { id: "26457d53-d34c-4750-bd30-102299204078",
        customer_id: "ba5e434e-0ed6-45dd-ac92-3dfb39234e43",
        type: "normal",
        expire: "2026-11-15T04:00:00.000Z",
        start: "2026-01-15T04:00:00.000Z",
        cost: "1500.00",
        status: "active" },
    ];

    const spy = jest.spyOn(gymModelModule.Membership_model, 'search_membership').mockResolvedValue(mockCustomer);

    await gym_membership.search_memberships(req, res);

    expect(spy).toHaveBeenCalledWith("ba5e434e-0ed6-45dd-ac92-3dfb39234e43");
    expect(res.json).toHaveBeenCalledWith(mockCustomer);
    
    spy.mockRestore();
  });

  test("should return 404 when Membership not found", async () => {
    const spy = jest.spyOn(gymModelModule.Membership_model, 'search_membership').mockResolvedValue(null);

    await gym_membership.search_memberships(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "membership not found" });
    
    spy.mockRestore();
  });

  test("should return 500 error when database query fails", async () => {
    const error = new Error("Database error");
    const spy = jest.spyOn(gymModelModule.Membership_model, 'search_membership').mockRejectedValue(error);

    await gym_membership.search_memberships(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    
    spy.mockRestore();
  });
});
