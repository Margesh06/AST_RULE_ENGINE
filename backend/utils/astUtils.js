class Node {
    constructor(type, value = null, left = null, right = null) {
        this.type = type;
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

function createAST(ruleString) {
    // Parsing ruleString to an AST (simplified example, would need a proper parser for complex rules)
    // e.g., "age > 30 AND salary > 50000" would be converted into a tree structure
    const rootNode = new Node('operator', 'AND');
    rootNode.left = new Node('operand', 'age > 30');
    rootNode.right = new Node('operand', 'salary > 50000');
    return rootNode;
}

function evaluateAST(node, data) {
    if (node.type === 'operand') {
        const [attribute, operator, value] = parseCondition(node.value);
        if (operator === '>') return data[attribute] > Number(value);
        if (operator === '<') return data[attribute] < Number(value);
        if (operator === '=') return data[attribute] === value;
    } else if (node.type === 'operator') {
        const leftResult = evaluateAST(node.left, data);
        const rightResult = evaluateAST(node.right, data);
        if (node.value === 'AND') return leftResult && rightResult;
        if (node.value === 'OR') return leftResult || rightResult;
    }
    return false;
}

module.exports = { Node, createAST, evaluateAST };
