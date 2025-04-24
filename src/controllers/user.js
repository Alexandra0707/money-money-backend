import createError from 'http-errors';
import { findUserById, updateUserById } from '../services/user.js';



export const getUserByIdController = async (req, res) => {
  
    const user = await findUserById(req.params.id);

    console.log(user);
    
    
    
  
    if (!user) {
      throw createError(404, 'User not found');
  
    }
  
    
    res.json({
      status: 200,
      message: `Successfully found user with id ${req.params.id}!`,
      data: user,
    });
  };

  






  export const updateUserByIdController = async (req, res) => {
    try {
      const { id } = req.params;
      
      const existingUser = await findUserById(id);
  
      if (!existingUser) {
        throw createError(404, "User not found");
      }
  
      
      const updateData = { ...req.body };
  
      
  
      if (Object.keys(updateData).length === 0) {
        throw createError(400, "At least one field must be provided for update");
      }
  
      const {...finalUpdateData } = updateData;
  
      const updatedUser = await updateUserById(id, finalUpdateData);
      if (!updatedUser) {
        throw createError(404, "User not found");
      }
  
      res.json({
        status: 200,
        message: "Successfully patched a user!",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error in updateUserByIdController:", error);
      throw createError(500, error.message || "Failed to update user");
      }
      
    };
  