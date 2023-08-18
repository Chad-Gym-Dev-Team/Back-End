const mongoose = require('mongoose')

// boxSchema
const boxSchema = mongoose.Schema(
    {
        boxName: {
            type: String,
            required: false,
        },
        boxDescription: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        country: {
            type: String,
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

module.exports = Box = mongoose.model('Box', boxSchema)