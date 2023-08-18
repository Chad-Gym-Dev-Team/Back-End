const Training = require("../models/training");
const Activity = require("../models/activity");
const Box = require("../models/box");

const jwt = require("jsonwebtoken");
require("dotenv").config();

// @desc    Create a activity
// @route   POST /api/activities
// @access  Private/Admin
const createActivity = async (req, res) => {
    const { activityName, activityDescription, activityType, activityDuration, weight, coach } = req.body;

    const activity = new Activity({
        activityName,
        activityDescription,
        activityType,
        activityDuration,
        weight,
        coach,
    });

    const createdActivity = await activity.save();
    res.status(201).json(createdActivity);
}

// @desc    Create a box
// @route   POST /api/boxes
// @access  Private/Admin
const createBox = async (req, res) => {
    const { boxName, boxDescription, city, country, coach } = req.body;

    const box = new Box({
        boxName,
        boxDescription,
        city,
        country,
        coach,
    });

    const createdBox = await box.save();
    res.status(201).json(createdBox);
}

// @desc    Create a training
// @route   POST /api/trainings
// @access  Private/User
const createTraining = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    // get user id from jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
    });

    const { trainingName, trainingDescription, trainingType, trainingDuration, weight, coach } = req.body;

    const training = new Training({
        user: foundUser._id,
        trainingName,
        trainingDescription,
        trainingType,
        trainingDuration,
        weight,
        coach,
    });

    const createdTraining = await training.save();
    res.status(201).json(createdTraining);
}

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res) => {
    const activities = await Activity.find({});
    res.json(activities);
}

// @desc    Get all boxes
// @route   GET /api/boxes
// @access  Public
const getBoxes = async (req, res) => {
    const boxes = await Box.find({});
    res.json(boxes);
}

// @desc    Add activity to training
// @route   PUT /api/trainings/:id/addactivity
// @access  Private/User
const addActivityToTraining = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    // get user id from jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
    });

    const activity = await Activity.findById(req.params.id);
    const training = await Training.findOne({ user: foundUser._id });
    if (!training) return res.sendStatus(404); //Not found
    if (!activity) return res.sendStatus(404); //Not found

    training.activities.push(activity);
    const updatedTraining = await training.save();
    res.json(updatedTraining);
}

// @desc    Add box to training
// @route   PUT /api/trainings/:id/addbox
// @access  Private/User
const addBoxToTraining = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    // get user id from jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
    });

    const box = await Box.findById(req.params.id);
    const training = await Training.findOne({ user: foundUser._id });
    if (!training) return res.sendStatus(404); //Not found
    if (!box) return res.sendStatus(404); //Not found

    training.box.push(box);
    const updatedTraining = await training.save();
    res.json(updatedTraining);
}

// @desc    Get all trainings
// @route   GET /api/trainings
// @access  Private/Admin
const getTrainings = async (req, res) => {
    const trainings = await Training.find({});
    res.json(trainings);
}

// @desc    Get all trainings of a user
// @route   GET /api/trainings/:id
// @access  Private/User
const getTrainingsOfUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized
    const refreshToken = cookies.jwt;

    // get user id from jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
    });

    const trainings = await Training.find({ user: foundUser._id });
    res.json(trainings);
}

module.exports = {
    createActivity,
    createBox,
    createTraining,
    getActivities,
    getBoxes,
    addActivityToTraining,
    addBoxToTraining,
    getTrainings,
    getTrainingsOfUser,
}
