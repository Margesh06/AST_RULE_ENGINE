// const Rule = require('../models/rule');

// class Node {
//     constructor(type, value = null, left = null, right = null) {
//         this.type = type; // Type of the node (operator or operand)
//         this.value = value; // Value of the node (e.g., 'AND', 'OR', or a condition)
//         this.left = left; // Left child node
//         this.right = right; // Right child node
//     }
// }

// function createAST(ruleString) {
//     const tokens = tokenize(ruleString);
//     console.log("Tokens from tokenize function:", tokens); // Log tokens for debugging
//     const rootNode = parseTokens(tokens);
//     return rootNode;
// }

// function tokenize(ruleString) {
//     // Improved regex to handle string and numeric tokens correctly
//     const regex = /(\s+|AND|OR|\(|\)|>=|<=|>|<|=|!=|[\w]+|'[^']*'|\d+|\.\d+)/g;
//     return ruleString.split(regex).filter(token => token.trim() !== '');
// }

// function parseTokens(tokens) {
//     const output = [];
//     const operators = [];

//     const precedence = {
//         'OR': 1,
//         'AND': 2,
//         '>': 3,
//         '<': 3,
//         '>=': 3,
//         '<=': 3,
//         '=': 3,
//         '!=': 3,
//     };

//     const isOperator = (token) => token in precedence;

//     for (const token of tokens) {
//         console.log("Processing token:", token); // Log each token being processed
//         if (token === '(') {
//             operators.push(token);
//         } else if (token === ')') {
//             while (operators.length && operators[operators.length - 1] !== '(') {
//                 output.push(operators.pop());
//             }
//             operators.pop(); // Remove '('
//         } else if (isOperator(token)) {
//             while (
//                 operators.length &&
//                 isOperator(operators[operators.length - 1]) &&
//                 precedence[operators[operators.length - 1]] >= precedence[token]
//             ) {
//                 output.push(operators.pop());
//             }
//             operators.push(token);
//         } else {
//             output.push(token); // Operand
//         }
//     }

//     while (operators.length) {
//         output.push(operators.pop());
//     }

//     console.log("Output of parseTokens function:", output); // Log the output
//     return buildAST(output);
// }

// function buildAST(postfixTokens) {
//     const stack = [];
//     console.log("Postfix Tokens for AST building:", postfixTokens); // Log postfix tokens

//     for (const token of postfixTokens) {
//         console.log("Building AST with token:", token); // Log each token during AST building

//         if (['>', '<', '>=', '<=', '=', '!=', 'AND', 'OR'].includes(token)) {
//             const right = stack.pop(); // Right operand
//             const left = stack.pop(); // Left operand

//             if (!left || !right) {
//                 console.error("Invalid expression, cannot build AST with token:", token);
//                 return null; // Return null if the expression is invalid
//             }

//             const operatorNode = new Node('operator', token, left, right);
//             stack.push(operatorNode);
//             console.log(`Created operator node: ${token}`); // Log operator node creation
//         } else {
//             const operandNode = new Node('operand', token); // Create operand node
//             stack.push(operandNode);
//             console.log(`Created operand node: ${token}`); // Log operand node creation
//         }
//     }

//     if (stack.length !== 1) {
//         console.error("Invalid AST structure, stack should contain exactly one element.");
//         return null; // Return null if the stack doesn't have exactly one element
//     }

//     console.log("Final AST:", JSON.stringify(stack[0], null, 2)); // Log the final AST
//     return stack[0]; // Return the root of the AST
// }

// function evaluateAST(node, data) {
//     if (node.type === 'operand') {
//         // Handle operand evaluation
//         if (node.value[0] === "'" || node.value[0] === '"') {
//             return node.value.slice(1, -1); // Remove quotes from string literals
//         }
//         return isNaN(node.value) ? data[node.value] : Number(node.value); // Convert to number if it's numeric
//     } else if (node.type === 'operator') {
//         const leftValue = evaluateAST(node.left, data);
//         const rightValue = evaluateAST(node.right, data);

//         // Handle undefined values
//         if (leftValue === undefined || rightValue === undefined) {
//             console.error("Undefined operand values:", { leftValue, rightValue });
//             return false; // Return false if any operand is not found
//         }

//         console.log(`Evaluating: ${leftValue} ${node.value} ${rightValue}`);

//         // Perform the comparison based on the operator
//         switch (node.value) {
//             case '>':
//                 return leftValue > rightValue;
//             case '<':
//                 return leftValue < rightValue;
//             case '>=':
//                 return leftValue >= rightValue;
//             case '<=':
//                 return leftValue <= rightValue;
//             case '=':
//                 return leftValue === rightValue;
//             case '!=':
//                 return leftValue !== rightValue;
//             case 'AND':
//                 return leftValue && rightValue; // Assuming leftValue and rightValue are boolean
//             case 'OR':
//                 return leftValue || rightValue; // Assuming leftValue and rightValue are boolean
//             case 'NOT': 
//                 return !rightValue;
//             default:
//                 console.error("Unknown operator:", node.value);
//                 return false;
//         }
//     }
//     return false;
// }

