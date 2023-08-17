const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res
			.status(400)
			.json({ message: 'Username and password are required.' });
	const foundUser = await User.findOne({ username: user })
	if (!foundUser) return res.sendStatus(401); //Unauthorized
	// evaluate password
	const match = await foundUser.matchPassword(pwd);
	if (match) {
		const roles = foundUser.roles;
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					"username": foundUser.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		);
		const refreshToken = jwt.sign(
			{ "username": foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		// Saving refreshToken with current user
		foundUser.refreshToken = refreshToken;
		const updatedUser = await foundUser.save()

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({_id: updatedUser._id, user: user.username, accessToken: accessToken });
	} else {
		res.sendStatus(401);
	}
};

module.exports = { handleLogin };
