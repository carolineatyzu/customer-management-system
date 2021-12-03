const router = require("express").Router();
const { soldiersRouter,soldierRouter } = require('./soldier/router');

router.use('/soldiers',soldiersRouter);
router.use('/soldier',soldierRouter);

module.exports = router;