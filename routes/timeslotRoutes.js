const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createTimeslot,
  getTimeslots,
  updateTimeslot,
  deleteTimeslot
} = require('../controllers/timeslotController');

router.use(auth);

router.post('/', createTimeslot);
router.get('/', getTimeslots);
router.put('/:id', updateTimeslot);
router.delete('/:id', deleteTimeslot);

module.exports = router;