import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RuleForm.css'; // Import the CSS file

function RuleForm() {
    const [name, setName] = useState('');
    const [ruleString, setRuleString] = useState('');
    const [combineRuleIds, setCombineRuleIds] = useState(''); // State for rule IDs to combine
    const [combinedRuleString, setCombinedRuleString] = useState(''); // State for the combined rule string

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send request to create a new rule
            await axios.post('http://localhost:3000/api/rules', { name, rule_string: ruleString });
            alert('Rule created successfully');
            setName('');
            setRuleString('');
        } catch (error) {
            alert('Error creating rule');
        }
    };

    const handleCombineSubmit = async (e) => {
        e.preventDefault();
        try {
            const ruleIdsArray = combineRuleIds.split(',').map(id => id.trim()).filter(id => id);
    
            if (ruleIdsArray.length === 0) {
                alert('Please enter valid rule IDs.');
                return;
            }
    
            const response = await axios.post('http://localhost:3000/api/rules/combine', {
                ruleIds: ruleIdsArray // Sending ruleIds correctly
            });
    
            // Correctly access the combined rule string from response
            setCombinedRuleString(response.data.combinedRuleString); // Updated line
            alert('Rules combined successfully');
            setCombineRuleIds('');
        } catch (error) {
            console.error('Error combining rules:', error.response ? error.response.data : error.message);
            alert('Error combining rules');
        }
    };

    return (
        <div className="rule-form">
            <h2>Create Rule</h2>
            <form onSubmit={handleCreateSubmit}>
                <input
                    type="text"
                    placeholder="Rule Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Rule String"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    required
                />
                <button type="submit">Create Rule</button>
            </form>

            <h2>Combine Rules</h2>
            <form onSubmit={handleCombineSubmit}>
                <input
                    type="text"
                    placeholder="Combine Rule IDs (comma-separated)"
                    value={combineRuleIds}
                    onChange={(e) => setCombineRuleIds(e.target.value)}
                    required
                />
                <button type="submit">Combine Rules</button>
            </form>

            {/* Displaying the combined rule string */}
            {combinedRuleString && (
                <div className="combined-rule">
                    <h3>Combined Rule String:</h3>
                    <p>{combinedRuleString}</p>
                </div>
            )}
        </div>
    );
}

export default RuleForm;
