const mongoose = require('mongoose')

// activitySchema
const activitySchema = mongoose.Schema(
    {
        activityName: {
            type: String,
            required: false,
        },
        activityDescription: {
            type: String,
            required: false,
        },
        activityType: {
            type: String,
            required: false,
        },
        activityDuration: {
            type: Number,
            required: false,
        },
        weight: {
            type: Number,
            required: false,
        },
        coach: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Activity = mongoose.model('Activity', activitySchema)