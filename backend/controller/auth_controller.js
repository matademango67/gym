import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {auth_model} from "../model/auth_model.js";
import {token_model} from "../model/token_model.js";

const saltrounds = Number(process.env.SALT_ROUNDS.trim())

export class auth_controller {
   static async getUsers (req,res){
        try {
            const users = await auth_model.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}

   static async registerUser(req,res){
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await auth_model.registerUser(email, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        if(error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
      return res.status(500).json({ error: error.message });
   }
}
    
    static async registerEmployee(req,res){
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await auth_model.registerEmployee(email, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        if(error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
      return res.status(500).json({ error: error.message });
   }
}

static async registerAdmin(req,res){
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await auth_model.registerAdmin(email, hashedPassword);
        res.status(201).json(user);
    } catch (error) {
        if(error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        console.error(error);
      return res.status(500).json({ error: error.message });
   }
    }

    static async login(req,res){
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, saltrounds);
            const user = await auth_model.login(email, password);

            if(!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            res.cookie('refreshToken', user.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })

            return res.status(200).json({
                message : "Login successful",
                accessToken: user.AccessToken,
                refreshToken: user.refreshToken
            })
        } catch (error) {
            if(error.statusCode === 401) {
                return res.status(401).json({
                    status: "fail",
                    message: error.message
                })
            }
            return res.status(500).json({
                status: "fail",
                message: error.message
            })
        }
    }

      static async update(req,res){
        try {
            const { email, password, new_email, new_password } = req.body;
            const user = await auth_model.update(email, password, new_email, new_password);
            return res.status(200).json({
                status: "success",
                message: "User updated successfully",
                user: user
            });
      } catch (error) {
        if(error.statusCode === 401) {
            return res.status(401).json({
                status: "fail",
                message: error.message
            })
        }
        return res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
}

      static async refreshToken(req,res){
          // If credentials are provided, treat this as a login request
  if (req.body && req.body.email && req.body.password) {
    try {
      const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, saltrounds);
      const user = await auth_model.login(email, password)

      console.log('Refresh-as-login successful for:', email)
      return res
        .status(200)
        .cookie('refreshToken', user.refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: false
        })
        .json({ token: user.accessToken })
    } catch (err) {
      return res.status(err.statusCode || 401).json({ message: err.message })
    }
  }
     const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
            try {
                const tokens = await auth_model.refresh_token(refreshToken)
                if(!tokens || !tokens.AccessToken || !tokens.refreshToken){
                    return res.status(401).json({message: 'Invalid token response'})
                }
                res
                    .status(200)
                    .cookie('refreshToken', tokens.refreshToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: false
                    })
                    .json({ token: tokens.AccessToken });
            } catch (error) {
                res.status(401).json({ message: 'Invalid refresh token' });
            }

}  
   static async logout(req,res){
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ message: 'No refresh token provided' });
    }
    try {
        await auth_model.logout(refreshToken);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out' });
    }
}

  static async delete_user(req,res){
    const { id } = req.params;
    console.log(id)
    if(!id){
       return res.status(400).json({ message : 'Invalid id'})
    }
    try {
        await auth_model.delete_user(id)
        res.status(200).json({ message: 'user has been deleted'})
    } catch (error) {
       res.status(500).json({ message: 'error while deleting user'})
    }
  }
}