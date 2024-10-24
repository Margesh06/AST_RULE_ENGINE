const Rule = require('../models/rule');
const { Node, createAST } = require('../utils/astUtils');

async function createRule(req, res) {
    const { name, rule_string } = req.body;
    const rule = await Rule.create({ name, rule_string });
    const ast = createAST(rule_string);
    // Save AST to database...
    res.status(201).json(rule);
}
async function getRules(req, res) {
    try {
        const rules = await Rule.findAll(); // Fetch all rules from the database
        res.json(rules); // Send the rules as a JSON response
    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ message: 'Error fetching rules', error: error.message });
    }
}

module.exports = { createRule, getRules };
