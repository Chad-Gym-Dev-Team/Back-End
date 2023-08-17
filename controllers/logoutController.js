const User = require('../models/user');

const handleLogout = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content
	const refreshToken = cookies.jwt;

	// Is refreshToken in db?
	const foundUser = User.findOne({ refreshToken: refreshToken });
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}

	// Delete refreshToken in db
	const otherUsers = User.find({ refreshToken: { $ne: refreshToken } });
	if (otherUsers) {
		await User.updateMany(
			{ refreshToken: { $ne: refreshToken } },
			{ refreshToken: null }
		);
	}

	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	res.sendStatus(204);
};

module.exports = { handleLogout };
