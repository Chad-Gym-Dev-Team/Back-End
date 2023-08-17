const User = require('../models/user');

const handleNewUser = async (req, res) => {
	const { name, user, pwd, gender, email, age, phone, role } = req.body;
	if (!user || !pwd)
		return res
			.status(400)
			.json({ message: 'Username and password are required.' });
	
	// roles: "User", "Admin", "Editor"
	// add roles to the user
	const roles = {}
	if (role) {
		if (role === "Admin") {
			roles.Admin = 5150;
		} else if (role === "Editor") {
			roles.Editor = 1984;
		}
	} else roles.User = 2001;
	

	// check for duplicate usernames in the db
	const duplicate = await User.findOne({ username: user })
	if (duplicate) return res.sendStatus(409); //Conflict

	const user_data = await User.create({
		name: name,
		username: user,
		password: pwd,
		email: email,
		roles: roles,
	});
	
	if (user_data)
	{
		res.status(201).json({ success: `New user ${user} created!` });
	} else {
		res.status(500).json({ error: `Failed to create new user ${user}!` });
	}
};

module.exports = { handleNewUser };
