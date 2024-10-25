
# Rule Engine with AST

## Objective
Develop a simple 3-tier rule engine application (Simple UI, API, and Backend) to determine user eligibility based on attributes like age, department, income, spend, etc. The system will use an Abstract Syntax Tree (AST) to represent conditional rules and allow for dynamic creation, combination, and modification of these rules.

## Data Structure
Define a data structure to represent the AST. The structure will allow for rule changes.

### Node Structure
- `type`: String indicating the node type ("operator" for AND/OR, "operand" for conditions).
- `left`: Reference to another Node (left child).
- `right`: Reference to another Node (right child for operators).
- `value`: Optional value for operand nodes (e.g., number for comparisons).

### Sample AST Representation
```json
{
  "type": "operator",
  "value": "AND",
  "left": {
    "type": "operator",
    "value": "OR",
    "left": {
      "type": "operator",
      "value": "AND",
      "left": {
        "type": "operand",
        "value": {
          "attribute": "age",
          "comparison": ">",
          "value": 30
        }
      },
      "right": {
        "type": "operand",
        "value": {
          "attribute": "department",
          "comparison": "=",
          "value": "Sales"
        }
      }
    },
    "right": {
      "type": "operator",
      "value": "AND",
      "left": {
        "type": "operand",
        "value": {
          "attribute": "age",
          "comparison": "<",
          "value": 25
        }
      },
      "right": {
        "type": "operand",
        "value": {
          "attribute": "department",
          "comparison": "=",
          "value": "Marketing"
        }
      }
    }
  },
  "right": {
    "type": "operator",
    "value": "OR",
    "left": {
      "type": "operand",
      "value": {
        "attribute": "salary",
        "comparison": ">",
        "value": 50000
      }
    },
    "right": {
      "type": "operand",
      "value": {
        "attribute": "experience",
        "comparison": ">",
        "value": 5
      }
    }
  }
}
```

## Data Storage
### Database Choice
- **PostgreSQL**: A powerful, open-source relational database suitable for storing structured data and complex queries.

### Sample Schema
```sql
CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Descriptive name for the rule
    rule_string TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

```

## Sample Rules
- **Rule 1**: `((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)`
- **Rule 2**: `((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)`
  

  ## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Margesh06/AST_RULE_ENGINE.git
   cd rule-engine-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Create a file named database.js inside your config folder and add the following code:** 
   ```
// config/database.js

const { Sequelize } = require('sequelize');

// Initialize a new instance of Sequelize for PostgreSQL
const sequelize = new Sequelize('db_name', 'username', 'password', { 
    host: 'localhost',
    dialect: 'postgres',
});

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;

   ```


5. **Start the Backend Server**
   ```bash
   cd backend
   node server.js
   ```

6. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

## API Design
### Endpoints
- `POST /`: Create a new rule.
- `POST /combine`: Combine multiple rules into a single AST.
- `POST /evaluate`: Evaluate a rule against user data.
- `GET /`: Retrieve all stored rules.

### API Functions
1. **create_rule(rule_string)**: 
   - Takes a string representing a rule and returns a Node object representing the corresponding AST.

2. **combine_rules(rules)**: 
   - Takes a list of rule strings and combines them into a single AST. Minimizes redundant checks and returns the root node of the combined AST.

3. **evaluate_rule(JSON data)**: 
   - Takes a JSON representing the combined rule's AST and a dictionary containing user attributes. Evaluates the rule and returns `True` if the user is eligible based on the rule, otherwise returns `False`.

## Test Cases
1. Create individual rules from the examples using `create_rule` and verify their AST representation.
2. Combine the example rules using `combine_rules` and ensure the resulting AST reflects the combined logic.
3. Implement sample JSON data and test `evaluate_rule` for different scenarios.
4. Explore combining additional rules and test the functionality.

## Snapshots


![image](https://github.com/user-attachments/assets/bbf237fb-b16d-4a70-b549-8c8b6ebe64bd)

![image](https://github.com/user-attachments/assets/1dfdf52f-7a24-4d9f-ab3b-f05203f52e71)


![image](https://github.com/user-attachments/assets/1590df89-3116-4008-80de-8609b72003a9)


