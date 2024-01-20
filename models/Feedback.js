import { Schema, model } from "mongoose";

const feedbackSchema = Schema({
    email: {
        type: String,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: [true, 'createdAt is required'],
    },
    designAndLayout: {
        type: Number,
        default: 0,
        min: [0, 'Design and layout rating cannot be less than 0'],
        max: [5, 'Design and layout rating cannot be more than 5'],
    },
    mobileResponsiveness: {
        type: Number,
        default: 0,
        min: [0, 'Mobile responsiveness rating cannot be less than 0'],
        max: [5, 'Mobile responsiveness rating cannot be more than 5'],
    },
    overallSatisfaction: {
        type: Number,
        default: 0,
        min: [0, 'Overall satisfaction rating cannot be less than 0'],
        max: [5, 'Overall satisfaction rating cannot be more than 5'],
    },
    suggestion: {
        type: String,
        maxlength: [500, 'Suggestion cannot exceed 500 characters'],
    },
});

export default model('Feedback', feedbackSchema);
