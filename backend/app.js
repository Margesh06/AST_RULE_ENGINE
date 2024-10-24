const express = require('express');
const bodyParser = require('body-parser');
const ruleRoutes = require('./routes/ruleRoutes');
const evaluateRoutes = require('./routes/evaluateRoutes');
const combine_rules = require('./routes/evaluateRoutes')

const app = express();
app.use(bodyParser.json());
app.use('/api/rules', ruleRoutes);
app.use('/api/rules', evaluateRoutes);
app.use('/api/rules', combine_rules);

module.exports = app;
