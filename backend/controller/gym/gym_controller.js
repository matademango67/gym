import { gym_model } from "../../model/gym/gym_model.js";

export class gym_controller {
    static async getCustomers (req,res){
        try {
            const customers = await gym_model.getCustomers();
            res.json(customers);
        } catch (error) {
           return res.status(500).json({ error: error.message });
        }
    }

    static async SearchCustomer (req,res){
        const { search } = req.params;
        try {
            const customer = await gym_model.SearchCustomer(search);
            if (customer) {
                res.json(customer);
            } else {
                res.status(404).json({ error: "Customer not found" });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async createCustomer (req,res){
        try {
            const newCustomer = await gym_model.createCustomer(req.body);
            res.status(201).json(newCustomer);
        } catch (error) {
          return  res.status(500).json({ error: error.message });
        }
} 

    static async deleteCustomer (req,res){
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "id is required" });
        }
        try {
            const result = await gym_model.deleteCustomer(id);
            res.json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
        }

    static async UpdateCustomer (req,res){
        const { id } = req.params;
        const input = req.body;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        try {
            await gym_model.UpdateCustomer(id,input);
            res.json({ message: "Customer updated successfully" });
        } catch (error) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error: error.message
        });
    }

    return res.status(500).json({
        error: error.message
    });}}
}
