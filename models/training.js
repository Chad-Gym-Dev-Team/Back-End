const mongoose = require('mongoose')
const activitySchema = require('./activity').schema
const boxSchema = require('./box').schema

// Create Training Schema
const trainingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        trainingName: {
            type: String,
            required: false,
        },
        trainingDescription: {
            type: String,
            required: false,
        },
        activities: [activitySchema],
        box: [boxSchema],
        validation: {
            type: Boolean,
            required: false,
            default: false,
        },
        createdAt: {
            type: Date,
            required: false,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = Training = mongoose.model('Training', trainingSchema)