// async function evaluateRule(req, res) {
//     console.log('Request body:', JSON.stringify(req.body, null, 2)); // Log the entire request body to inspect its structure

//     // Correctly access the ruleId and data based on the nested structure
//     const ruleId = req.body?.data?.data?.data?.ruleId;
//     const data = req.body?.data?.data?.data;

//     // Validate incoming data
//     if (!ruleId || typeof ruleId !== 'string') {
//         console.error('Invalid ruleId:', ruleId);
//         return res.status(400).json({ error: 'Invalid ruleId' });
//     }

//     if (!data || typeof data !== 'object') {
//         console.error('Invalid data:', data);
//         return res.status(400).json({ error: 'Invalid data' });
//     }

//     try {
//         // Fetch the rule from the database using the provided ruleId
//         const rule = await Rule.findByPk(ruleId);
//         if (!rule) {
//             console.error('Rule not found:', ruleId);
//             return res.status(404).json({ error: 'Rule not found' });
//         }

//         const ruleString = rule.rule_string; // Retrieve the ruleString from the rule
//         console.log('Rule string:', ruleString); // Log the rule string

//         // Create the AST from the rule string
//         const ast = createAST(ruleString);
//         if (!ast) {
//             console.error('Failed to create AST from rule string:', ruleString);
//             return res.status(500).json({ error: 'Failed to create AST' });
//         }

//         // Evaluate the AST with the provided data
//         const result = evaluateAST(ast, data);
//         console.log('Evaluation result:', result); // Log the evaluation result
//         return res.json({ result });
//     } catch (error) {
//         console.error('Error evaluating rule:', error); // Log the error
//         return res.status(500).json({ error: 'Error evaluating rule' });
//     }
// }

// module.exports = { evaluateRule };

const Rule = require('../models/rule');

class Node {
    constructor(type, value = null, left = null, right = null) {
        this.type = type; // Type of the node (operator or operand)
        this.value = value; // Value of the node (e.g., 'AND', 'OR', or a condition)
        this.left = left; // Left child node
        this.right = right; // Right child node
    }
}

function createAST(ruleString) {
    const tokens = tokenize(ruleString);
    console.log("Tokens from tokenize function:", tokens); // Log tokens for debugging
    const rootNode = parseTokens(tokens);
    return rootNode;
}

function tokenize(ruleString) {
    // Improved regex to handle string and numeric tokens correctly
    const regex = /(\s+|AND|OR|\(|\)|>=|<=|>|<|=|!=|[\w]+|'[^']*'|\d+|\.\d+)/g;
    return ruleString.split(regex).filter(token => token.trim() !== '');
}

function parseTokens(tokens) {
    const output = [];
    const operators = [];

    const precedence = {
        'OR': 1,
        'AND': 2,
        '>': 3,
        '<': 3,
        '>=': 3,
        '<=': 3,
        '=': 3,
        '!=': 3,
    };

    const isOperator = (token) => token in precedence;

    for (const token of tokens) {
        console.log("Processing token:", token); // Log each token being processed
        if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop(); // Remove '('
        } else if (isOperator(token)) {
            while (
                operators.length &&
                isOperator(operators[operators.length - 1]) &&
                precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
                output.push(operators.pop());
            }
            operators.push(token);
        } else {
            output.push(token); // Operand
        }
    }

    while (operators.length) {
        output.push(operators.pop());
    }

    console.log("Output of parseTokens function:", output); // Log the output
    return buildAST(output);
}

function buildAST(postfixTokens) {
    const stack = [];
    console.log("Postfix Tokens for AST building:", postfixTokens); // Log postfix tokens

    for (const token of postfixTokens) {
        console.log("Building AST with token:", token); // Log each token during AST building

        if (['>', '<', '>=', '<=', '=', '!=', 'AND', 'OR', 'NOT'].includes(token)) {
            let right = stack.pop(); // Right operand
            let left = null;

            if (token !== 'NOT') {
                left = stack.pop(); // Left operand for binary operators
            }

            if (!right || (token !== 'NOT' && !left)) {
                console.error("Invalid expression, cannot build AST with token:", token);
                return null; // Return null if the expression is invalid
            }

            const operatorNode = new Node('operator', token, left, right);
            stack.push(operatorNode);
            console.log(`Created operator node: ${token}`); // Log operator node creation
        } else {
            const operandNode = new Node('operand', token); // Create operand node
            stack.push(operandNode);
            console.log(`Created operand node: ${token}`); // Log operand node creation
        }
    }

    if (stack.length !== 1) {
        console.error("Invalid AST structure, stack should contain exactly one element.");
        return null; // Return null if the stack doesn't have exactly one element
    }

    console.log("Final AST:", JSON.stringify(stack[0], null, 2)); // Log the final AST
    return stack[0]; // Return the root of the AST
}

