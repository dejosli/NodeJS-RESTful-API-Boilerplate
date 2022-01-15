// External module imports
const express = require('express');

// Internal module imports

const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).json({ msg: 'Pong!' });
});

// Module exports
module.exports = router;
