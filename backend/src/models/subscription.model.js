import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Subscription name is required'],
            trim: true,
            minlength: [3, 'Subscription name must be at least 3 characters long'],
            maxlength: [50, 'Subscription name must not exceed 50 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Subscription price is required'],
            min: [0, 'Price must be a positive number'],
        },
        currency: {
            type: String,
            enum: ['USD', 'INR', 'AUD', 'CAD', 'AED', 'EUR', 'GBP'],
            default: 'INR',
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
        },
        category: {
            type: String,
            enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'food', 'finance', 'health', 'education', 'Others'],
            default: 'Others',
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active',
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: (value) => value <= new Date(),
                message: 'Start date cannot be in the future',
            }
        }, renewalDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value > this.startDate;
                },
                message: 'Renewal date must be after the start date',
            }
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Index for faster lookups
        },
    }, { timestamps: true }
);

subscriptionSchema.pre('save', function (next) {
    // Ensure that renewalDate is always after startDate
    if (!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + (renewalPeriods[this.frequency])); // Default to 30 days if frequency is not set
    }

    if(this.renewalDate < new Date()) {
        this.status = 'expired'; // Automatically set status to expired if renewal date is in the past
    }
    next();
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);