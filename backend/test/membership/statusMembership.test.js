import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { gym_membership } from '../../controller/gym/membership_controller';
import * as gymModelModule from '../../model/gym/membership_model'

describe("PATCH it changes the status of the membership", () => {
    afterEach(() => {
    jest.restoreAllMocks();
});

    let req ,res;

    beforeEach(() => {
        req = {
            params :{
               id : '1'
            }
            
        };

        res = {
            json : jest.fn().mockReturnThis(),
            status : jest.fn().mockReturnThis(),
        };  
    })
    test("should change the current status of the membership" , async () => {
                 const mockMembership = {
    id: "2",
    status: "active",
    expire: "2026-08-01"
};
          const spy = jest
          .spyOn(gymModelModule.Membership_model , "changeStatus_membership")
          .mockResolvedValue(mockMembership);

          await gym_membership.changeStatus_membership(req,res)

          expect(spy).toHaveBeenCalledWith("1");

          expect(spy).toHaveBeenCalledTimes(1);

          expect(res.status).toHaveBeenCalledWith(200)

        expect(res.json).toHaveBeenCalledWith(mockMembership);

    })

    test("should return 404 when the membership does not exist" ,async () => {
      const spy = jest
      .spyOn(gymModelModule.Membership_model , "changeStatus_membership")
      .mockRejectedValue(Error("Membership not found"));

      await gym_membership.changeStatus_membership(req,res)

    expect(spy).toHaveBeenCalledTimes(1);
expect(res.status).toHaveBeenCalledWith(404);
expect(res.json).toHaveBeenCalledWith({
    message: "Membership not found"
});

    })

 test("should return 400 when the membership cannot change status" ,async () => {
        const spy = jest
        .spyOn(gymModelModule.Membership_model , "changeStatus_membership")
        .mockRejectedValue(Error("You can't change your membership's status due to your current status"))

        await gym_membership.changeStatus_membership(req,res)

        expect(spy).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400)

})

    test("should return 500 when an unexpected error occurs" ,async () => {
        const spy = jest
        .spyOn(gymModelModule.Membership_model , "changeStatus_membership")
        .mockRejectedValue(Error("palanca"))

        await gym_membership.changeStatus_membership(req,res)

        expect(spy).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500)
})
})