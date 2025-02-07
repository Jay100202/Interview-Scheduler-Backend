const Timeslot = require('../models/Timeslot');

const createTimeslot = async (req, res) => {
  try {
    const { start, end, title, description } = req.body;
    
    // Check for time conflicts
    const conflictingSlot = await Timeslot.findOne({
      user: req.userId,
      $or: [
        { start: { $lt: end }, end: { $gt: start } }
      ]
    });

    if (conflictingSlot) {
      return res.status(400).json({ message: 'Timeslot conflict detected' });
    }

    const timeslot = new Timeslot({
      start,
      end,
      title,
      description,
      user: req.userId
    });

    await timeslot.save();
    res.status(201).json(timeslot);
  } catch (error) {
    res.status(500).json({ message: 'Timeslot creation failed' });
  }
};

const getTimeslots = async (req, res) => {
  try {
    const timeslots = await Timeslot.find({ user: req.userId });
    res.json(timeslots);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch timeslots' });
  }
};

const updateTimeslot = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const timeslot = await Timeslot.findOneAndUpdate(
      { _id: id, user: req.userId },
      updates,
      { new: true }
    );

    if (!timeslot) {
      return res.status(404).json({ message: 'Timeslot not found' });
    }

    res.json(timeslot);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

const deleteTimeslot = async (req, res) => {
  try {
    const { id } = req.params;
    const timeslot = await Timeslot.findOneAndDelete({ _id: id, user: req.userId });

    if (!timeslot) {
      return res.status(404).json({ message: 'Timeslot not found' });
    }

    res.json({ message: 'Timeslot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};

module.exports = {
  createTimeslot,
  getTimeslots,
  updateTimeslot,
  deleteTimeslot
};