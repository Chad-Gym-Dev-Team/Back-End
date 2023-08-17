const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Create User Schema
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
			required: false,
			unique: false,
		},
		password: {
			type: String,
			required: true,
		},
		roles: {
			type: Object,
			required: true,
			default: { User: 2001 },
		},
		refreshToken: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
)

// To match enteredPassword with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

// To encrypt password upon registration
userSchema.pre('save', async function (next) {
	// First check if password is modified
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

module.exports = User = mongoose.model('User', userSchema)