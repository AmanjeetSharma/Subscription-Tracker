import { Subscription } from '../models/subscription.model.js';

export const createSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        console.log(`✅ Subscription created: ${subscription.name} on ${subscription.createdAt}`);
        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: subscription
        });

    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('Unauthorized access to user subscriptions');
            error.status = 403; // Forbidden
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.params.id });
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No subscriptions found for this user'
            });
        }
        console.log(`✅ Subscriptions retrieved for user: ${req.params.id}`);
        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }
        console.log(`✅ Subscription deleted: ${subscription.name}`);
        res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });// new parameter returns the updated document
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }
        console.log(`✅ Subscription updated: ${subscription.name}`);
        // Return only the updated fields along with the id
        const updatedFields = Object.keys(req.body);
        const updatedData = { _id: subscription._id };
        updatedFields.forEach(field => {
            updatedData[field] = subscription[field];
        });
        console.log(`Updated fields: ${JSON.stringify(updatedData)}`);
        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}