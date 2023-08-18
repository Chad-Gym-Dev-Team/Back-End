const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @desc    Get info of current user
// @route   GET /api/user
// @access  Private
const getUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: refreshToken })
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
        const roles = Object.values(foundUser.roles);
        res.json({
            _id: foundUser._id,
            name: foundUser.name,
            username: foundUser.username,
            roles: roles,
        });
    }
    );
};

// @desc    Change password, name of current user
// @route   PUT /api/users
// @access  Private
const updateUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: refreshToken })
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
        const { name, currentPassword, password } = req.body;
        if (name) foundUser.name = name;
        if (currentPassword && password) {
            const isMatch = await foundUser.matchPassword(currentPassword);
            if (!isMatch) return res.sendStatus(401).json({ message: 'Wrong password' });
            foundUser.password = password;
        }
        const updatedUser = await foundUser.save();
        res.json({ _id: updatedUser._id, username: updatedUser.username, roles: updatedUser.roles });
    }
    );
};

// @desc    Delete current user
// @route   DELETE /api/user
// @access  Private
const deleteUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: refreshToken })
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
        await foundUser.deleteOne();
        res.json({ message: 'User removed' });
    }
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
};

module.exports = { getUser, updateUser, deleteUser };
