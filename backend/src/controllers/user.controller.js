import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        console.log(`👥  Fetched ${users.length} users from the database`);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            console.error(`🙅‍♂️  User with ID ${req.params.id} not found`);
            const error = new Error(`User with ID ${req.params.id} not found`);
            error.status = 404;
            throw next(error);
        }
        console.log(`👤  Fetched user... name: ${user.name}`);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}