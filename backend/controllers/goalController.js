const asyncHandler = require("express-async-handler");

// @desc  Get goals
// @route Get /api/goals
// @access Pivate
const getGoals = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "goal",
  });
});

// @desc  Set goals
// @route Post /api/goals
// @access Pivate
const setGoals = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text");
  }
  res.status(200).json({
    message: "set goal",
  });
});

// @desc  Update goals
// @route Put /api/goals/:id
// @access Pivate
const updateGoals = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: `update goal ${req.params.id}`,
  });
});

// @desc  Delete goals
// @route Delete /api/goals/:id
// @access Pivate
const deleteGoals = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: `delete goal ${req.params.id}`,
  });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
};
