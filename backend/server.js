// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const ruleRoutes = require('./routes/ruleRoutes');
const evaluateRoutes = require('./routes/evaluateRoutes');
const combine_rules = require('./routes/evaluateRoutes');

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(express.json());

// Define routes
app.use('/api/rules', ruleRoutes);
app.use('/api/rules', evaluateRoutes);
app.use('/api/rules', combine_rules);

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

// Export the app for testing or additional configuration
module.exports = app;
