const express = require('express');
const router = express.Router();
const activityController = require('../../controllers/activityController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// @route GET api/activities
// @route POST api/activities
router.route('/')
    .get(activityController.getActivities)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), activityController.createActivity);

// @route GET api/boxes
// @route POST api/boxes
router.route('/boxes')
    .get(activityController.getBoxes)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), activityController.createBox);

// @route GET api/trainings
// @route POST api/trainings
router.route('/trainings')
    .get(activityController.getTrainings)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), activityController.createTraining);

// @route GET api/trainings/:id
// @route PUT api/trainings/:id
// @route DELETE api/trainings/:id
router.route('/trainings/:id')
    .get(activityController.getTrainingsOfUser)
    // .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), activityController.updateTraining)
    // .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), activityController.deleteTraining);

// @route POST api/trainings/:id/addactivity
router.route('/trainings/:id/addativicty')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), activityController.addActivityToTraining);

// @route POST api/trainings/:id/addbox
router.route('/trainings/:id/addbox')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), activityController.addBoxToTraining);

module.exports = router;