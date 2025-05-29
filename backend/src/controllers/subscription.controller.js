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
        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
}