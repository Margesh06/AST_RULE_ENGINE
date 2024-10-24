function parseCondition(condition) {
    // Example: "age > 30" -> ["age", ">", "30"]
    const match = condition.match(/(\w+)\s*(>|<|=)\s*([\w\d]+)/);
    if (!match) {
        throw new Error('Invalid condition format');
    }
    return [match[1], match[2], match[3]];
}

module.exports = { parseCondition };