function evaluateAST(node, data) {
    if (node.type === 'operand') {
        if (node.value[0] === "'" || node.value[0] === '"') {
            return node.value.slice(1, -1); // Remove quotes from string literals
        }
        return isNaN(node.value) ? data[node.value] : Number(node.value); // Convert to number if it's numeric
    } else if (node.type === 'operator') {
        const leftValue = node.left ? evaluateAST(node.left, data) : undefined; // Left operand
        const rightValue = evaluateAST(node.right, data); // Right operand

        if (leftValue === undefined || rightValue === undefined) {
            console.error("Undefined operand values:", { leftValue, rightValue });
            return false; // Return false if any operand is not found
        }

        console.log(`Evaluating: ${leftValue} ${node.value} ${rightValue}`);

        switch (node.value) {
            case '>':
                return leftValue > rightValue;
            case '<':
                return leftValue < rightValue;
            case '>=':
                return leftValue >= rightValue;
            case '<=':
                return leftValue <= rightValue;
            case '=':
                return leftValue === rightValue;
            case '!=':
                return leftValue !== rightValue;
            case 'AND':
                return leftValue && rightValue;
            case 'OR':
                return leftValue || rightValue;
            case 'NOT':
                return !rightValue; // Right only for NOT
            default:
                console.error("Unknown operator:", node.value);
                return false;
        }
    }
    return false;
}

async function combine_rules(req, res) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log incoming request body
    try {
        const { ruleIds } = req.body; // Only extract ruleIds from the request body

        // Validate ruleIds
        if (!ruleIds || !Array.isArray(ruleIds) || ruleIds.length === 0) {
            console.error("Invalid ruleIds provided.");
            return res.status(400).json({ error: 'Invalid ruleIds' });
        }

        // Fetch rules from the database
        const rules = await Rule.findAll({ where: { id: ruleIds } });
        console.log("Fetched rules:", JSON.stringify(rules, null, 2)); // Log fetched rules

        if (rules.length === 0) {
            console.error("No rules found for the provided ruleIds.");
            return res.status(404).json({ error: 'No rules found' });
        }

        // Extract rule strings and names
        const ruleStrings = rules.map(rule => rule.rule_string);
        const ruleNames = rules.map(rule => rule.name); // Assuming each rule has a `name` property
        console.log("Rule Strings:", ruleStrings); // Log rule strings
        console.log("Rule Names:", ruleNames); // Log rule names

        // Combine rule strings and names
        const combinedRuleString = ruleStrings.join(' AND ');
        const combinedName = ruleNames.join('_'); // Combine names with a space

        console.log("Combined Rule String:", combinedRuleString); // Log combined rule string
        console.log("Combined Name:", combinedName); // Log combined name

        // Create a new rule with the combined rule string and name
        const rule = await Rule.create({ name: combinedName, rule_string: combinedRuleString }); // Pass combinedName

        const ast = createAST(combinedRuleString); // Create AST from the combined rule string

        // Save AST to database if necessary
        // Example: await ASTModel.create({ ruleId: rule.id, ast });

        // Check if AST creation was successful
        if (!ast) {
            console.error("Failed to create combined AST");
            return res.status(500).json({ error: 'Failed to create combined AST' });
        }

        // Respond with the created rule
        res.status(201).json(rule);
    } catch (error) {
        console.error("Error in combine_rules:", error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
}



async function evaluateRule(req, res) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const ruleId = req.body?.data?.ruleId;
const data = req.body?.data;

    

    if (!ruleId || typeof ruleId !== 'string') {
        console.error('Invalid ruleId:', ruleId);
        return res.status(400).json({ error: 'Invalid ruleId' });
    }

    if (!data || typeof data !== 'object') {
        console.error('Invalid data:', data);
        return res.status(400).json({ error: 'Invalid data' });
    }

    try {
        const rule = await Rule.findByPk(ruleId);
        if (!rule) {
            console.error('Rule not found:', ruleId);
            return res.status(404).json({ error: 'Rule not found' });
        }

        const ruleString = rule.rule_string;
        console.log('Rule string:', ruleString);

        const ast = createAST(ruleString);
        if (!ast) {
            console.error('Failed to create AST from rule string:', ruleString);
            return res.status(500).json({ error: 'Failed to create AST' });
        }

        const result = evaluateAST(ast, data);
        console.log('Evaluation result:', result);
        return res.json({ result });
    } catch (error) {
        console.error('Error evaluating rule:', error);
        return res.status(500).json({ error: 'Error evaluating rule' });
    }
}

module.exports = { evaluateRule, combine_rules };
