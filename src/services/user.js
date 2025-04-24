import User from '../models/User.js';


export const findUserById = async (id) => {
    return await User.findById(id);
};

export const updateUserById = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, {
        new: true,
    }
    );
  };