const express = require('express');
const { evaluateRule, combine_rules } = require('../controllers/evaluateController');
const router = express.Router();

router.post('/evaluate', evaluateRule);
router.post('/combine',combine_rules);

module.exports = router;
